import { createRoot } from "react-dom/client";
import "../index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Posts from "../Pages/Posts/Posts";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import NotFound from "../Pages/NotFound/NotFound";
import AuthContextProvider from "../Context/AuthContext/AuthContextProvider";
import ProtectedRoute from "./ProtectedRoute";
import AuthProtected from "./AuthProtected";
import MainLayout from "./MainLayout";
import PaddedLayout from "./PaddedLayout";
import ContentLayout from "./ContentLayout";
import ChangePassword from "../Pages/ChangePassword/ChangePassword";
import "@fortawesome/fontawesome-free/css/all.min.css";
import PostDetails from "../Pages/PostDetials/PostDetails";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MyProfile from "../Pages/MyProfile/MyProfile";
import UserProfile from "../Pages/UserProfile/UserProfile";
import SavedPosts from "../Pages/SavedPosts/SavedPosts";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        element: <PaddedLayout />,
        children: [
          {
            path: "login",
            element: (
              <AuthProtected>
                <Login />
              </AuthProtected>
            ),
          },
          {
            path: "register",
            element: (
              <AuthProtected>
                <Register />
              </AuthProtected>
            ),
          },
          {
            path: "changepassword",
            element: (
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            ),
          },
          { path: "*", element: <NotFound /> },
        ],
      },
      {
        element: <ContentLayout />,
        children: [
          {
            path: "posts",
            element: (
              <ProtectedRoute>
                <Posts />
              </ProtectedRoute>
            ),
          },
          {
            index: true,
            element: (
              <ProtectedRoute>
                <Posts />
              </ProtectedRoute>
            ),
          },
          {
            path: "myProfile",
            element: (
              <ProtectedRoute>
                <MyProfile />
              </ProtectedRoute>
            ),
          },
          {
            path: "postdetails/:postId",
            element: (
              <ProtectedRoute>
                <PostDetails />
              </ProtectedRoute>
            ),
          },
          {
            path: "userProfile/:userId",
            element: (
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            ),
          },
          {
            path: "saves",
            element: (
              <ProtectedRoute>
                <SavedPosts />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
]);

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
    {/* <ReactQueryDevtools initialIsOpen={false} /> */}
  </QueryClientProvider>,
);
