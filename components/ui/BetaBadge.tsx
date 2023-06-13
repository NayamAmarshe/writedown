import React from "react";

type BetaBadgeProps = {
  pulse?: boolean;
};

const BetaBadge = ({ pulse }: BetaBadgeProps) => {
  return (
    <span
      className={`ml-2 ${
        pulse && "animate-pulse"
      } rounded-full bg-violet-500 px-3 text-xs text-violet-100`}
    >
      BETA
    </span>
  );
};

export default BetaBadge;
