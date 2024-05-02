import axios from '@/shared/services/axios-instance';

export async function getOrgStructure (id) {
    try {
        const response = await axios.get(
            `/employee/report-to/${id}/org-structure`
        );
        let { data } = response;
        return data;
    } catch (err) {
        throw `Fetch organization structure failed: ${err}`;
    }
}
