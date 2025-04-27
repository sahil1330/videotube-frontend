/* eslint-disable @typescript-eslint/no-explicit-any */
import { Outlet } from "react-router";
import "./App.css";
import { Header } from "./components";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axiosInstance from "./utils/axiosInstance";
import { login, logout } from "./store/authSlice";
// import { useToast } from "./hooks/use-toast";
import { Toaster } from "./components/ui/toaster";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  // const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get("/users/current-user");
        const user = response.data.data;
        console.log(user);
        if (user) {
          dispatch(login(user));
        } else {
          dispatch(logout());
        }
      } catch (error: any) {
        const errorData = error.response.data;
        const preRegex = /<pre>(.*?)<\/pre>/s;
        const match = preRegex.exec(errorData);
        const errorMessage = match ? match[1] : "An error occurred";
        // toast({
        //   title: errorMessage,
        //   variant: "destructive",
        // });
        console.error(errorMessage);
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return !loading ? (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <main>
            <div className="flex items-center px-4 md:bg-secondary bg-primary-foreground sticky top-0 z-10 mb-4">
              <SidebarTrigger />
              <Header />
            </div>
            <Outlet />
          </main>
          <Toaster />
        </SidebarInset>
      </SidebarProvider>
    </>
  ) : (
    <div>Loading...</div>
  );
}

export default App;
