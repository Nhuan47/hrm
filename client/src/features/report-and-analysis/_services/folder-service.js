import axios from '@/shared/services/axios-instance';

export async function getFolders () {
    try {
        const response = await axios.get('/reports/folders');
        let { data } = response;
        return data;
    } catch (err) {
        throw `Fetch report folders failed: ${err}`;
    }
}
