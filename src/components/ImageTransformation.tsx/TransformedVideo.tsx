import { Cloudinary } from "@cloudinary/url-gen";
import cloudinary from 'cloudinary-video-player';
import "cloudinary-video-player/cld-video-player.min.css";
// Import required actions and qualifiers.
import { fill } from "@cloudinary/url-gen/actions/resize";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import { Gravity } from "@cloudinary/url-gen/qualifiers";
import { AutoFocus } from "@cloudinary/url-gen/qualifiers/autoFocus";
import { useEffect, useRef } from 'react';

interface TransformedVideoProps {
    videoPublicId: string;
    poster: string;
    controls: boolean;
    sourceConfig?: { info: { title: string, artist: string }, options: { autoplay: boolean } };
    width: string;
    height: string;
}

function TransformedVideo({ videoPublicId, poster, controls, sourceConfig, width, height }: TransformedVideoProps) {
    const playerRef = useRef<HTMLVideoElement | null>(null);
    const cloudinaryRef = useRef<typeof cloudinary | null>(null);
    useEffect(() => {
        if (cloudinaryRef.current) return;
        cloudinaryRef.current = cloudinary;
        const player = cloudinaryRef.current.videoPlayer(playerRef.current, {
            cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
            secure: true,
            controls,
            posterOptions: {},
            autoplay: true,
        })
        player.source(videoPublicId, sourceConfig);
    })
    // Create and configure your Cloudinary instance.
    const cld = new Cloudinary({
        cloud: {
            cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }
    });

    // Use the video with public ID, 'docs/walking_talking'.
    const myVideo = cld.video(videoPublicId);

    // Apply the transformation. Transform the video according to 16/9 aspect ratio.
    myVideo.resize(fill().aspectRatio("16:9")
        .gravity(Gravity.autoGravity().autoFocus(AutoFocus.focusOn(FocusOn.faces())))) // Crop the video, focusing on the faces.
        .roundCorners(byRadius(20));    // Round the corners.
    return (
        <>
            <div style={{ width: width, height: height }}>
                <video
                    ref={playerRef}
                    data-cld-public-id={videoPublicId}
                    style={{ width: width, height: height, borderRadius: '20px' }}
                    poster={poster}
                    className="rounded-lg"
                />
            </div>
        </>
    )
}

export default TransformedVideo