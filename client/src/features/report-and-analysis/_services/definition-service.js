import axios from '@/shared/services/axios-instance';

export async function getModules () {
    try {
        const response = await axios.get('/reports/definition/get-modules');
        let { data } = response;
        return data;
    } catch (err) {
        throw new Error(`Fetch report modules failed: ${err}`);
    }
}

export async function getCurrentReportDefinition (reportId) {
    try {
        const response = await axios.get(`/reports/${reportId}/definition`);
        let { data } = response;
        return data;
    } catch (err) {
        throw new Error(`Fetch report definition failed: ${err}`);
    }
}

export async function saveReportDefinition (formData) {
    try {
        let url = '/reports/definition/add';
        const { id } = formData;
        if (id) {
            url = `/reports/definition/${id}/update`;
        }

        const response = await axios.post(url, formData);
        let { data } = response;
        return data;
    } catch (err) {
        throw new Error(`Save report definition failed: ${err}`);
    }
}
