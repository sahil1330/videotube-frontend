import React, { useCallback } from "react";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router";
import axiosInstance from "@/utils/axiosInstance";

interface SearchResult {
  _id: string;
  title: string;
}

function SearchInput() {
  const [isTyping, setIsTyping] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>([]);
  const navigate = useNavigate();

  const handleInputChange = useCallback(
    async (value: string) => {
      setIsLoading(true);

      // Clear any previous timeouts for proper debouncing
      const debounceTimeout = setTimeout(async () => {
        setIsLoading(false);
        if (value) {
          try {
            const response = await axiosInstance.get(`/search?q=${value}`);
            // Rest of the search handling code remains the same

            // Function to check for duplicates
            const isDuplicate = (id: string) => {
              return searchResults.some((result) => result?._id === id);
            };

            // Process video results
            const videoResults = response.data.data.videos
              .map((video: { _id: string; title: string }) => {
                // Skip duplicates
                if (isDuplicate(video._id)) {
                  return null;
                }

                return {
                  _id: video._id,
                  title: video.title,
                  type: "video",
                };
              })
              .filter(Boolean); // Remove null values

            // Process channel results
            const channelResults = response.data.data.users
              .map(
                (channel: {
                  _id: string;
                  username: string;
                  fullName: string;
                }) => {
                  if (isDuplicate(channel._id)) {
                    return null;
                  }

                  // Check if username or fullName matches search value
                  if (channel.username.includes(value)) {
                    return {
                      _id: channel._id,
                      title: channel.username,
                      type: "channel",
                    };
                  }

                  if (channel.fullName.includes(value)) {
                    return {
                      _id: channel._id,
                      title: channel.fullName,
                      type: "channel",
                    };
                  }

                  return null;
                }
              )
              .filter(Boolean); // Remove null values

            // Combine results
            const combinedResults = [...videoResults, ...channelResults];
            setSearchResults(combinedResults);
            console.log("Combined Results:", combinedResults);
          } catch (error) {
            console.error("Error searching:", error);
          }
        } else {
          // Clear results if search value is empty
          setSearchResults([]);
        }
      }, 1000);

      // Return cleanup function to clear timeout when component unmounts or new search starts
      return () => clearTimeout(debounceTimeout);
      setTimeout(async () => {
        setIsLoading(false);
        if (value) {
          try {
            const response = await axiosInstance.get(`/search?q=${value}`);
            console.log("Search Results: ", response.data.data);

            // Function to check for duplicates
            const isDuplicate = (id: string) => {
              return searchResults.some((result) => result?._id === id);
            };

            // Process video results
            const videoResults = response.data.data.videos
              .map((video: { _id: string; title: string }) => {
                // Skip duplicates
                if (isDuplicate(video._id)) {
                  return null;
                }

                return {
                  _id: video._id,
                  title: video.title,
                  type: "video",
                };
              })
              .filter(Boolean); // Remove null values

            // Process channel results
            const channelResults = response.data.data.users
              .map(
                (channel: {
                  _id: string;
                  username: string;
                  fullName: string;
                }) => {
                  if (isDuplicate(channel._id)) {
                    return null;
                  }

                  // Check if username or fullName matches search value
                  if (channel.username.includes(value)) {
                    return {
                      _id: channel._id,
                      title: channel.username,
                      type: "channel",
                    };
                  }

                  if (channel.fullName.includes(value)) {
                    return {
                      _id: channel._id,
                      title: channel.fullName,
                      type: "channel",
                    };
                  }

                  return null;
                }
              )
              .filter(Boolean); // Remove null values

            // Combine results
            const combinedResults = [...videoResults, ...channelResults];
            setSearchResults(combinedResults);
            console.log("Combined Results:", combinedResults);
          } catch (error) {
            console.error("Error searching:", error);
          }
        } else {
          // Clear results if search value is empty
          setSearchResults([]);
        }
      }, 1000); // Reduced delay for better UX
    },
    [searchResults]
  );

  return (
    <div className="md:w-3/4 w-3/4 relative">
      {isTyping ? (
        <div>
          <Input
            className="border-2 rounded-b-none"
            placeholder="Search"
            onClick={() => setIsTyping(true)}
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              handleInputChange(e.target.value);
            }}
          />
          {searchResults.length > 0 && (
            <div className="autoComplete bg-gray-700 rounded-y-md rounded-b-md w-full max-h-60 overflow-y-auto absolute top-10 left-0 z-10">
              {isLoading && (
                <div className="flex justify-center py-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
                </div>
              )}
              {searchResults.map((result) => (
                <div
                  key={result._id}
                  onClick={() => {
                    navigate(`/search?q=${result.title}`);
                    setIsTyping(false);
                    setSearchResults([]);
                  }}
                  className="autoCompleteItem text-white p-2 text-md hover:bg-gray-600 cursor-pointer"
                >
                  {result.title}
                </div>
              ))}
              <Separator className="bg-gray-600" />
            </div>
          )}
          <div className="absolute right-8 top-0 mt-2 mr-2 cursor-pointer text-white text-xl font-bold">
            <span
              onClick={() => {
                setIsTyping(false);
                setSearchResults([]);
                setSearchValue("");
              }}
            >
              <X className="text-white" />
            </span>
          </div>
          <div>
            <div className="absolute right-2 top-0 mt-2 mr-2 cursor-pointer text-white text-xl font-bold">
              <span
                onClick={() => {
                  if (searchValue) {
                    navigate(`/search?q=${searchValue}`);
                  }
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
          className="border-2"
          onClick={() => setIsTyping(true)}
          placeholder="Search"
        />
      )}
    </div>
  );
}

export default SearchInput;
