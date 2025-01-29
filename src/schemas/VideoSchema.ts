import UserSchema from "./UserSchema";

interface VideoSchema {
  _id: string;
  videoFile: string;
  videoFilePublicId: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: Float32Array;
  views: Int32Array;
  isPublished: boolean;
  owner: UserSchema;
  createdAt: string;
  updatedAt: string;
}

export default VideoSchema;
