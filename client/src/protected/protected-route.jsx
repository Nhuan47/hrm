import { Navigate, useLocation } from "react-router-dom";
import { decodeToken } from "@/shared/utils";

const ProtectedRoute = ({ children }) => {
  let location = useLocation();
  const userInfo = decodeToken();
  const userId = userInfo.user_id;

  const pathName = location.pathname;

  if (!userInfo) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (pathName === "/" && userId)
    return <Navigate to={`/employee/${userId}/profile`} />;
  return children;
};
export default ProtectedRoute;
