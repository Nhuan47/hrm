import axios from '@/shared/services/axios-instance';

export async function getMethods () {
    try {
        const response = await axios.get(`/employee/report-to/get-methods`);
        let { data } = response;
        return data;
    } catch (err) {
        throw `Fetch report methods failed: ${err}`;
    }
}
