import axios from '@/shared/services/axios-instance';

export async function getEmployeeLeaveToday (signal) {
    try {
        const response = await axios.get(`/leave/leave-today`, { signal });
        let { data } = response;

        return data;
    } catch (err) {
        throw `Fetch employee leave today failed: ${err}`;
    }
}
