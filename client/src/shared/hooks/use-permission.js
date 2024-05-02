import { useParams } from 'react-router-dom';

import { decodeToken } from '@/shared/utils';
import { permissionKeys, typeKeys } from '@/shared/permission-key';

export const usePermissions = (featureKey, options) => {
    let isReadable = false;
    let isUpdateable = false;
    let isCreateable = false;
    let isDeleteable = false;

    // get current user id from url parameters
    const { id: currentUserId } = useParams();

    // Decode token & get user permissions
    const tokenData = decodeToken();
    const { permissions, roles, user_id: tokenUserId } = tokenData;

    let isMasterRole = roles?.find(role => role.accessor === typeKeys.MASTER);

    // Return full permission for role master
    if (isMasterRole) {
        return {
            isReadable: true,
            isDeleteable: true,
            isUpdateable: true,
            isCreateable: true
        };
    }

    if (permissions && Object.keys(permissions).includes(featureKey)) {
        // When user id from token equal with id from url parameters
        if (
            +tokenUserId === +currentUserId ||
            options?.isCheckIdByParam === false
        ) {
            // #### READ #####
            if (
                // check my permission
                permissions[featureKey] &&
                permissions[featureKey][typeKeys.ESS] &&
                permissions[featureKey][typeKeys.ESS][permissionKeys.READ]
            ) {
                isReadable = true;
            } else {
                // check admin/supervisor permission
                if (
                    permissions[featureKey] &&
                    ((permissions[featureKey][typeKeys.ADMIN] &&
                        permissions[featureKey][typeKeys.ADMIN][
                            permissionKeys.READ
                        ]) ||
                        (permissions[featureKey][typeKeys.SUPERVISOR] &&
                            permissions[featureKey][typeKeys.SUPERVISOR][
                                permissionKeys.READ
                            ]))
                ) {
                    isReadable = true;
                }
            }

            // #### UPDATE #####
            if (
                // check my permission
                permissions[featureKey] &&
                permissions[featureKey][typeKeys.ESS] &&
                permissions[featureKey][typeKeys.ESS][permissionKeys.UPDATE]
            ) {
                isUpdateable = true;
            } else {
                // check admin/supervisor permission
                if (
                    permissions[featureKey] &&
                    ((permissions[featureKey][typeKeys.ADMIN] &&
                        permissions[featureKey][typeKeys.ADMIN][
                            permissionKeys.UPDATE
                        ]) ||
                        (permissions[featureKey][typeKeys.SUPERVISOR] &&
                            permissions[featureKey][typeKeys.SUPERVISOR][
                                permissionKeys.UPDATE
                            ]))
                ) {
                    isUpdateable = true;
                }
            }

            // #### CREATE #####
            if (
                // check my permission
                permissions[featureKey] &&
                permissions[featureKey][typeKeys.ESS] &&
                permissions[featureKey][typeKeys.ESS][permissionKeys.CREATE]
            ) {
                isCreateable = true;
            } else {
                // check admin/supervisor permission
                if (
                    permissions[featureKey] &&
                    ((permissions[featureKey][typeKeys.ADMIN] &&
                        permissions[featureKey][typeKeys.ADMIN][
                            permissionKeys.CREATE
                        ]) ||
                        (permissions[featureKey][typeKeys.SUPERVISOR] &&
                            permissions[featureKey][typeKeys.SUPERVISOR][
                                permissionKeys.CREATE
                            ]))
                ) {
                    isCreateable = true;
                }
            }

            // #### DELETE #####
            if (
                permissions[featureKey] &&
                permissions[featureKey][typeKeys.ESS] &&
                permissions[featureKey][typeKeys.ESS][permissionKeys.DELETE]
            ) {
                isDeleteable = true;
            } else {
                // check admin/supervisor permission
                if (
                    permissions[featureKey] &&
                    ((permissions[featureKey][typeKeys.ADMIN] &&
                        permissions[featureKey][typeKeys.ADMIN][
                            permissionKeys.DELETE
                        ]) ||
                        (permissions[featureKey][typeKeys.SUPERVISOR] &&
                            permissions[featureKey][typeKeys.SUPERVISOR][
                                permissionKeys.DELETE
                            ]))
                ) {
                    isDeleteable = true;
                }
            }
        } else {
            // #### READ #####
            if (
                permissions[featureKey] &&
                ((permissions[featureKey][typeKeys.ADMIN] &&
                    permissions[featureKey][typeKeys.ADMIN][
                        permissionKeys.READ
                    ]) ||
                    (permissions[featureKey][typeKeys.SUPERVISOR] &&
                        permissions[featureKey][typeKeys.SUPERVISOR][
                            permissionKeys.READ
                        ]))
            ) {
                isReadable = true;
            }
            // #### UPDATE #####
            if (
                permissions[featureKey] &&
                ((permissions[featureKey][typeKeys.ADMIN] &&
                    permissions[featureKey][typeKeys.ADMIN][
                        permissionKeys.UPDATE
                    ]) ||
                    (permissions[featureKey][typeKeys.SUPERVISOR] &&
                        permissions[featureKey][typeKeys.SUPERVISOR][
                            permissionKeys.UPDATE
                        ]))
            ) {
                isUpdateable = true;
            }

            // #### CREATE #####
            if (
                permissions[featureKey] &&
                ((permissions[featureKey][typeKeys.ADMIN] &&
                    permissions[featureKey][typeKeys.ADMIN][
                        permissionKeys.CREATE
                    ]) ||
                    (permissions[featureKey][typeKeys.SUPERVISOR] &&
                        permissions[featureKey][typeKeys.SUPERVISOR][
                            permissionKeys.CREATE
                        ]))
            ) {
                isCreateable = true;
            }

            // #### DELETE #####
            if (
                permissions[featureKey] &&
                ((permissions[featureKey][typeKeys.ADMIN] &&
                    permissions[featureKey][typeKeys.ADMIN][
                        permissionKeys.DELETE
                    ]) ||
                    (permissions[featureKey][typeKeys.SUPERVISOR] &&
                        permissions[featureKey][typeKeys.SUPERVISOR][
                            permissionKeys.DELETE
                        ]))
            ) {
                isDeleteable = true;
            }
        }
    }

    return { isReadable, isDeleteable, isUpdateable, isCreateable };
};
