import React, { HTMLAttributes } from "react";

type BadgeProps = {
  children: React.ReactNode;
  color: "yellow" | "green" | "red" | "blue" | "purple" | "pink";
};

const Badge = ({ children, color }: BadgeProps) => {
  const getColorClasses = () => {
    switch (color) {
      case "yellow":
        return "bg-yellow-100 text-yellow-800";
      case "green":
        return "bg-green-100 text-green-800";
      case "red":
        return "bg-red-100 text-red-800";
      case "blue":
        return "bg-blue-100 text-blue-800";
      case "purple":
        return "bg-purple-100 text-purple-800";
      case "pink":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      className={`${getColorClasses()} cursor-pointer select-none rounded-full px-2 text-xs`}
    >
      {children}
    </div>
  );
};

export default Badge;
