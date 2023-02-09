import React from 'react'
import Image from 'next/image'

const login = () => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-2 bg-gradient-to-r from-purple-500 to-pink-500">
            <div className='bg-white bg-opacity-40 py-24 px-10 mx-5 rounded-xl'>
                <h4 className='text-center mb-4 text-sm'>Login with one of the following:</h4>
                <button type='button' className='w-full py-3 px-2 inline-flex justify-center items-center gap-2 rounded-md  font-medium bg-black text-white align-middle hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm mb-6 '>
                    <Image src='/github.svg' className='invert' alt='google icon' width={28} height={16} />Sign In with Google
                </button>
                <button type="button" className="w-full py-3 px-2 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm">
                    <Image src='/google.svg' alt='google icon' width={24} height={16} />Sign In with Google
                </button>
                <span className='flex justify-center text-sm mt-10'><h4 className='mr-2'>No account yet?</h4><a href="#" className='font-bold'>Sign Up</a></span>
            </div>
        </div >
    )
}

export default login