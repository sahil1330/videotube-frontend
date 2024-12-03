import { Input } from "../ui/input";

const Header = () => {
  return (
    <div className="flex justify-between m-4">
      <h1 className="text-2xl md:text-3xl font-bold text-blue-600">
        VideoTube
      </h1>
      <Input className="md:w-2/4 w-2/4 border-2" placeholder="Search"></Input>
    </div>
  );
};

export default Header;
