import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
const Home: NextPage = () => {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center py-2">
        <head>
            <title>WriteDown</title>
        </head>
        <body>
        <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
  <div className="sm:hidden">
    <label  className="sr-only">Select a nav</label>
    <select name="hs-card-nav-tabs" id="hs-card-nav-tabs" className="block w-full border-t-0 border-x-0 border-gray-300 rounded-t-xl focus:ring-blue-600 focus:border-blue-600">
      <option selected>My Account</option>
      <option>Company</option>
      <option>Team Members</option>
      <option>Billing</option>
    </select>
  </div>

  <div className="hidden sm:block">
    <nav className="relative z-0 flex border-b rounded-xl divide-x divide-gray-200 dark:border-gray-700 dark:divide-gray-700" aria-label="Tabs">
      <a className="group relative min-w-0 flex-1 bg-white py-4 px-4 border-b-2 border-b-blue-600 text-gray-900 rounded-tl-xl text-sm font-medium text-center overflow-hidden hover:bg-gray-50 focus:z-10 dark:bg-gray-800 dark:text-gray-300" aria-current="page" href="#">
        My Account
      </a>

      <a className="group relative min-w-0 flex-1 bg-white py-4 px-4 text-gray-500 hover:text-gray-700 text-sm font-medium text-center overflow-hidden hover:bg-gray-50 focus:z-10 dark:bg-gray-800 dark:hover:text-gray-400" href="#">
        Company
      </a>

      <a className="group relative min-w-0 flex-1 bg-white py-4 px-4 text-gray-500 hover:text-gray-700 text-sm font-medium text-center overflow-hidden hover:bg-gray-50 focus:z-10 dark:bg-gray-800 dark:hover:text-gray-400" href="#">
        Team Members
      </a>

      <a className="group relative min-w-0 flex-1 bg-white py-4 px-4 text-gray-500 hover:text-gray-700 rounded-tr-xl text-sm font-medium text-center overflow-hidden hover:bg-gray-50 focus:z-10 dark:bg-gray-800 dark:hover:text-gray-400" href="#">
        Billing
      </a>
    </nav>
  </div>

  <div className="p-4 text-center md:py-7 md:px-5">
    <h3 className="text-lg font-bold text-gray-800 dark:text-white">
      Card title
    </h3>
    <p className="mt-2 text-gray-800 dark:text-gray-400">
      With supporting text below as a natural lead-in to additional content.
    </p>
    <a className="mt-3 py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800" href="#">
      Go somewhere
    </a>
  </div>
</div>
        </body>
      </div>
    )
  }
  
  export default Home
  