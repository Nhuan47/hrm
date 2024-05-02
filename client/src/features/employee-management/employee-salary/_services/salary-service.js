import axios from '@/shared/services/axios-instance';

export async function getSalaryFields () {
    try {
        const response = await axios.get(`/employee/salary/salary-fields`);
        let { data } = response;
        return data;
    } catch (err) {
        throw `Fetch salary field failed: ${err}`;
    }
}

export async function addSalaryItem (formData) {
    try {
        const { employeeId } = formData;

        const response = await axios.post(
            `/employee/salary/${employeeId}/add-salary`,
            formData
        );
        let { data } = response;
        return data;
    } catch (err) {
        throw `Save salary failed: ${err}`;
    }
}

export async function updateSalaryItem (formData) {
    try {
        const { employeeId } = formData;

        const response = await axios.put(
            `/employee/salary/${employeeId}/update-salary`,
            formData
        );
        let { data } = response;
        return data;
    } catch (err) {
        throw `Save salary failed: ${err}`;
    }
}

export async function getSalaryItems (employeeId) {
    try {
        const response = await axios.get(
            `/employee/salary/${employeeId}/salary-items`
        );
        let { data } = response;
        return data;
    } catch (err) {
        throw `Fetch salary histories failed: ${err}`;
    }
}

export async function deleteSalaryItem (formData) {
    try {
        const { employeeId, salaryId } = formData;
        const { data } = await axios.delete(
            `/employee/salary/${employeeId}/delete-salary/${salaryId}`
        );

        return data;
    } catch (err) {
        throw `Fetch salary histories failed: ${err}`;
    }
}
