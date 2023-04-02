import Skeleton from "react-loading-skeleton";
import React from "react";

type PostRowProps = {
  title: string;
  content: string;
};

const PostRow = ({ title, content }: PostRowProps) => {
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-slate-50 p-4">
      <h6 className="font-medium">{title || <Skeleton className="w-1/2" />}</h6>
      <div className="flex flex-col gap-2">
        <p className="text-sm text-slate-600">{content || <Skeleton />}</p>

        {/* TODO: Add tags  */}
        {/* <div className="flex flex-row flex-wrap gap-1">
          <Badge color="yellow">UI</Badge>
          <Badge color="green">Development</Badge>
          <Badge color="red">UX</Badge>
        </div> */}
      </div>
    </div>
  );
};

export default PostRow;
