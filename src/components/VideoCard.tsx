// import { Avatar } from "@radix-ui/react-avatar"
import VideoSchema from "@/schemas/VideoSchema"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

function VideoCard(video: VideoSchema) {
    console.log(video)

    return (
        <>
            <div className="flex flex-col">
                <div className="aspect-video rounded-xl bg-muted/50">
                    <video src={video.videoFile} onMouseEnter={(e) => e.currentTarget.play()} onMouseLeave={(e) => e.currentTarget.pause()} poster={video.thumbnail}></video>
                </div>
                <div className="video-details">
                    <Avatar className="h-8 w-8 rounded-lg py-2">
                        <AvatarImage src={video.owner?.avatar} />
                        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </>
    )
}

export default VideoCard