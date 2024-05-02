import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const PublicRoute = ({ children }) => {
  let location = useLocation();

  const { userInfo, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return <p>Checking authenticaton..</p>;
  }

  if (!userInfo) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};

export default PublicRoute;
