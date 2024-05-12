// import HeroSection from "@/components/home/HeroSection";
// import Features from "@/components/home/Features";
// import Navbar from "@/components/home/Navbar";
// import Footer from "@/components/home/Footer";
import type { NextPage } from "next";
import TextBox from "@/components/FrontPage/textbox";
import TopBar from "@/components/FrontPage/topbar";
import Btn from "@/components/FrontPage/button";
import FrontImage from "@/components/FrontPage/Combined/frontImage";
import {
  MainTitle,
  CathPhrase1,
} from "@/Components/FrontPage/Combined/textFields";
import ShowcaseImages from "@/Components/FrontPage/Combined/showcaseImages";
import { FeatureBoxGrid } from "@/Components/FrontPage/featureBox";
import WriteOnceAccessAnywhere from "@/Components/FrontPage/Combined/WriteOnceAccessAnywhere";
import UsedTechnologies from "@/Components/FrontPage/Combined/usedTechnologies";
import FinalSection from "@/Components/FrontPage/Combined/finalSection";
import Footer from "@/Components/FrontPage/customFooter";
import HeadTags from "@/components/common/HeadTags";

const Home: NextPage = () => {
  return (
    <div className="max-w-screen overflow-hidden bg-chalk-50 pt-32 dark:bg-midnight-300">
      <HeadTags
        title="writedown - Your public and private diary"
        description="A simple and beautiful notes app with cloud sync, markdown and offline support. Write, share, inspire."
        ogImage="https://writedown.app/og-image.png"
        ogUrl="https://writedown.app"
      />
      <TopBar></TopBar>
      <div className="mb-12 flex flex-col gap-12 text-center">
        <MainTitle></MainTitle>
        <Btn variant="page">Write now!</Btn>
      </div>
      <FrontImage></FrontImage>
      <div className="my-32 text-center">
        {/* No, I am not gonna fix the typo -presi300 */}
        <CathPhrase1></CathPhrase1>
        <ShowcaseImages></ShowcaseImages>
        <TextBox variant="h2">Features, plenty.</TextBox>
        <TextBox variant="h2">Looks, fancy ✨</TextBox>
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
