import React, { useEffect, useState } from 'react'
import axios from '@/api/axios/AxiosInstance'

export const useBreadcrumb = id => {
    const [breadcrumbs, setBreadcrumbs] = useState([])

    useEffect(() => {
        const fetchProfile = async () => {
            const { data } = await axios.get(
                `employee/get-user-profile?employeeId=${id}`
            )
            let { fullName } = await data?.data
            if (fullName) {
                setBreadcrumbs([
                    'Employee Management',
                    'Employee List',
                    fullName
                ])
            } else {
                setBreadcrumbs(['Employee Management', 'Employee List'])
            }
        }
        fetchProfile()
    }, [id])

    return breadcrumbs
}

export default useBreadcrumb
