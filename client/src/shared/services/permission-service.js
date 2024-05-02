import axios from './axios-instance';

export async function getUserPermissions () {
    try {
        const response = await axios.get('/auth/permissions', {
            withCredentials: true
        });
        let { data } = response;
        return data;
    } catch (err) {
        throw new Error(`Service - Fetching user permissions failed: ${err}`);
    }
}
