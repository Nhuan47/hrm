import axios from '@/shared/services/axios-instance';

export async function saveGroupAttributeSetting (formData) {
    try {
        const response = await axios.post(
            `/setting/group-attribute/save`,
            formData
        );
        let { data } = response;
        return data;
    } catch (err) {
        throw new Error(
            `Service - Save group attribute setting failed: ${err}`
        );
    }
}
