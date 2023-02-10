import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Button from "../components/Button";
const Home: NextPage = () => {
  return (
    <div className='my-5'>
      <a className='px-4  hover:underline' href="login">Login Page</a>
      <a className='hover:underline' href="signup">Signup Page</a>
    </div>
  )
}

export default Home
