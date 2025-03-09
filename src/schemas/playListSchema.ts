import { UserSchema } from "./UserSchema";
import { VideoSchema } from "./VideoSchema";

export interface PlayListSchema {
  _id: string;
  name: string;
  description: string;
  videos: VideoSchema[] | null;
  owner: UserSchema;
  createdAt: string;
  updatedAt: string;
}

