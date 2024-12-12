/* eslint-disable @typescript-eslint/no-explicit-any */
import { Outlet } from "react-router";
import "./App.css";
import { Header } from "./components";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axiosInstance from "./utils/axiosInstance";
import { login, logout } from "./store/authSlice";
import { useToast } from "./hooks/use-toast";

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // const authToken = document.cookie
        //   .split('; ')
        //   .find((row) => row.startsWith('next-auth.session-token'))
        //   ?.split('=')[1];
        // console.log(authToken);
        const response = await axiosInstance.get("/users/current-user");
        const user = response.data.data;
        console.log(user);
        if (user) {
          dispatch(login(user));
        } else {
          dispatch(logout());
        }
      } catch (error: any) {
        const errorData = error.response.data ;
        const preRegex = /<pre>(.*?)<\/pre>/s;
        const match = preRegex.exec(errorData);
        const errorMessage = match ? match[1] : "An error occurred";
        toast({
          title: errorMessage,
          variant: "destructive",
        });
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  },[dispatch, toast]);

  return !loading ? (
    <>
      <Header />
      <Outlet />
    </>
  ) : (
    <div>Loading...</div>
  );
}

export default App;
