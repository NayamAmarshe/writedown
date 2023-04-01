import Button from "@/components/ui/Button";
import type { NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div className="flex h-screen flex-col gap-5 overflow-hidden bg-gray-50 py-2">
      <div className="flex flex-row justify-between py-1 px-2 md:py-2 md:px-20">
        <div className="flex flex-row items-center justify-center gap-2">
          <img src="/logo.svg" alt="Writedown Logo" className="w-10" />
          <h4 className="text-2xl font-semibold">Writedown</h4>
        </div>
        <div className="flex flex-row">
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
      <div className="flex h-full px-5 md:flex-col md:justify-center md:px-24">
        <div className="flex flex-col-reverse justify-center gap-5 md:flex-row md:justify-between">
          <div className="flex flex-col gap-5 sm:max-w-md md:max-w-lg">
            <h2 className="text-5xl font-bold leading-tight text-gray-900 sm:text-7xl md:text-8xl">
              Write.
              <br />
              Share.
              <br />
              Inspire.
            </h2>
            <h4 className="text-gray-600 sm:text-xl md:text-xl">
              Take notes, write articles, share knowledge. Writedown is the free
              and open source platform for your text needs.
            </h4>
            <div>
              <Link href="/login">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
          <img src="/hero_illustration.svg" alt="" className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default Home;
