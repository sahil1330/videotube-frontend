/* eslint-disable @typescript-eslint/no-explicit-any */
import { useToast } from "@/hooks/use-toast";
import { VideoSchema } from "@/schemas";
import { authState } from "@/types";
import axiosInstance from "@/utils/axiosInstance";
import geterrorMessage from "@/utils/errorMessage";
import { formatDistanceToNow } from "date-fns";
import { Loader2, MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
function UserVideos() {
  const userDetails = useSelector((state: authState) => state.auth.user);
  const [videos, setVideos] = useState<Array<VideoSchema>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  useEffect(() => {
    setIsLoading(true);
    async function fetchUserVideos() {
      try {
        const response = await axiosInstance.get(
          `/videos?sortBy=createdAt&sortType=desc&userId=${userDetails?._id}`
        );
        setVideos(response.data.data.docs);
        console.log(response.data.data.docs);
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorMessage = geterrorMessage((error as any)?.response?.data);
        toast({
          title: errorMessage,
          variant: "destructive",
        });
      }
    }
    fetchUserVideos();
    setIsLoading(false);
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

  return (
    <div>
      <h1 className="p-4 text-3xl font-bold text-primary">My Videos</h1>
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="animate-spin w-80" />
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-4 p-4 md:px-8 pt-0">
          {videos.length > 0 ? (
            videos.map((video) => (
              <Link
                to={`/watch/${video._id}`}
                className="flex flex-col"
                key={video._id}
              >
                <div
                  className="flex flex-1 flex-col gap-4 md:px-8 pt-0 w-full relative z-0"
                  key={video._id}
                >
                  <div className="flex">
                    <video
                      src={video.videoFile}
                      className="aspect-video md:w-96 w-1/2 rounded-md"
                      muted
                      poster={video.thumbnail}
                      autoPlay={false}
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => e.currentTarget.pause()}
                    ></video>
                    <div className="videoDetails p-4 flex flex-col gap-4 text-primary">
                      <h1 className="md:text-2xl text-md font-bold">
                        {video.title}
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(video.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="morefeatures absolute right-0 top-0 p-2 z-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"}>
                          <MoreVertical />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="md:w-56 ">
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleEditVideo(video._id)}
                          className="flex items-center justify-center md:text-lg p-2 rounded-md border border-gray-200 "
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
              </Link>
            ))
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <h1 className="text-2xl font-bold">No Videos Found</h1>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UserVideos;
