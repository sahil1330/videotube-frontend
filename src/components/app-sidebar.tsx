/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  Video,
} from "lucide-react";

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
  const authStatus = useSelector((state: authState) => state.auth.status)
  const { toast } = useToast()
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
        title: "Playground",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: "History",
            url: "#",
          },
          {
            title: "Starred",
            url: "#",
          },
          {
            title: "Settings",
            url: "#",
          },
        ],
      },
      {
        title: "Models",
        url: "#",
        icon: Bot,
        items: [
          {
            title: "Genesis",
            url: "#",
          },
          {
            title: "Explorer",
            url: "#",
          },
          {
            title: "Quantum",
            url: "#",
          },
        ],
      },
      {
        title: "Documentation",
        url: "#",
        icon: BookOpen,
        items: [
          {
            title: "Introduction",
            url: "#",
          },
          {
            title: "Get Started",
            url: "#",
          },
          {
            title: "Tutorials",
            url: "#",
          },
          {
            title: "Changelog",
            url: "#",
          },
        ],
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
        items: [
          {
            title: "General",
            url: "#",
          },
          {
            title: "Team",
            url: "#",
          },
          {
            title: "Billing",
            url: "#",
          },
          {
            title: "Limits",
            url: "#",
          },
        ],
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
        url: "/"+userDetails?.username+"/videos",
        icon: Video,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  };
  const handleLogout = async () => {
    // Handle logout
    try {
      const response = await axiosInstance.post("/users/logout");
      if (response.data.success) {
        dispatch(logout())
      }
    } catch (error: any) {
      console.error(error);
      const errorData = geterrorMessage(error.response.data);
      toast({
        title: errorData,
        variant: "destructive",
      });
    }
  }

  return (
    <Sidebar variant="inset" {...props} className="text-blue-600">
      <SidebarHeader> 
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <img src="videotube_logo.png" alt="VideoTube" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">VideoTube</span>
                </div>
              </a>
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
        {authStatus ? (<NavUser user={data.user} handleLogout={handleLogout} />) : (<Link to={"/login"}><Button>Login</Button></Link>)}
      </SidebarFooter>
    </Sidebar>
  );
}
