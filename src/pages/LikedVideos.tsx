import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { VideoSchema } from "@/schemas";
import axiosInstance from "@/utils/axiosInstance";
import geterrorMessage from "@/utils/errorMessage";
import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

function LikedVideos() {
  const [isLoading, setIsLoading] = useState(true);
  const [likeVideoDetails, setLikeVideoDetails] = useState<
    Array<{ video: VideoSchema | null }>
  >([]);
  const { toast } = useToast();
  useEffect(() => {
    setIsLoading(true);
    async function fetchLikedVideos() {
      try {
        const response = await axiosInstance.get("/likes");
        console.log("Liked Videos", response.data.data);
        setLikeVideoDetails(response.data.data);
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorMessage = geterrorMessage((error as any)?.response?.data);
        toast({
          title: errorMessage,
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }
    fetchLikedVideos();
    setIsLoading(false);
  }, []);
  return (
    <div>
      <h1 className="p-4 text-3xl font-bold text-blue-500">Liked Videos</h1>
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="animate-spin w-80" />
        </div>
      ) : (
        <div className="flex flex-1 flex-col sm:gap-4 gap-2 md:p-8 p-4 pt-0">
          {likeVideoDetails.length > 0 ? (
            likeVideoDetails.map((likeVideoDetail) => (
              <Link
                to={`/watch/${likeVideoDetail?.video?._id}`}
                className="flex flex-col"
                key={likeVideoDetail?.video?._id}
              >
                <div
                  className="flex flex-1 flex-col gap-4 md:p-8 pt-0 w-full"
                  key={likeVideoDetail?.video?._id}
                >
                  <div className="flex">
                    <video
                      src={likeVideoDetail?.video?.videoFile}
                      className="aspect-video md:w-96 w-1/2 rounded-md"
                      muted
                      autoPlay={false}
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => e.currentTarget.pause()}
                    ></video>
                    <div className="videoDetails sm:p-4 p-2 flex flex-col sm:gap-4 gap-2 text-blue-500">
                      <h1 className="sm:text-2xl text-sm font-bold">
                        {likeVideoDetail.video?.title &&
                        likeVideoDetail?.video?.title.length > 36
                          ? `${likeVideoDetail?.video?.title.slice(0, 36)} ...`
                          : likeVideoDetail?.video?.title}
                      </h1>
                      <Link
                        to={`/${likeVideoDetail.video?.owner.username}`}
                        className="flex items-center sm:gap-4 gap-2"
                      >
                        <Avatar className="sm:h-[44px] sm:w-[44px] w-[24px] h-[24px] aspect-square">
                          <AvatarImage
                            src={likeVideoDetail?.video?.owner?.avatar}
                            alt={likeVideoDetail?.video?.owner?.username}
                            className="rounded-full"
                          />
                          <AvatarFallback>
                            {likeVideoDetail?.video?.owner?.username}
                          </AvatarFallback>
                        </Avatar>
                        <p className="sm:text-lg text-sm text-muted-foreground">
                          {likeVideoDetail?.video?.owner?.fullName ||
                            "Unknown Creator"}
                        </p>
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {likeVideoDetail?.video?.createdAt
                          ? formatDistanceToNow(
                              new Date(likeVideoDetail.video.createdAt)
                            )
                          : "Unknown"}
                      </p>
                    </div>
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

export default LikedVideos;
