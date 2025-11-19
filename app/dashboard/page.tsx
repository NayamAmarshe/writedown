"use client";

import HeadTags from "@/components/common/head-tags";
import Dashboard from "@/components/dashboard";

const DashboardPage = () => {
  return (
    <>
      <div className="relative flex h-screen w-screen flex-row bg-slate-200 text-gray-900 dark:bg-slate-800">
        <HeadTags
          title="Dashboard - writedown"
          description="A simple and beautiful notes app with cloud sync, markdown and offline support. Write, share, inspire."
          ogImage="https://writedown.app/og-image.png"
          ogUrl="https://writedown.app"
        />
        <Dashboard />
      </div>
    </>
  );
};

export default DashboardPage;
