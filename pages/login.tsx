import React from "react";
import Button from "../components/Button";
import { AiFillGithub, AiFillGoogleCircle } from "react-icons/ai";

const login = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div className="bg-white shadow-sm border py-24 px-10 mx-5 rounded-xl">
        <h4 className="text-center mb-4 text-sm">
          Login with one of the following:
        </h4>
        <Button type="primary">
          <AiFillGithub /> Sign in with GitHub
        </Button>
        <Button type="secondary">
          <AiFillGoogleCircle />
        </Button>
        <span className="flex justify-center text-sm mt-10">
          <h4 className="mr-2">No account yet?</h4>
          <a href="/signup" className="font-bold hover:underline">
            Sign Up
          </a>
        </span>
      </div>
    </div>
  );
};

export default login;
