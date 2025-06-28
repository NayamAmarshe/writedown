import HeroSection from "@/components/home/hero-section";
import HeadTags from "@/components/common/head-tags";
import Features from "@/components/home/features";
import Navbar from "@/components/home/navbar-new";
import Footer from "@/components/home/footer-component";
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
