import axios from '@/shared/services/axios-instance';

export async function getSupervisors (id) {
    try {
        const response = await axios.get(
            `/employee/report-to/${id}/supervisors`
        );
        let { data } = response;
        return data;
    } catch (err) {
        throw `Fetch supervisors failed: ${err}`;
    }
}

export async function getEmployeeSupervisors (id) {
    try {
        const response = await axios.get(
            `/employee/report-to/${id}/get-employee-supervisors`
        );
        let { data } = response;
        return data;
    } catch (err) {
        throw `Fetch employee supervisors failed: ${err}`;
    }
}

export async function addSupervisor (formData) {
    try {
        let { employeeId: id } = formData;
        const response = await axios.post(
            `/employee/report-to/${id}/add-supervisor`,
            formData
        );
        let { data } = response;
        return data;
    } catch (err) {
        throw `Add supervisor failed: ${err}`;
    }
}

export async function updateSupervisor (formData) {
    try {
        let { employeeId: id } = formData;
        const response = await axios.put(
            `/employee/report-to/${id}/update-supervisor`,
            formData
        );
        let { data } = response;
        return data;
    } catch (err) {
        throw `Add supervisor failed: ${err}`;
    }
}

export async function deleteSupervisor (formData) {
    try {
        let { employeeId: id } = formData;
        const response = await axios.post(
            `/employee/report-to/${id}/delete-supervisor`,
            formData
        );
        let { data } = response;
        return data;
    } catch (err) {
        throw `Delete supervisor failed: ${err}`;
    }
}

export async function getSupervisorEditing (supervisorId) {
    try {
        const response = await axios.get(
            `/employee/report-to/${supervisorId}/supervisor`
        );
        let { data } = response;
        return data;
    } catch (err) {
        throw `Fetch supervisor editing failed: ${err}`;
    }
}
