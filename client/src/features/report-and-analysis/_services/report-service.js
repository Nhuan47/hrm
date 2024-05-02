import axios from '@/shared/services/axios-instance';

export async function getDisplayValues (reportId, filterData) {
    try {
        const response = await axios.post(
            `/reports/definition/${reportId}/table-rows`,
            filterData
        );
        let { data } = response;
        return data;
    } catch (err) {
        throw `Fetch report display failed: ${err}`;
    }
}

export async function getSummaryReport (formData) {
    try {
        const { id } = formData;
        const response = await axios.post(
            `/reports/definition/${id}/summary-report`,
            formData
        );
        let { data } = response;
        return data;
    } catch (err) {
        throw `Fetch summary report failed: ${err}`;
    }
}

export async function getFields (id) {
    try {
        const response = await axios.get(
            `/reports/definition/${id}/get-report-field-list`
        );
        let { data } = response;
        return data;
    } catch (err) {
        throw `Fetch report fields failed: ${err}`;
    }
}
