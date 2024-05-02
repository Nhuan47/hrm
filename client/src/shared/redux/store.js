import { configureStore } from '@reduxjs/toolkit';
import authSlice from '@/features/authentication/_slices/auth-slice';
import salarySlice from '@/features/employee-management/employee-salary/_slices/salary-slice';
import supervisorSlice from '@/features/employee-management/employee-report-to/_slices/supervisor-slice';

import subordinateSlice from '@/features/employee-management/employee-report-to/_slices/subordinate-slice';

import attachmentSlice from '@/features/employee-management/employee-report-to/_slices/attachment-slice';

import catalogueSlice from '../../features/report-and-analysis/_slices/catalogue-slice';

import definitionSlice from '@/features/report-and-analysis/_slices/definition-slice';

import reportSlice from '@/features/report-and-analysis/_slices/report-slice';

import roleSlice from '../../features/settings/_slices/role-slice';

import userRoleSlice from '../../features/settings/_slices/user-role-slice';
import attributeSlice from '../../features/settings/_slices/attribute-slice';

export const store = configureStore({
    reducer: {
        auth: authSlice,
        salary: salarySlice,
        supervisor: supervisorSlice,
        subordinate: subordinateSlice,
        attachment: attachmentSlice,
        catalogue: catalogueSlice,
        definition: definitionSlice,
        report: reportSlice,
        role: roleSlice,
        userRole: userRoleSlice,
        attribute: attributeSlice
    }
});
