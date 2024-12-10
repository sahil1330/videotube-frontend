import { NavLink } from "react-router";
import { Input } from "../ui/input";

const Header = () => {
  return (
    <div className="flex justify-between mx-4">
      <h1 className="text-2xl md:text-3xl font-bold text-blue-600">
        <NavLink to={"/"} className="flex items-center ">
          <img src="videotube_logo.png" alt="VideoTube" width={64} />
          VideoTube
        </NavLink>
      </h1>
      <Input className="md:w-2/4 w-2/4 border-2" placeholder="Search"></Input>
    </div>
  );
};

export default Header;
