import React from "react";

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="flex w-full cursor-default flex-col gap-4 rounded-xl bg-slate-200 p-5 text-sm transition-all duration-300 hover:scale-105 hover:bg-sky-100 dark:bg-slate-700 sm:hover:scale-110">
      <h6 className="tex-base flex flex-col items-center gap-1 font-medium text-slate-900 dark:text-slate-100 sm:text-lg">
        {icon} {title}
      </h6>
      <p className="text-slate-600 dark:text-slate-300">{description}</p>
    </div>
  );
};

export default FeatureCard;
