import axios from '@/shared/services/axios-instance';

export async function getRoles () {
    try {
        const response = await axios.get('/setting/manage-role/roles');
        let { data } = response;
        return data;
    } catch (err) {
        throw new Error(`Service - Fetching role types failed: ${err}`);
    }
}

export async function getTypes () {
    try {
        const response = await axios.get('/setting/manage-role/types');
        let { data } = response;
        return data;
    } catch (err) {
        throw new Error(`Service - Fetch types failed: ${err}`);
    }
}

export async function getGroupItemPermissions () {
    try {
        const response = await axios.get('/setting/group-item-permissions');
        let { data } = response;
        return data;
    } catch (err) {
        throw new Error(
            `Service - Fetching group item permissions failed: ${err}`
        );
    }
}

export async function addRole (formData) {
    try {
        const response = await axios.post('/setting/role/add-role', formData);
        let { data } = response;
        return data;
    } catch (err) {
        throw new Error(`Service - Adding role failed: ${err}`);
    }
}

export async function updateRole (formData) {
    try {
        const { id } = formData;
        const response = await axios.put(
            `/setting/role/update-role/${id}`,
            formData
        );
        let { data } = response;
        return data;
    } catch (err) {
        throw new Error(`Service - Update role failed: ${err}`);
    }
}
export async function getRoleEditing ({ id }) {
    try {
        const response = await axios.get(`/setting/manage-role/role/${id}`);
        let { data } = response;
        return data;
    } catch (err) {
        throw new Error(`Service - Fetching role editing failed: ${err}`);
    }
}

export async function deleteRole (roleId) {
    try {
        const response = await axios.delete(
            `/setting/manage-role/role/${roleId}`
        );
        let { data } = response;
        return data;
    } catch (err) {
        throw new Error(`Service - delete role failed: ${err}`);
    }
}
