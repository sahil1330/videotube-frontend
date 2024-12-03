import { useEffect } from "react";
import axios from "axios";

const Home = () => {
  useEffect(() => {
    document.title = "VideoTube";
    axios
      .get("http://localhost:8000/api/v1/videos")
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching videos:", error);
      });
  }, []);
  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-8 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50"></div>
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
    </>
  );
};

export default Home;
