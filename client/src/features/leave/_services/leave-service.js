import axios from '@/shared/services/axios-instance';

export async function getUserRoleFromSharePointSite ({ email }) {
    try {
        let aa = 'quannguyen@savarti.com';
        const response = await axios.get(`/leave/user-roles?email=${aa}`);
        let { data } = response;
        return data;
    } catch (err) {
        throw new Error(`Fetch table headers failed: ${err}`);
    }
}

export async function getCurrentUserFromSharePoint (email) {
    try {
        const response = await axios.get(`/leave/current-user?email=${email}`);
        let { data } = response;
        return data;
    } catch (err) {
        throw new Error(`Fetch table headers failed: ${err}`);
    }
}

export async function getTimeOffFromSharePointSite ({
    userId,
    mode,
    offset,
    departmentId,
    limit
}) {
    try {
        const response = await axios.get(
            `/leave/time-off?userId=${userId}&departmentId=${departmentId}&mode=${mode}&offset=${offset}&limit=${limit}`
        );
        let { data } = response;
        return data;
    } catch (err) {
        throw new Error(`Fetch table headers failed: ${err}`);
    }
}

export async function getDepartmenFromSharePoint () {
    try {
        const response = await axios.get(`/leave/departments`);
        let { data } = response;
        return data;
    } catch (err) {
        throw new Error(`Fetch departments failed: ${err}`);
    }
}

export async function getTimeOffApprovalFromSharePoint ({
    offset,
    limit,
    userId
}) {
    try {
        const response = await axios.get(
            `/leave/time-off-approval?userId=${userId}&offset=${offset}&limit=${limit}`
        );
        let { data } = response;
        return data;
    } catch (err) {
        throw new Error(`Fetch time off approval failed: ${err}`);
    }
}

export async function getTimeOffBalanceFromSharePoint ({
    offset,
    limit,
    userId,
    year
}) {
    try {
        const response = await axios.get(
            `/leave/time-off-amount?userId=${userId}&year=${year}&offset=${offset}&limit=${limit}`
        );
        let { data } = response;
        return data;
    } catch (err) {
        throw new Error(`Fetch time off approval failed: ${err}`);
    }
}

export async function getHolidayFromSharePoint (email) {
    try {
        const response = await axios.get(`/leave/public-holidays`);
        let { data } = response;
        return data;
    } catch (err) {
        throw new Error(`Fetch public holidays failed: ${err}`);
    }
}
