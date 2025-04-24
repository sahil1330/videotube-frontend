import { ICommunityPost, UserSchema } from "@/schemas";
import axiosInstance from "@/utils/axiosInstance";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns";

function CommunityTab({ user }: { user: UserSchema }) {
  const [communityPosts, setCommunityPosts] = useState<ICommunityPost[]>([]);
  useEffect(() => {
    const fetchCommunityPosts = async () => {
      console.log("User ID", user._id);
      const response = await axiosInstance.get(`/tweets/user/${user._id}`);
      console.log("Community Posts", response.data.data);
      setCommunityPosts(response.data.data);
    };
    fetchCommunityPosts();
  }, []);
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {communityPosts.length > 0 ? (
        <div>
          {communityPosts.map((post) => (
            <div
              key={post._id}
              className="flex my-6 gap-2 p-4 border w-3/4 border-white"
            >
              <div className="userDetails flex gap-2">
                <Avatar className="h-[70px] w-[70px] aspect-square">
                  <AvatarImage
                    src={user.avatar}
                    alt={user.username}
                    className="rounded-full"
                  />
                  <AvatarFallback>{user.username as string}</AvatarFallback>
                </Avatar>
              </div>
              <div className="content mx-4 flex flex-col gap-2 ">
                <p className="flex gap-2 items-center">
                  <h1 className="text-xl font-bold">{user.username}</h1>{" "}
                  <p className="text-gray-500 text-sm">
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </p>
                <p className="text-white">{post.content}</p>
                {post.contentImage && (
                  <img
                    src={post.contentImage}
                    alt="Community Post"
                    className="w-3/4 h-auto rounded-lg"
                  />
                )}
                {/* <div className="enganements">
                  <p className="text-gray-500 text-sm">
                     Likes
                  </p>
                  <p className="text-gray-500 text-sm">
                     Comments
                  </p>
                </div> */}
              </div>

              <span className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-lg">No Community Posts Available</p>
        </div>
      )}

    </div>
  );
}

export default CommunityTab;
