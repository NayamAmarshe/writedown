import React from "react";

const InfoSidebar = () => {
  return (
    <div className="hidden h-full w-1/2 flex-col gap-2 bg-slate-200 md:flex">
      <div className="flex h-3/5 items-end pb-10 pl-10">
        <p className="text-xl font-medium">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet
          doloribus, itaque quibusdam ut necessitatibus voluptate officia.
        </p>
      </div>
      <div className="h-full ">
        <div
          className="h-full w-full translate-x-10 rounded-xl"
          style={{
            background:
              "url(https://placehold.co/1900x1600) no-repeat center center/cover",
          }}
        />
      </div>
    </div>
  );
};

export default InfoSidebar;
