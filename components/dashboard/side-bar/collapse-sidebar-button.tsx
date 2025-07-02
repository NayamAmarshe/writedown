import { showSidebarAtom } from "@/lib/atoms/user-data-atom";
import { cn } from "@/lib/utils";
import { useAtom } from "jotai";
import { ChevronLeftIcon } from "lucide-react";

const CollapseSidebarButton = ({ className }: { className?: string }) => {
  const [showSidebar, setShowSidebar] = useAtom(showSidebarAtom);

  return (
    <button
      onClick={() => setShowSidebar(!showSidebar)}
      className={cn(
        "fixed z-20 ml-auto top-[10px] right-[15px] sm:absolute sm:top-1/2 sm:-right-5 sm:z-10 sm:block rounded-full p-2 bg-slate-100 dark:bg-slate-800 sm:bg-white sm:dark:bg-slate-900 cursor-pointer",
        showSidebar ? "rotate-0" : "rotate-180",
        className
      )}
      data-testid="sidebarToggle"
    >
      <ChevronLeftIcon className={cn(`size-5 dark:text-slate-100`)} />
    </button>
  );
};

export default CollapseSidebarButton;
