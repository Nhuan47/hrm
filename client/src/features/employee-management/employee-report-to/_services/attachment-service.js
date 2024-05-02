import axios from '@/shared/services/axios-instance';

export async function getAttachments (id) {
    try {
        const { data } = await axios.get(
            `/employee/report-to/${id}/attachments`
        );
        return data;
    } catch (err) {
        throw new Error(`Fetch assign attachment file failed: ${err}`);
    }
}

export async function uploadAttachmentFile (files) {
    try {
        const response = await axios.post(`/service/upload-attachment`, files, {
            headers: { 'Content-Type': 'application/octet-stream' }
        });
        let { data } = response;
        return data;
    } catch (err) {
        throw new Error(`Upload atachment file failed: ${err}`);
    }
}

export async function addAttachment (formData) {
    try {
        let { employeeId } = formData;
        const response = await axios.post(
            `/employee/report-to/${employeeId}/add-attachment`,
            formData
        );
        let { data } = response;
        return data;
    } catch (err) {
        throw new Error(`Add assign atachment file failed: ${err}`);
    }
}

export async function updateAttachment (formData) {
    try {
        let { employeeId } = formData;
        const response = await axios.put(
            `/employee/report-to/${employeeId}/update-attachment`,
            formData
        );
        let { data } = response;
        return data;
    } catch (err) {
        throw new Error(`Update assign atachment file failed: ${err}`);
    }
}

export async function deleteAttachment (id) {
    try {
        const response = await axios.delete(
            `/employee/report-to/${id}/delete-attachment`
        );
        let { data } = response;
        return data;
    } catch (err) {
        throw new Error(`Fetch assign atachment file failed: ${err}`);
    }
}

export async function getAttachmentEditing (id) {
    try {
        const response = await axios.get(
            `/employee/report-to/${id}/attachment`
        );
        let { data } = response;
        return data;
    } catch (err) {
        throw new Error(`Fetch  atachment editing failed: ${err}`);
    }
}

export async function downloadAttachment (formData) {
    try {
        let { fileId, fileName } = formData;
        const response = await axios.get(
            `/service/download/${fileId}/${fileName}`,
            { responseType: 'blob' }
        );
        return response;
    } catch (err) {
        throw new Error(`Download assign atachment file failed: ${err}`);
    }
}
