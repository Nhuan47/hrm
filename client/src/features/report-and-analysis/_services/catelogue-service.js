import axios from '@/shared/services/axios-instance';

export async function addFolder (formData) {
    try {
        const response = await axios.post('/reports/folder', formData);
        let { data } = response;
        return data;
    } catch (err) {
        throw new Error(`Add report folder failed: ${err}`);
    }
}

export async function updateFolder (formData) {
    try {
        const { id } = formData;

        const response = await axios.put(`/reports/${id}/folder`, formData);
        let { data } = response;
        return data;
    } catch (err) {
        throw new Error(`Update report folder failed: ${err}`);
    }
}

export async function deleteFolder (formData) {
    try {
        const { id } = formData;

        const response = await axios.delete(`/reports/${id}/folder`, formData);
        let { data } = response;
        return data;
    } catch (err) {
        throw new Error(`Delete report folder failed: ${err}`);
    }
}

export async function getReports () {
    try {
        const response = await axios.get('/reports');
        let { data } = response;
        return data;
    } catch (err) {
        throw new Error(`Fetch reports failed: ${err}`);
    }
}

export async function deleteReport (id) {
    try {
        const response = await axios.delete(`/reports/${id}`);
        let { data } = response;
        return data;
    } catch (err) {
        throw new Error(`Delete reports failed: ${err}`);
    }
}
