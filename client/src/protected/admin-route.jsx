import { Navigate, useLocation } from "react-router-dom";

import { decodeToken } from "@/shared/utils";
import { usePermissions } from "@/shared/hooks/use-permission";
import { permissionKeys, typeKeys } from "../shared/permission-key";

const AdminRoute = ({
  children,
  roleAllowed,
  featureKey,
  permissionAllowed,
}) => {
  let location = useLocation();
  const userInfo = decodeToken();

  if (!userInfo) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  const { roles } = userInfo;
  const roleAccepted = roles.find((role) =>
    roleAllowed.includes(role.accessor)
  );

  if (roleAccepted) {
    if (roleAccepted.accessor === typeKeys.MASTER) {
      return children;
    } else {
      if (featureKey && permissionAllowed) {
        const { isReadable, isUpdateable, isCreateable, isDeleteable } =
          usePermissions(featureKey);
        if (permissionAllowed === permissionKeys.READ && isReadable) {
          return children;
        }

        if (permissionAllowed === permissionKeys.UPDATE && isUpdateable) {
          return children;
        }

        if (permissionAllowed === permissionKeys.CREATE && isCreateable) {
          return children;
        }
        if (permissionAllowed === permissionKeys.DELETE && isDeleteable) {
          return children;
        }
      }
    }
  }

  return <Navigate to={"/error/403"} />;
};

export default AdminRoute;
