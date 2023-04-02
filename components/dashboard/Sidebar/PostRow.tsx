import Skeleton from "react-loading-skeleton";
import React from "react";

type PostRowProps = {
  title: string;
  content: string;
  selected: boolean;
  onClick: () => void;
};

const PostRow = ({ title, content, selected, onClick }: PostRowProps) => {
  return (
    <button
      className={`flex flex-col gap-2 rounded-xl p-4 ${
        selected ? "bg-slate-200" : "bg-slate-50"
      }`}
      onClick={onClick}
    >
      <h6 className="font-medium">{title || <Skeleton className="w-1/2" />}</h6>
      <button className="flex flex-col gap-2">
        <p className="text-sm text-slate-600">
          {content === (undefined || null) && <Skeleton />}
          {content || ""}
        </p>

        {/* TODO: Add tags  */}
        {/* <div className="flex flex-row flex-wrap gap-1">
          <Badge color="yellow">UI</Badge>
          <Badge color="green">Development</Badge>
          <Badge color="red">UX</Badge>
        </div> */}
      </button>
    </button>
  );
};

export default PostRow;
