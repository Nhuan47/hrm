import axios from '@/shared/services/axios-instance';

export async function updateAvatar (dataForm) {
    try {
        const { userId } = dataForm;
        const response = await axios.post(
            `/employee/update-avatar/${userId}`,
            dataForm
        );
        let { data } = response;

        return data;
    } catch (err) {
        throw `Update avatar failed: ${err}`;
    }
}

export async function getEmployeeProfile ({ id }) {
    try {
        const response = await axios.get(`/employee/profile/${id}`);
        let { data } = response;

        return data;
    } catch (err) {
        throw `Fetch employee profile failed: ${err}`;
    }
}
