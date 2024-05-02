import axios from '@/shared/services/axios-instance';

export async function uploadImage (files) {
    try {
        const response = await axios.post(`/service/upload-image`, files, {
            headers: {
                // Set the content type to 'application/octet-stream' for binary data
                'Content-Type': 'application/octet-stream'
            }
        });
        let { data } = response;

        return data;
    } catch (err) {
        throw `Failed to upload image: ${err}`;
    }
}
