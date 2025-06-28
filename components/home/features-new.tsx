import {
  FiBox,
  FiCloudLightning,
  FiEye,
  FiGithub,
  FiGlobe,
  FiPackage,
  FiRefreshCcw,
  FiSmile,
  FiSun,
  FiUserCheck,
  FiWifiOff,
} from "react-icons/fi";
import FeatureCard from "./feature-card";
import React from "react";

const Features = () => {
  return (
    <div className="mb-10 grid grid-cols-1 content-center gap-4 px-4 sm:grid-cols-2 sm:gap-8 sm:px-5 md:px-20 lg:grid-cols-2 lg:px-36 xl:grid-cols-5">
      <FeatureCard
        icon={<FiGlobe className="h-6 w-6" />}
        title="Free and Open Source"
        description="Sharing is caring, writedown is completely free and open source and licensed under AGPLv3."
      />

      <FeatureCard
        icon={<FiCloudLightning className="h-6 w-6" />}
        title="Synced on all your devices"
        description="All your notes are synced on all your devices. You can access them from anywhere."
      />

      <FeatureCard
        icon={<FiWifiOff className="h-6 w-6" />}
        title="Offline Support"
        description="Write and save notes even when you are away from the internet!"
      />

      <FeatureCard
        icon={<FiEye className="h-6 w-6" />}
        title="Live Markdown"
        description="Writedown supports Markdown. You can write markdown and preview it in real-time."
      />

      <FeatureCard
        icon={<FiSmile className="h-6 w-6" />}
        title="Easy to Use"
        description="Writedown is easy to use with a beautiful interface. Get started in just 5 seconds!"
      />
    </div>
  );
};

export default Features;
