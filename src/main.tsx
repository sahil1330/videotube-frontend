import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { RouterProvider, createBrowserRouter } from "react-router";
import Home from "./pages/Home.tsx";
import Signup from "./pages/Signup.tsx";
import Login from "./pages/Login.tsx";
import { Provider } from "react-redux";
import store, { persistor } from "./store/store.ts";
import { AuthLayout } from "./components/index.ts";
import UploadVideo from "./pages/UploadVideo.tsx";
import { PersistGate } from "redux-persist/integration/react";
import Account from "./pages/Account.tsx";
import WatchVideo from "./pages/WatchVideo.tsx";
import UserVideos from "./pages/UserVideos.tsx";
import EditProfile from "./pages/EditProfile.tsx";
import History from "./pages/History.tsx";
import LikedVideos from "./pages/LikedVideos.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import Playlists from "./pages/Playlists.tsx";
import PlayListVideos from "./pages/PlayListVideos.tsx";
import SearchResults from "./pages/SearchResults.tsx";
import CreatePost from "./pages/CreatePost.tsx";
import EditPost from "./pages/EditPost.tsx";
import ManageVideos from "./pages/ManageVideos.tsx";
import EditVideo from "./pages/EditVideo.tsx";

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
          <AuthLayout authentication={false} url="/">
            <Signup />
          </AuthLayout>
        ),
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false} url="/">
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "/upload-video",
        element: (
          <AuthLayout authentication={true} url="/upload-video">
            <UploadVideo />
          </AuthLayout>
        ),
      },
      {
        path: "/manage-videos",
        element: (
          <AuthLayout authentication={true} url="/manage-videos">
            <ManageVideos />
          </AuthLayout>
        ),
      },
      {
        path: "/edit-video/:videoId",
        element: (
          <AuthLayout authentication={true} url="/upload-video">
            <EditVideo />
          </AuthLayout>
        ),
      },
      {
        path: "/create-post",
        element: (
          <AuthLayout authentication={true} url="/upload-video">
            <CreatePost />
          </AuthLayout>
        ),
      },
      {
        path: "/edit-post/:postId",
        element: (
          <AuthLayout authentication={true} url="/edit-post/:postId">
            <EditPost />
          </AuthLayout>
        ),
      },
      {
        path: "/:slug/videos",
        element: (
          <AuthLayout authentication={true} url="/">
            <UserVideos />
          </AuthLayout>
        ),
      },
      {
        path: "/:slug",
        element: (
          <AuthLayout authentication={true} url="/">
            <Account />
          </AuthLayout>
        ),
      },
      {
        path: "/edit-profile",
        element: (
          <AuthLayout authentication={true} url="/edit-profile">
            <EditProfile />
          </AuthLayout>
        ),
      },
      {
        path: "/history",
        element: (
          <AuthLayout authentication={true} url="/history">
            <History />
          </AuthLayout>
        ),
      },
      {
        path: "/liked-videos",
        element: (
          <AuthLayout authentication={true} url="/liked-videos">
            <LikedVideos />
          </AuthLayout>
        ),
      },
      {
        path: "/playlists",
        element: (
          <AuthLayout authentication={true} url="/playlist">
            <Playlists />
          </AuthLayout>
        ),
      },
      {
        path: "/playlists/:slug",
        element: (
          <AuthLayout authentication={true} url="/playlists">
            <PlayListVideos />
          </AuthLayout>
        ),
      },
      {
        path: "/watch/:slug",
        element: <WatchVideo />,
      },
      {
        path: "/search",
        element: <SearchResults />,
      },
    ],
  },
]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <PersistGate loading={null} persistor={persistor}>
          <RouterProvider router={router} />
        </PersistGate>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
