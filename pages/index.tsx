import Button from "@/components/Button";
import type { NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-row items-center justify-center gap-5 py-2">
      <Link href="/login">
        <Button variant="black">Login</Button>
      </Link>
      <Link href="/signup">
        <Button variant="gray">Sign Up</Button>
      </Link>
    </div>
  );
};

export default Home;
