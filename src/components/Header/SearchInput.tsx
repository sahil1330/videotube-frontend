import React, { useCallback } from "react";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router";
import axiosInstance from "@/utils/axiosInstance";

function SearchInput() {
  const [isTyping, setIsTyping] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const navigate = useNavigate();

  const handleInputChange = useCallback(
    async (value: string) => {
      setIsLoading(true);
      setTimeout(async () => {
        setIsLoading(false);
        if (value) {
          const response = await axiosInstance.get(`/search?q=${value}`);
          console.log("Search Results: ", response.data.data);
          setSearchResults(response.data.data.videos);
        }
      }, 1000); // Simulate a delay for loading
    },
    [navigate]
  );

  return (
    <div className="md:w-3/4 w-3/4 relative">
      {isTyping ? (
        <div>
          <Input
            className=" border-2 rounded-b-none"
            placeholder="Search"
            onClick={() => setIsTyping(true)}
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              handleInputChange(e.target.value);
            }}
          ></Input>
          <div className="autoComplete bg-gray-700 rounded-y-md rounded-b-md w-full h-auto overflow-y-auto absolute top-10 left-0 z-10">
            {searchResults.length > 0 &&
              searchResults.map((result) => (
                <div
                  key={result._id}
                  onClick={() => navigate(`/search?q=${result.title}`)}
                  className="autoCompleteItem text-white p-2 text-md"
                >
                  {result.title}
                </div>
              ))}
            <Separator className="bg-gray-600" />
          </div>
          <div className="absolute right-8 top-0 mt-2 mr-2 cursor-pointer text-white text-xl font-bold">
            <span onClick={() => setIsTyping(false)}>
              <X className="text-white" />
            </span>
          </div>
          <div>
            <div className="absolute right-2 top-0 mt-2 mr-2 cursor-pointer text-white text-xl font-bold">
              <span
                onClick={() => {
                  setIsTyping(false);
                }}
              >
                <Search />
              </span>
            </div>
          </div>
        </div>
      ) : (
        <Input
          className=" border-2"
          onClick={() => setIsTyping(true)}
          placeholder="Search"
        ></Input>
      )}
    </div>
  );
}

export default SearchInput;
