import React from 'react'
import Button from '../components/Button'

const login = () => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-2">
            <div className='bg-white shadow-sm border py-24 px-10 mx-5 rounded-xl'>
                <h4 className='text-center mb-4 text-sm'>Login with one of the following:</h4>
                <Button text="Sign in with GitHub" type='custom' customStyle='bg-black text-white hover:bg-gray-800 mb-6' iconSrc='/github.svg' iconStyle='w-6 invert' />
                <Button text="Sign in with Google" type='secondary' iconSrc='/google.svg' iconStyle='w-6' />
                <span className='flex justify-center text-sm mt-10'><h4 className='mr-2'>No account yet?</h4><a href="/signup" className='font-bold hover:underline'>Sign Up</a></span>
            </div>
        </div >
    )
}

export default login