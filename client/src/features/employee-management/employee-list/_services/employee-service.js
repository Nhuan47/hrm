import axios from '@/shared/services/axios-instance';

export async function getTableHeader () {
    try {
        const response = await axios.get('/employee/get-table-headers');
        let { data } = response;
        return data;
    } catch (err) {
        throw `Fetch table headers failed: ${err}`;
    }
}

export async function getEmployeeList (dataForm) {
    try {
        const { offset, limit } = await dataForm;
        const response = await axios.get(
            `/employee/get-employee-list?limit=${limit}&offset=${offset}`
        );
        let { data } = response;

        return data;
    } catch (err) {
        throw `Fetch employees list failed: ${err}`;
    }
}

export async function fetchFields () {
    try {
        const response = await axios.get(`/employee/get-user-create-fields`);
        let { data } = response;

        return data;
    } catch (err) {
        throw `Fetch fields list failed: ${err}`;
    }
}

export async function getEmails () {
    try {
        const response = await axios.get(`/employee/email-list`);
        let { data } = response;

        return data;
    } catch (err) {
        throw `Fetch emails list failed: ${err}`;
    }
}

export async function getStaffCodes () {
    try {
        const response = await axios.get(`/employee/staff-code-list`);
        let { data } = response;

        return data;
    } catch (err) {
        throw `Fetch emails list failed: ${err}`;
    }
}

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

export async function addEmployee (formData) {
    try {
        const response = await axios.post(`/employee/wizard`, formData);
        let { data } = response;

        return data;
    } catch (err) {
        throw `Failed to add employee: ${err}`;
    }
}
