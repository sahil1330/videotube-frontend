import VideoCard from "@/components/VideoCard";
import VideoSchema from "@/schemas/VideoSchema";
import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";

const Home = () => {
  const [videos, setVideos] = useState<Array<VideoSchema>>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axiosInstance.get(
          "/videos?sortBy=createdAt&sortType=desc"
        );
        console.log(response.data.data.docs);

        setVideos(response.data.data.docs);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        } else {
          throw new Error(String(error));
        }
      }
    };
    fetchVideos();
  }, []);
  // console.log(videos);
  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-8 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50">
            {videos.length > 0 && videos[0] && (
              <video src={videos[0].videoFile} onMouseEnter={(e) => e.currentTarget.play()} onMouseLeave={(e) => e.currentTarget.pause()} poster={videos[0].thumbnail}></video>
            )}
          </div>
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
          <VideoCard {...videos[0]} />
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
    </>
  );
};

export default Home;
