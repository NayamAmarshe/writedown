import HeroSection from "@/components/home/HeroSection";
import HeadTags from "@/components/common/HeadTags";
import Features from "@/components/home/Features";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col overflow-y-auto bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
      <HeadTags
        title="writedown - Your public and private diary"
        description="A simple and beautiful notes app with cloud sync, markdown and offline support. Write, share, inspire."
        ogImage="https://writedown.app/og-image.png"
        ogUrl="https://writedown.app"
      />
      <Navbar />
      <HeroSection />
      <Features />
      <Footer />
    </div>
  );
};

export default Home;
