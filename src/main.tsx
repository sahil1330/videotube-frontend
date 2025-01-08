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
        path: "/:slug",
        element: <Account />,
      },
      {
        path: "/watch/:slug",
        element: <WatchVideo />
      }
    ],
  },
]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </StrictMode>
);
