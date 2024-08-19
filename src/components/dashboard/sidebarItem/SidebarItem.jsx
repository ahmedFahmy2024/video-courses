import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const SidebarItem = ({ icon: Icon, label, href }) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive =
    (pathname === "/" && href === "/") || // Case 1: True if both the current path and the href are exactly the root "/"
    pathname === href || // Case 2: True if the current path matches the href exactly
    pathname?.startsWith(`${href}/`); // Case 3: True if the current path starts with href followed by a "/"

  const onClick = () => {
    router.push(href);
  };

  return (
    <button
      className={cn(
        "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
        isActive &&
          "text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700"
      )}
      onClick={onClick}
      type="button"
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon size={22} className={cn("text-slate-500", isActive && "text-sky-700")} />
        {label}
      </div>
      <div className={cn("ml-auto opacity-0 border-2 border-sky-700 h-full transition-all", isActive && "opacity-100")} />
    </button>
  );
};

export default SidebarItem;
