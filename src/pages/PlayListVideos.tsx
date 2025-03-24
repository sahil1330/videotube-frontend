/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { PlayListSchema, VideoSchema } from "@/schemas";
import axiosInstance from "@/utils/axiosInstance";
import geterrorMessage from "@/utils/errorMessage";
import { formatDistanceToNow } from "date-fns";
import { Loader2, MoreVertical, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

function PlayListVideos() {
  const { slug } = useParams();
  const [playList, setPlaylist] = useState<PlayListSchema | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPlaylistVideos();
  }, []);

  const fetchPlaylistVideos = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/playlists/${slug}`);
      setPlaylist(response.data.data[0]);
      console.log("Playlist Videos: ", response.data.data[0].videos);
    } catch (error) {
      console.error("Error fetching playlist videos:", error);
      const errorMessage = geterrorMessage((error as any)?.response?.data);
      toast({
        title: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const handlePlayListShare = () => {
    // Implement share functionality here
    window.navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Playlist link copied to clipboard!",
      variant: "default",
    });
  };

  const removeVideoFromPlaylist = async (videoId: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.delete(
        `/playlists/remove-video/${slug}`,
        {
          data: {
            videoId,
          },
        }
      );

      toast({
        title: "Video removed from playlist",
        variant: "default",
      });
      setPlaylist(response.data.data);
    } catch (error) {
      console.error("Error removing video from playlist:", error);
      const errorMessage = geterrorMessage((error as any)?.response?.data);
      toast({
        title: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex md:flex-row flex-col justify-between items-start gap-4 p-4  text-white">
      <div className="left md:w-1/2 w-full dark:bg-gray-900 bg-gray-200 rounded-md md:h-[80vh] h-52 float-start p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">{playList?.name}</h1>
        </div>
        <p className="text-xl text-primary">{playList?.description}</p>
        <div>
          <Button onClick={handlePlayListShare} variant={"secondary"}>
            Share
          </Button>
        </div>
      </div>
      <div className="right md:w-1/2 w-full dark:bg-gray-700 bg-gray-200 rounded-md md:h-[80vh] max-h-[80vh] overflow-y-auto float-end">
        {playList?.videos && playList?.videos?.length > 0 ? (
          <div className="flex flex-col items-center justify-center p-4">
            {playList?.videos.map((video: VideoSchema) => (
              <div key={video._id} className="relative w-full">
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant="outline" className="bg-gray-900 p-1">
                        <MoreVertical className="text-white" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        className="cursor-pointer flex justify-between text-red-600"
                        onClick={() => removeVideoFromPlaylist(video._id)}
                      >
                        <span className="">Remove </span>
                        <Trash2 />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Link
                  to={`/watch/${video._id}`}
                  className="dark:bg-gray-800 shadow-lg w-full rounded-lg overflow-hidden flex mb-4"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="aspect-video md:w-2/4 w-1/3 h-auto rounded-lg"
                  />
                  <div className="p-2 w-2/4">
                    <h2 className="md:text-xl text-md font-bold text-primary">
                      {video.title.substring(0, 20)}
                      {video.title.length > 20 ? "..." : ""}
                    </h2>
                    <p className="text-sm text-gray-400">
                      {formatDistanceToNow(new Date(video.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold text-primary p-4">
              No Videos Found
            </h1>
            <p className="text-xl">This playlist has no videos.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayListVideos;
