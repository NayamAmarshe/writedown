import HeroSection from "@/components/home/HeroSection";
import Features from "@/components/home/Features";
import Navbar from "@/components/home/Navbar";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col overflow-y-auto bg-slate-50">
      <Navbar />
      <HeroSection />
      <Features />
    </div>
  );
};

export default Home;
