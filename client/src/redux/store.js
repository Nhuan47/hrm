import { configureStore } from '@reduxjs/toolkit'
import authSlice from '@/redux/authSlice/AuthSlice'
import supervisorSlice from '@/redux/employeeSlice/SupervisorSlice'
import subordinateSlice from '@/redux/employeeSlice/SubordinateSlice'
import assignAttachmentSlice from '@/redux/employeeSlice/AssignAttachmentSlice'
import ReportSlice from '@/redux/reportAnalyticSlice/ReportSlice'
import CatalogueSlice from './reportAnalysis/CatalogueSlice'
import analysisSlice from '@/redux/reportAnalysis/AnalysisSlice'
import salarySlice from '@/redux/employeeSlice/SalarySlice'
import test from '@/redux/test'

export const store = configureStore({
    reducer: {
        auth: authSlice,
        supervisorStore: supervisorSlice,
        subordinateStore: subordinateSlice,
        assignAttachmentStore: assignAttachmentSlice,
        reportStore: ReportSlice,
        analysisStore: analysisSlice,
        catalogue: CatalogueSlice,
        salary: salarySlice,
        test: test
    }
})
