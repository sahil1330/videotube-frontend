/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import {
  History,
  Home,
  LifeBuoy,
  ListVideo,
  Send,
  ThumbsUp,
  Video,
  Videotape,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/utils/axiosInstance";
import { logout } from "@/store/authSlice";
import geterrorMessage from "@/utils/errorMessage";
import { authState } from "@/types";
import { Button } from "./ui/button";
import { Link } from "react-router";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const dispatch = useDispatch();
  const authStatus = useSelector((state: authState) => state.auth.status);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const { toast } = useToast();
  // console.log("auth status in sidebar: ", authStatus);
  // console.log("user details in sidebar: ", useSelector((state: any) => state.auth.user));
  const userDetails = useSelector((state: any) => state.auth.user);

  const data = {
    user: {
      name: userDetails?.username,
      email: userDetails?.email,
      avatar: userDetails?.avatar,
    },
    navMain: [
      {
        title: "Home",
        url: "/",
        icon: Home,
        isActive: true,
      },
      {
        title: "Subscriptions",
        url: "#",
        icon: Videotape ,
        items: subscriptions.map((sub) => ({
          icon: sub.channel.avatar,
          id: sub.channel._id,
          title: sub.channel.fullName,
          url: `/${sub.channel.username}`,
        })),
      },
      {
        title: "History",
        url: "/history",
        icon: History,
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "#",
        icon: Send,
      },
    ],
    you: [
      {
        name: "My Videos",
        url: "/" + userDetails?.username + "/videos",
        icon: Video,
      },
      {
        name: "Liked Videos",
        url: "/liked-videos",
        icon: ThumbsUp,
      },
      {
        name: "Playlists",
        url: "/playlists",
        icon: ListVideo ,
      },
    ],
  };

  useEffect(() => {
    if (authStatus) {
      const fetchSubscriptions = async () => {
        try {
          const response = await axiosInstance.get(
            `/subscriptions/channels/${userDetails._id}`
          );
          setSubscriptions(response.data.data);
          console.log("subscriptions: ", response.data.data);
        } catch (error: any) {
          const errorData = geterrorMessage(error.response.data);
          toast({
            title: errorData,
            variant: "destructive",
          });
        }
      };
      fetchSubscriptions();
    }
  }, [authStatus]);
  const handleLogout = async () => {
    // Handle logout
    try {
      const response = await axiosInstance.post("/users/logout");
      if (response.data.success) {
        dispatch(logout());
      }
    } catch (error: any) {
      console.error(error);
      const errorData = geterrorMessage(error.response.data);
      toast({
        title: errorData,
        variant: "destructive",
      });
    }
  };

  return (
    <Sidebar variant="inset" {...props} className="text-blue-600">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <img src="/videotube_logo.png" alt="VideoTube" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">VideoTube</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.you} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {authStatus ? (
          <NavUser user={data.user} handleLogout={handleLogout} />
        ) : (
          <Link to={"/login"}>
            <Button>Login</Button>
          </Link>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
