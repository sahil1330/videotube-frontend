// import { Avatar } from "@radix-ui/react-avatar"
import VideoSchema from "@/schemas/VideoSchema"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Link } from "react-router"

function VideoCard(video: VideoSchema) {
    console.log(video)

    return (
        <>
            <Link to={`/watch/${video._id}`} className="flex flex-col">
                <div className="flex flex-col">
                    <div className="aspect-video rounded-xl bg-muted/50">
                        <video src={video.videoFile} onMouseEnter={(e) => e.currentTarget.play()} onMouseLeave={(e) => e.currentTarget.pause()} poster={video.thumbnail}></video>
                    </div>
                    <div className="video-details flex gap-4">
                        <Avatar className="h-[54px] w-[54px] aspect-square rounded-full py-2">
                            <AvatarImage src={video.owner?.avatar} />
                            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                        </Avatar>
                        <div className="video-info w-full">
                            <h3 className="text-lg font-bold">{video.title}</h3>
                            <div className="flex justify-between gap-4">
                                <p className="text-md">{video.views} views</p>
                                <p className="text-md mx-2">{video.createdAt}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </>
    )
}

export default VideoCard