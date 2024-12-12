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
import { Provider } from "react-redux";
import store from "./store/store.ts";
import { AuthLayout } from "./components/index.ts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        ),
      },
      {
        path: "/login",
        element:
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
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
    </Provider>
  </StrictMode>
);
