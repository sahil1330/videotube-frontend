import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { RouterProvider, createBrowserRouter } from "react-router";
import Home from "./pages/Home.tsx";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "./components/ui/sidebar.tsx";
import { AppSidebar } from "./components/app-sidebar.tsx";
import Signup from "./pages/Signup.tsx";
import { Toaster } from "./components/ui/toaster";
import Login from "./pages/Login.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main>
          <SidebarTrigger />
          <RouterProvider router={router} />
        </main>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  </StrictMode>
);
