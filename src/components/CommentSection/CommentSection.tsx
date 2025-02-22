/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/utils/axiosInstance"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { commentSchema } from "@/schemas";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import geterrorMessage from "@/utils/errorMessage";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
interface CommentSectionProps {
    videoId: string | undefined;
    userDetails: {
        _id: string;
        username: string;
        email: string;
        fullName: string;
        avatar: string;
        coverImage: string;
        watchHistory: string[];
    } | null;
}
function CommentSection({ videoId, userDetails }: CommentSectionProps) {
    const [comments, setComments] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    useEffect(() => {
        (async () => {
            const response = await axiosInstance.get(`/comments/get-comments/${videoId}?page=1&limit=10`);
            console.log("Comments", response.data.data.docs);
            setComments(response.data.data.docs)
        })()
    }, [])

    const form = useForm<z.infer<typeof commentSchema>>({
        resolver: zodResolver(commentSchema),
        defaultValues: {
            comment: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof commentSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axiosInstance.post(`/comments/add-comment/${videoId}`, {
                content: values.comment,
            });
            console.log("Comment", response.data);
            setComments((prev) => [response.data.data, ...prev]);
            form.reset();
        } catch (error: any) {
            const errorMessage = geterrorMessage(error?.response?.data);
            toast({
                title: errorMessage,
                variant: "destructive",
            });
        }
        finally {
            setIsSubmitting(false);
        }
    }
    return (
        <div className="flex flex-1 flex-col gap-4 pt-4">
            <h2 className="text-xl">Comments</h2>
            <div className="flex gap-4 items-center">
                <Avatar className="h-[54px] w-[54px] aspect-square">
                    <AvatarImage src={userDetails?.avatar} alt={userDetails?.username} className="rounded-full" />
                    <AvatarFallback>{userDetails?.fullName}</AvatarFallback>
                </Avatar>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex justify-between gap-4">
                        <FormField
                            control={form.control}
                            name="comment"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    {/* <FormLabel>Username</FormLabel> */}
                                    <FormControl>
                                        <Input placeholder="Add a comment ..." {...field} />
                                    </FormControl>
                                    {/* <FormDescription>
                                        This is your public display name.
                                    </FormDescription> */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {isSubmitting ? (<Button disabled className="text-white">Comment <Loader2 className="animate-spin" /></Button>) : (<Button type="submit" className="text-white">Comment</Button>)}
                    </form>
                </Form>
                {/* <Input placeholder="Add a comment..." className="w-full" />
                <Button className="text-white">Comment</Button> */}
            </div>
            <div className="comments">
                {
                    comments?.length > 0 ? comments.map((comment: any) => (
                        <div key={comment._id} className="flex gap-4 items-center h-20">
                            <Avatar className="h-[54px] w-[54px] aspect-square">
                                <AvatarImage src={comment.owner.avatar} alt={comment.owner.username} className="rounded-full" />
                                <AvatarFallback>{comment.owner.fullName}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <h3 className="text-lg font-bold">{comment.owner.username}</h3>
                                <p>{comment.content}</p>
                            </div>
                        </div>
                    )) : (
                        <div className="flex flex-col gap-2 h-24 justify-center items-center">
                            <h3 className="text-lg font-bold">No comments yet</h3>
                            <p>Be the first to comment</p>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default CommentSection