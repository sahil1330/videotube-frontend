import { AdvancedVideo } from '@cloudinary/react';
import { Cloudinary } from "@cloudinary/url-gen";

// Import required actions and qualifiers.
import { fill } from "@cloudinary/url-gen/actions/resize";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import { Gravity } from "@cloudinary/url-gen/qualifiers";
import { AutoFocus } from "@cloudinary/url-gen/qualifiers/autoFocus";

function TransformedVideo({ videoPublicId, poster, controls }: { videoPublicId: string, poster: string, controls: boolean }) {
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
            {poster ? (<AdvancedVideo cldVid={myVideo} controls={controls} onMouseEnter={(e) => e.currentTarget.play()} onMouseLeave={(e) => e.currentTarget.pause()} poster={poster} />) : (
                <AdvancedVideo cldVid={myVideo} controls={controls} cldPoster={myVideo.format('jpg')} />
            )}
        </>
    )
}

export default TransformedVideo