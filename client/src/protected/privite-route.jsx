import { Navigate, useLocation } from "react-router-dom";
import { decodeToken } from "@/shared/utils";

const PriviteRoute = ({ children, roleAllowed }) => {
  let location = useLocation();
  const userInfo = decodeToken();

  if (!userInfo) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};
export default PriviteRoute;
