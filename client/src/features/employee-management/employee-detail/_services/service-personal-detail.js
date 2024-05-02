import axios from '@/shared/services/axios-instance';

export async function getEmployeeInfo (id) {
    try {
        const response = await axios.get(`/employee/personal-details/${id}`);
        let { data } = response;

        return data;
    } catch (err) {
        throw `Fetch employee infor failed: ${err}`;
    }
}

export async function getEmployeeGroupAttributes (id) {
    try {
        const response = await axios.get(`/employee/${id}/group-attributes`);
        let { data } = response;

        return data;
    } catch (err) {
        throw `Fetch group attributes failed: ${err}`;
    }
}

export async function saveEmployeeInfo ({ id, formData }) {
    try {
        const response = await axios.patch(
            `/employee/update-employee-info/${id}`,
            formData
        );
        let { data } = response;

        return data;
    } catch (err) {
        throw `Save employee detail failed: ${err}`;
    }
}
