import Badge from "@/components/ui/Badge";
import React from "react";

const PostRow = () => {
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-slate-50 p-4">
      <h6 className="font-medium">My first post 🚀</h6>
      <div className="flex flex-col gap-2">
        <p className="text-sm text-slate-600">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolor,
          possimus...
        </p>
        <div className="flex flex-row flex-wrap gap-1">
          <Badge color="yellow">UI</Badge>
          <Badge color="green">Development</Badge>
          <Badge color="red">UX</Badge>
        </div>
      </div>
    </div>
  );
};

export default PostRow;
