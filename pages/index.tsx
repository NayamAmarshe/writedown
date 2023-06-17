import HeroSection from "@/components/home/HeroSection";
import Features from "@/components/home/Features";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col overflow-y-auto bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
      <Navbar />
      <HeroSection />
      <Features />
      <Footer />
    </div>
  );
};

export default Home;
