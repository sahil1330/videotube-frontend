import { NavLink } from "react-router";
import { Input } from "../ui/input";
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react";
import { ModeToggle } from "../mode-toggle";

const Header = () => {
  return (
    <div className="flex justify-between items-center mx-4">
      <h1 className="text-2xl md:text-3xl font-bold text-blue-600">
        <NavLink to={"/"} className="flex items-center ">
          <Suspense fallback={<Skeleton className="w-16 h-16" />}>
            <img src="/videotube_logo.png" alt="VideoTube" width={64} />
          </Suspense>
          VideoTube
        </NavLink>
      </h1>
      <Input className="md:w-2/4 w-2/4 border-2" placeholder="Search"></Input>
      <ModeToggle />
    </div>
  );
};

export default Header;
