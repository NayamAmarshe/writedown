// import HeroSection from "@/components/home/HeroSection";
// import Features from "@/components/home/Features";
// import Navbar from "@/components/home/Navbar";
// import Footer from "@/components/home/Footer";
import type { NextPage } from "next";
import TopBar from "@/components/frontPage/Topbar";
import Button from "@/components/ui/Button";
import FrontImage from "@/components/frontPage/Combined/FrontImage";
import {
  MainTitle,
  CathPhrase1,
} from "@/components/frontPage/Combined/TextFields";
import ShowcaseImages from "@/components/frontPage/Combined/ShowcaseImages";
import { FeatureBoxGrid } from "@/components/frontPage/FeatureBox";
import WriteOnceAccessAnywhere from "@/components/frontPage/Combined/WriteOnceAccessAnywhere";
import UsedTechnologies from "@/components/frontPage/Combined/UsedTechnologies";
import FinalSection from "@/components/frontPage/Combined/FinalSection";
import Footer from "@/components/frontPage/CustomFooter";
import HeadTags from "@/components/common/HeadTags";

const Home: NextPage = () => {
  return (
    <div className="max-w-screen overflow-hidden bg-slate-50 pt-32 dark:bg-slate-900">
      <HeadTags
        title="writedown - Your public and private diary"
        description="A simple and beautiful notes app with cloud sync, markdown and offline support. Write, share, inspire."
        ogImage="https://writedown.app/og-image.png"
        ogUrl="https://writedown.app"
      />
      <TopBar></TopBar>
      <div className="mb-12 flex flex-col gap-12 text-center">
        <MainTitle></MainTitle>
        <div>
          <Button variant="dark">Write now!</Button>
        </div>
      </div>
      <FrontImage></FrontImage>
      <div className="my-32 text-center">
        {/* No, I am not gonna fix the typo -presi300 */}
        <CathPhrase1></CathPhrase1>
        <ShowcaseImages></ShowcaseImages>
        <h2 className="text-h2">
          Features, plenty. <br />
          Looks, fancy ✨
        </h2>
      </div>

      <FeatureBoxGrid></FeatureBoxGrid>
      <WriteOnceAccessAnywhere></WriteOnceAccessAnywhere>
      <UsedTechnologies></UsedTechnologies>
      <FinalSection></FinalSection>
      <Footer></Footer>
    </div>
  );
};

export default Home;
