import Link from "next/link";

export default function Navigation() {
  return (
    <div className="flex justify-center items-center mt-28 rounded-md shadow-sm" role="group">

    <Link href="/supplies">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 text-lg font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
        >
                    Your Supplies ➜
        </button> 
        </Link>

    <Link href="/borrows">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 text-lg font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
        >
                    Your Borrows ➜
        </button>
        </Link>

    <Link href="/facilitatorSupply">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 text-lg font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
        >
                    Facilitator Supply ➜
        </button>
        </Link>

      </div>

  )
}
