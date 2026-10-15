import { useContext } from "react";
import { authContext } from "../Context/AuthContext/AuthContextProvider";
import { Navigate } from "react-router";
import PostsLoading from "./PostsLoading";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, isLoading } = useContext(authContext);

  if (isLoading) {
    return <PostsLoading/>;
  }

  if (currentUser) {
    return children;
  }

  return <Navigate to="/login" />;
}

export default ProtectedRoute;