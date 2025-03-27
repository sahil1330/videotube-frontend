/* eslint-disable @typescript-eslint/no-explicit-any */
import VideosListSkeleton from "@/components/Skeletons/VideosListSkeleton";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserSchema, VideoSchema } from "@/schemas";
import axiosInstance from "@/utils/axiosInstance";
import { Avatar } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import {
  formatDistanceToNow,
} from "date-fns";
import { Loader2, MoreVertical } from "lucide-react";
import React, { useEffect, useState } from "react";

interface videoSearchResult {
  _id: string;
  title: string;
  thumbnail: string;
  videoFile: string;
  description: string;
  views: number;
  owner: UserSchema;
  duration: number | null;
  createdAt: string;
  updatedAt: string;
  type: "video";
}

interface channelSearchResult {
  _id: string;
  username: string;
  fullName: string;
  avatar: string;
  coverImage: string;
  createdAt: string;
  type: "channel";
}

function SearchResults() {
  const [isLoading, setIsLoading] = useState(true);
  const [videoSearchResults, setVideoSearchResults] = useState<
    videoSearchResult[]
  >([]);
  const [userSearchResults, setUserSearchResults] = useState<
    channelSearchResult[]
  >([]);
  const query = new URLSearchParams(window.location.search).get("q") || "";
  const { toast } = useToast();

  const isDuplicate = (id: string, type: string) => {
    if (type === "video") {
      return videoSearchResults.some((result) => result?._id === id);
    }
    if (type === "channel") {
      return userSearchResults.some((result) => result?._id === id);
    }
    // If type is not recognized, return false
    return false;
  };
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`/search?q=${query}`);
        console.log("Search Results: ", response.data.data);
        // Function to check for duplicates
        const videoResult = response.data.data.videos.map(
          (video: VideoSchema) => {
            if (isDuplicate(video._id, "video")) {
              return;
            }
            return {
              ...video,
              type: "video",
            };
          }
        );
        const channelResult = response.data.data.users.map(
          (channel: UserSchema) => {
            if (isDuplicate(channel._id, "channel")) {
              return;
            }
            return {
              ...channel,
              type: "channel",
            };
          }
        );
        setVideoSearchResults(
          videoResult.filter(Boolean) as videoSearchResult[]
        );
        setUserSearchResults(
          channelResult.filter(Boolean) as channelSearchResult[]
        );
      } catch (error) {
        const errorMessage =
          (error as any)?.response?.data?.message || "An error occurred";
        console.error("Error fetching search results: ", errorMessage);
        toast({
          title: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);
  const formatDuration = (duration: number) => {
    if (duration > 60) {
      const minutes = duration / 60;
      const seconds = duration % 60;
      return `${Math.floor(minutes)}:${seconds < 10 ? "0" : ""}${Math.floor(
        seconds
      )}`;
    }
    if (duration > 36000) {
      const hours = Math.floor(duration / 3600);
      const minutes = Math.floor((duration % 3600) / 60);
      const seconds = duration % 60;
      return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
        seconds < 10 ? "0" : ""
      }${seconds}`;
    }
  };
  return (
    <div>
      {isLoading && (
        <div className="flex flex-1 items-center justify-center">
          <VideosListSkeleton />
        </div>
      )}
      <div className="flex flex-1 flex-col sm:gap-4 gap-2 md:px-8 p-4 pt-0">
        {/* Search results will be displayed here */}
        {userSearchResults.length > 0 && (
          <div className="flex flex-col gap-4 relative">
            {userSearchResults.map((channel) => (
              <div key={channel._id} className="flex mx-10 gap-8 my-2">
                <div className="w-1/3 flex justify-center items-center relative">
                  <div className="w-2/3">
                    <Avatar className="h-full rounded-full">
                      <AvatarImage
                        src={channel.avatar}
                        alt={channel.username}
                        className="rounded-full aspect-square w-full h-full"
                      />
                      <AvatarFallback className="bg-gray-500">
                        {channel.username}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <div className="video-details my-4 flex flex-col gap-2">
                  <h2 className="text-lg font-semibold">{channel.fullName}</h2>
                  <p className="text-sm text-gray-500 flex gap-2 items-center">
                    {channel.username}{" "}
                    <Separator className="text-white bg-white" /> |
                    {formatDistanceToNow(new Date(channel.createdAt), {
                      addSuffix: true,
                    })}{" "}
                  </p>
                </div>
                <Button
                  variant={"secondary"}
                  className="absolute top-2 right-2"
                >
                  <MoreVertical />
                </Button>
              </div>
            ))}
          </div>
        )}
        {videoSearchResults.length > 0 && (
          <div className="flex flex-col gap-4 relative">
            {videoSearchResults.map((video) => (
              <div key={video._id} className="flex gap-2">
                <div className="w-1/3 aspect-video relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="h-auto w-full rounded-md"
                  />
                  {video.duration && (
                    <span className="text-sm text-white-500 absolute bottom-2 right-2 bg-black  px-2 py-1 rounded-md">
                      {formatDuration(video.duration)}
                    </span>
                  )}
                </div>
                <div className="video-details">
                  <h2 className="text-lg font-semibold">{video.title}</h2>
                  <p className="text-sm text-gray-500 flex gap-2 items-center">
                    {video.views} Views{" "}
                    <Separator className="text-white bg-white" /> |
                    {formatDistanceToNow(new Date(video.createdAt), {
                      addSuffix: true,
                    })}{" "}
                  </p>
                  <div className="owner-details my-2 flex items-center gap-2">
                    <img
                      src={video.owner.avatar}
                      alt={video.owner.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <p className="text-sm text-gray-500">
                      {video.owner.username}
                    </p>
                  </div>
                  <p className="my-2">
                    {video?.description.length > 100
                      ? video.description.substring(0, 100) + "..."
                      : video.description}
                  </p>
                </div>
                <Button
                  variant={"secondary"}
                  className="absolute top-2 right-2"
                >
                  <MoreVertical />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      {isLoading && (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="animate-spin w-80" />
        </div>
      )}
    </div>
  );
}

export default SearchResults;
