// SPDX-License-Identifier: BSD-3-Clause-Clear

pragma solidity 0.8.19;

import "fhevm/abstracts/EIP712WithModifier.sol";
import { EnumerableSet } from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";

import "fhevm/lib/TFHE.sol";
import { IGhoToken } from "../interfaces/IGhoToken.sol";

contract EncryptedGHO is EIP712WithModifier, AccessControl, IGhoToken {
    euint32 private totalSupply;
    string public constant name = "GHO Private Token";
    string public constant symbol = "GHO";
    uint8 public constant decimals = 18;

    // used for output authorization
    bytes32 private DOMAIN_SEPARATOR;

    // A mapping from address to an encrypted balance.
    mapping(address => euint32) internal balances;

    // A mapping of the form mapping(owner => mapping(spender => allowance)).
    mapping(address => mapping(address => euint32)) internal allowances;

    // The owner of the contract.
    address internal contractOwner;

    using EnumerableSet for EnumerableSet.AddressSet;

    mapping(address => Facilitator) internal _facilitators;
    EnumerableSet.AddressSet internal _facilitatorsList;

    /// @inheritdoc IGhoToken
    bytes32 public constant FACILITATOR_MANAGER_ROLE = keccak256("FACILITATOR_MANAGER_ROLE");

    /// @inheritdoc IGhoToken
    bytes32 public constant BUCKET_MANAGER_ROLE = keccak256("BUCKET_MANAGER_ROLE");

    constructor(address admin, address facilitatorManager, address bucketManager) EIP712WithModifier("GHO token", "1") {
        contractOwner = msg.sender;
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        _setupRole(FACILITATOR_MANAGER_ROLE, facilitatorManager);
        _setupRole(BUCKET_MANAGER_ROLE, bucketManager);
    }

    // Sets the balance of the owner to the given encrypted balance.
    function mint(address account, bytes calldata encryptedAmount) public {
        Facilitator storage f = _facilitators[msg.sender];
        euint32 amount = TFHE.asEuint32(encryptedAmount);

        euint32 currentBucketLevel = f.bucketLevel;
        euint32 newBucketLevel = currentBucketLevel + amount;
        TFHE.optReq(TFHE.ge(f.bucketCapacity, newBucketLevel));
        f.bucketLevel = newBucketLevel;

        balances[account] = TFHE.add(balances[account], amount);
        totalSupply = TFHE.add(totalSupply, amount);
    }

    function burn(address account, bytes calldata encryptedAmount) public {
        euint32 amount = TFHE.asEuint32(encryptedAmount);

        Facilitator storage f = _facilitators[msg.sender];
        euint32 currentBucketLevel = f.bucketLevel;
        euint32 newBucketLevel = currentBucketLevel - amount;
        f.bucketLevel = newBucketLevel;

        balances[account] = TFHE.sub(balances[account], amount);
        totalSupply = TFHE.sub(totalSupply, amount);
        TFHE.optReq(TFHE.le(amount, balances[account]));
    }

    // Transfers an encrypted amount from the message sender address to the `to` address.
    function transfer(address to, bytes calldata encryptedAmount) public {
        transfer(to, TFHE.asEuint32(encryptedAmount));
    }

    // Transfers an amount from the message sender address to the `to` address.
    function transfer(address to, euint32 amount) public {
        _transfer(msg.sender, to, amount);
    }

    function getTotalSupply(
        bytes32 publicKey,
        bytes calldata signature
    ) public view onlyContractOwner onlySignedPublicKey(publicKey, signature) returns (bytes memory) {
        return TFHE.reencrypt(totalSupply, publicKey);
    }

    // Returns the balance of the caller under their public FHE key.
    // The FHE public key is automatically determined based on the origin of the call.
    function balanceOf(
        bytes32 publicKey,
        bytes calldata signature
    ) public view onlySignedPublicKey(publicKey, signature) returns (bytes memory) {
        return TFHE.reencrypt(balances[msg.sender], publicKey, 0);
    }

    function encryptedBalance(address account) external view returns (euint32) {
        return balances[account];
    }

    // Sets the `encryptedAmount` as the allowance of `spender` over the caller's tokens.
    function approve(address spender, bytes calldata encryptedAmount) public {
        address owner = msg.sender;
        _approve(owner, spender, TFHE.asEuint32(encryptedAmount));
    }

    // Returns the remaining number of tokens that `spender` is allowed to spend
    // on behalf of the caller. The returned ciphertext is under the caller public FHE key.
    function allowance(
        address spender,
        bytes32 publicKey,
        bytes calldata signature
    ) public view onlySignedPublicKey(publicKey, signature) returns (bytes memory) {
        address owner = msg.sender;

        return TFHE.reencrypt(_allowance(owner, spender), publicKey);
    }

    // Transfers `encryptedAmount` tokens using the caller's allowance.
    function transferFrom(address from, address to, bytes calldata encryptedAmount) public {
        transferFrom(from, to, TFHE.asEuint32(encryptedAmount));
    }

    // Transfers `amount` tokens using the caller's allowance.
    function transferFrom(address from, address to, euint32 amount) public {
        address spender = msg.sender;
        _updateAllowance(from, spender, amount);
        _transfer(from, to, amount);
    }

    function _approve(address owner, address spender, euint32 amount) internal {
        allowances[owner][spender] = amount;
    }

    function _allowance(address owner, address spender) internal view returns (euint32) {
        return allowances[owner][spender];
    }

    function _updateAllowance(address owner, address spender, euint32 amount) internal {
        euint32 currentAllowance = _allowance(owner, spender);
        TFHE.optReq(TFHE.le(amount, currentAllowance));
        _approve(owner, spender, TFHE.sub(currentAllowance, amount));
    }

    // Transfers an encrypted amount.
    function _transfer(address from, address to, euint32 amount) internal {
        // Make sure the sender has enough tokens.
        TFHE.optReq(TFHE.le(amount, balances[from]));
        require(from != address(0));

        // Add to the balance of `to` and subract from the balance of `from`.
        balances[to] = TFHE.add(balances[to], amount);
        balances[from] = TFHE.sub(balances[from], amount);
    }

    modifier onlyContractOwner() {
        require(msg.sender == contractOwner);
        _;
    }

    function addFacilitator(
        address facilitatorAddress,
        string calldata facilitatorLabel,
        bytes calldata bucketCapacity
    ) external onlyRole(FACILITATOR_MANAGER_ROLE) {
        Facilitator storage facilitator = _facilitators[facilitatorAddress];
        require(bytes(facilitator.label).length == 0, "FACILITATOR_ALREADY_EXISTS");
        require(bytes(facilitatorLabel).length > 0, "INVALID_LABEL");

        facilitator.label = facilitatorLabel;
        facilitator.bucketCapacity = TFHE.asEuint32(bucketCapacity);

        _facilitatorsList.add(facilitatorAddress);

        // emit FacilitatorAdded(facilitatorAddress, keccak256(abi.encodePacked(facilitatorLabel)), bucketCapacity);
    }

    function removeFacilitator(address facilitatorAddress) external onlyRole(FACILITATOR_MANAGER_ROLE) {
        require(bytes(_facilitators[facilitatorAddress].label).length > 0, "FACILITATOR_DOES_NOT_EXIST");
        require(TFHE.decrypt(_facilitators[facilitatorAddress].bucketLevel) == 0, "FACILITATOR_BUCKET_LEVEL_NOT_ZERO");

        delete _facilitators[facilitatorAddress];
        _facilitatorsList.remove(facilitatorAddress);

        // emit FacilitatorRemoved(facilitatorAddress);
    }

    function setFacilitatorBucketCapacity(
        address facilitator,
        bytes calldata newCapacity
    ) external onlyRole(BUCKET_MANAGER_ROLE) {
        require(bytes(_facilitators[facilitator].label).length > 0, "FACILITATOR_DOES_NOT_EXIST");
        euint32 newCapacity = TFHE.asEuint32(newCapacity);

        // euint32 oldCapacity = _facilitators[facilitator].bucketCapacity;
        _facilitators[facilitator].bucketCapacity = newCapacity;

        // emit FacilitatorBucketCapacityUpdated(facilitator, oldCapacity, newCapacity);
    }

    // function getFacilitator(address facilitator) external view returns (Facilitator memory) {
    //     return _facilitators[facilitator];
    // }

    function getFacilitatorBucket(
        address facilitator,
        bytes32 publicKey
    ) external view returns (bytes memory, bytes memory) {
        return (
            TFHE.reencrypt(_facilitators[facilitator].bucketCapacity, publicKey),
            TFHE.reencrypt(_facilitators[facilitator].bucketLevel, publicKey)
        );
    }

    function getFacilitatorsList() external view returns (address[] memory) {
        return _facilitatorsList.values();
    }
}
