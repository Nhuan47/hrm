import axios from '@/shared/services/axios-instance';

export async function getUserRoles () {
    try {
        const response = await axios.get('/setting/user-role/user-roles');
        let { data } = response;
        return data;
    } catch (err) {
        throw new Error(`Service - Fetching user roles failed: ${err}`);
    }
}

export async function getUserRoleEditing (id) {
    try {
        const response = await axios.get(`/setting/user-role/user/${id}`);
        let { data } = response;
        return data;
    } catch (err) {
        throw new Error(`Service - Fetching user role editing failed: ${err}`);
    }
}

export async function updateUserRole (formData) {
    try {
        const { userId } = formData;
        const response = await axios.put(
            `/setting/user-role/update/${userId}`,
            formData
        );
        let { data } = response;
        return data;
    } catch (err) {
        throw new Error(`Service - Update user roles failed: ${err}`);
    }
}
