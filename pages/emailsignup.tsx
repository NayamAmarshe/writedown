import type { NextPage } from "next";
import { useRouter } from "next/router";
import Button from "../components/Button";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Router } from "next/router";
const Signup: NextPage = () => {
    const router = useRouter()

    return (
        
        <div className="flex h-screen w-screen flex-col items-center justify-center">
            {/*Main div*/}

            <div className="flex flex-col gap-10 rounded-xl border bg-white p- shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:shadow-slate-700/[.7] md:p-5">
                {/*Border div*/}
                <div>
                    <h3 className="text-center text-xl font-semibold">
                        Welcome to WriteDown
                    </h3>
                </div>
                <div className="flex flex-col gap-2">
                    {/*Buttons div*/}
                    <p className="text-center text-sm font-semibold mb-2">
                        Sign Up with E-Mail:
                    </p>
                    <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter e-mail" required />
                    <input type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter a password" required />
                    <div className="flex justify-center mt-2">
                        <div className="flex flex-row gap-3">
                            <Button variant="solid-black">Sign Up</Button>
                            <Button variant="outline" onClick={() => router.push("signup")}>Other sign up options<AiOutlineArrowRight /></Button>
                        </div>
                    </div>

                </div>

                <span className="flex justify-center mx-5">
                    <p className="">Already have an account?</p>
                    <a href="login" className="font-bold hover:underline">
                        Sign In
                    </a>
                </span>
            </div>
        </div>
    );
};

export default Signup;
