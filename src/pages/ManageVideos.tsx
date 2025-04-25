/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { UserSchema, VideoSchema } from "@/schemas";
import { authState } from "@/types";
import axiosInstance from "@/utils/axiosInstance";
import geterrorMessage from "@/utils/errorMessage";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Loader2, MoreVertical } from "lucide-react";
import { useEffect, useState, useRef, Suspense } from "react";
import { useSelector } from "react-redux";

function ManageVideos() {
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState<VideoSchema[]>([]);
  const { toast } = useToast();
  const userDetailsRef = useRef<UserSchema | null>(null);
  const currentUser = useSelector((state: authState) => state.auth.user);

  useEffect(() => {
    setIsLoading(true);
    try {
      if (currentUser) {
        userDetailsRef.current = currentUser as UserSchema;
      }
      (async () => {
        const response = await axiosInstance.get(
          `/videos?userId=${userDetailsRef.current?._id}&sortBy=createdAt&sortType=desc`
        );
        setVideos(response.data.data.docs);
      })();
    } catch (error) {
      const errorMessage = geterrorMessage((error as any)?.response.data);
      console.error("Error fetching videos:", errorMessage);
      toast({
        title: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleEditVideo = (videoId: string) => {
    // Navigate to the edit video page with the video ID
    window.location.href = `/edit-video/${videoId}`;
  };

  const handleDeleteVideo = async (videoId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this video? This action cannot be undone."
    );
    if (confirmDelete) {
      setIsLoading(true);
      try {
        const response = await axiosInstance.delete(`/videos/${videoId}`);
        setVideos((prev) => prev.filter((video) => video._id !== videoId));
        toast({
          title: response.data.message,
          variant: "default",
        });
      } catch (error) {
        const errorMessage = geterrorMessage((error as any)?.response.data);
        console.error("Error deleting video:", errorMessage);
        toast({
          title: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      toast({
        title: "Video not deleted",
        description: "The video was not deleted.",
        variant: "default",
      });
    }
  };

  return !isLoading ? (
    <div>
      <h1 className="text-2xl font-bold p-2 text-pretty text-primary">
        Manage your videos
      </h1>
      <div className="videos">
        {videos.length > 0 ? (
          videos.map((video) => (
            <div
              key={video._id}
              className="flex  gap-6 md:p-4 relative border border-gray-200 rounded-md mx-4 p-2 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out w-full md:w-3/4"
            >
              <div className="videoThumbnail">
                <Suspense
                  fallback={<Loader2 className="animate-spin text-primary" />}
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="aspect-video w-1/2 md:w-1/3 rounded-md"
                    loading="lazy"
                  />
                </Suspense>
              </div>
              <div className="videoDetails">
                <h2 className="md:text-3xl font-semibold">{video.title}</h2>
                <p className="md:text-md text-gray-500">{video.description}</p>
                <p className="text-gray-500 text-sm mt-10">
                  {new Date(video.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="morefeatures absolute right-0 top-0 p-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"}>
                      <MoreVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleEditVideo(video._id)}
                      className="flex items-center justify-center text-lg p-2 rounded-md border border-gray-200 "
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDeleteVideo(video._id)}
                      className="flex items-center justify-center text-lg p-2 bg-red-600 rounded-md"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        ) : (
          <p>No videos found.</p>
        )}
      </div>
    </div>
  ) : (
    <div className="flex flex-1 items-center justify-center h-screen">
      <Loader2 className="animate-spin text-primary" />
    </div>
  );
}

export default ManageVideos;
