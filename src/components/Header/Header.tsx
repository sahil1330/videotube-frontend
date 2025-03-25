import { NavLink } from "react-router";
import { Input } from "../ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { ModeToggle } from "../mode-toggle";

const Header = () => {
  return (
    <div className="flex justify-between gap-4 w-full items-center md:mx-4 mx-2 my-3">
      <h1 className="text-2xl md:text-3xl font-bold text-blue-600">
        <NavLink to={"/"} className="flex items-center">
          <Suspense fallback={<Skeleton className="md:w-16 md:h-16" />}>
            <img
              src="/videotube_logo.png"
              alt="VideoTube"
              className="md:w-[64px] w-[44px]"
            />
          </Suspense>
          <span className="md:text-3xl text-xl">VideoTube</span>
        </NavLink>
      </h1>
      <Input className="md:w-3/4 w-2/4 border-2" placeholder="Search"></Input>
      <div className="hidden md:flex items-center gap-4">
        {/* TODO: Add the ModeToggle component somewhere in the sidebar for mobile */}
        <ModeToggle />
      </div>
    </div>
  );
};

export default Header;
