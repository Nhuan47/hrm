import axios from '@/shared/services/axios-instance';

export async function getSubordinates (id) {
    try {
        const response = await axios.get(
            `/employee/report-to/${id}/subordinates`
        );
        let { data } = response;
        return data;
    } catch (err) {
        throw `Fetch subordinates failed: ${err}`;
    }
}

export async function getEmployeeSubordinates (id) {
    try {
        const response = await axios.get(
            `/employee/report-to/${id}/get-employee-subordinates`
        );
        let { data } = response;
        return data;
    } catch (err) {
        throw `Fetch get employee subordinates failed: ${err}`;
    }
}

export async function addSubordinate (formData) {
    try {
        let { supervisorId } = formData;
        const response = await axios.post(
            `/employee/report-to/${supervisorId}/add-subordinate`,
            formData
        );
        let { data } = response;
        return data;
    } catch (err) {
        throw `Add subordinate failed: ${err}`;
    }
}

export async function updateSubordinate (formData) {
    try {
        let { supervisorId } = formData;
        const response = await axios.put(
            `/employee/report-to/${supervisorId}/update-subordinate`,
            formData
        );
        let { data } = response;
        return data;
    } catch (err) {
        throw `Update subordinate failed: ${err}`;
    }
}

export async function deleteSubordinate (formData) {
    try {
        let { employeeId } = formData;
        const response = await axios.put(
            `/employee/report-to/${employeeId}/delete-subordinate`,
            formData
        );
        let { data } = response;
        return data;
    } catch (err) {
        throw `Delete subordinates failed: ${err}`;
    }
}

export async function getSubordinateEditing (assignId) {
    try {
        let { employeeId } = formData;
        const response = await axios.put(
            `/employee/report-to/${assignId}/subordinate`,
            formData
        );
        let { data } = response;
        return data;
    } catch (err) {
        throw `Fetch subordinate editing failed: ${err}`;
    }
}
