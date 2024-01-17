// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.0;

interface IHypGHOCollateral {

    event SentTransferRemote(
        uint32 indexed destination,
        bytes32 indexed recipient,
        uint256 amount
    );

    event ReceivedTransferRemote(
        uint32 indexed origin,
        bytes32 indexed recipient,
        uint256 amount
    );

    function domains() external view returns (uint32[] memory);

    function routers(uint32 _domain) external view returns (bytes32);

    function enrollRemoteRouter(uint32 _domain, bytes32 _router) external;

    function enrollRemoteRouters(
        uint32[] calldata _domains,
        bytes32[] calldata _routers
    ) external;

    function setInterchainSecurityModule(
        address _module
    ) public;

    function transferRemote(
        uint32 _destination,
        bytes32 _recipient,
        uint256 _amountOrId
    ) external payable virtual returns (bytes32 messageId);

    function balanceOf(address account) external virtual returns (uint256);

}
