import { VideoCard } from "@/components";
import VideoSchema from "@/schemas/VideoSchema";
import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import { Link } from "react-router";

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
          {videos.map((video) => (
            <VideoCard key={video._id} {...video} />
          ))}
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
      <div className="uploadVideoButton">
        <Link to={"/upload-video"}>
          <button className="fixed bottom-8 right-8 p-4 rounded-full bg-blue-500 text-white">
            Upload Video
          </button>
        </Link>
      </div>
    </>
  );
};

export default Home;
