// import { Avatar } from "@radix-ui/react-avatar"
import VideoSchema from "@/schemas/VideoSchema"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Link } from "react-router"
import { Suspense } from "react"
import { Skeleton } from "./ui/skeleton"
import { formatDistanceToNow } from "date-fns"
// import TransformedVideo from "./ImageTransformation.tsx/TransformedVideo"

function VideoCard(video: VideoSchema) {

    return (
        <>
            <Link to={`/watch/${video._id}`} className="flex flex-col">
                <div className="flex flex-col">
                    <Suspense fallback={<Skeleton className="h-[125px] w-[250px] rounded-xl" />}>
                        <div className="aspect-video rounded-xl bg-muted/50">
                            {/* <TransformedVideo videoPublicId={video.videoFilePublicId} poster={video?.thumbnail} controls={false} width={"100%"} height={"100%"} /> */}
                            <video src={video.videoFile} onMouseEnter={(e) => e.currentTarget.play()} onMouseLeave={(e) => e.currentTarget.pause()} poster={video.thumbnail} className="rounded-lg"></video>
                        </div>
                    </Suspense>
                    <div className="video-details flex gap-4">
                        <Suspense fallback={<Skeleton className="h-12 w-12 rounded-full" />}>
                            <Avatar className="h-[54px] w-[54px] aspect-square rounded-full py-2">
                                <AvatarImage src={video.owner?.avatar} />
                                {/* <AvatarFallback className="rounded-lg">CN</AvatarFallback> */}
                            </Avatar>
                        </Suspense>
                        <div className="video-info w-full">
                            <Suspense fallback={
                                <div>
                                    <Skeleton className="h-4 w-[250px]" />
                                    <Skeleton className="h-4 w-[250px]" />
                                </div>
                            }>
                                <h3 className="text-lg font-bold">{video.title}</h3>
                                <div className="flex justify-between gap-4">
                                    <p className="text-md">{video.views} views</p>
                                    <p className="text-md mx-2">{formatDistanceToNow(new Date(video.createdAt), {addSuffix: true})}</p>
                                </div>
                            </Suspense>
                        </div>
                    </div>
                </div>
            </Link>
        </>
    )
}

export default VideoCard