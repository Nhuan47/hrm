import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { Loading } from "@/shared/components/loading-overlay";

import { ReportNameStep } from "./report-name-step";
import { ReportFilterStep } from "./report-filter-step";
import { ReportDisplayStep } from "./report-display-step";
import { FormMultiStep } from "../multi-step/form-multi-step";
import { DISPLAY_KEY } from "../../../_constants/definition-constant";
import {
  loadDefinition,
  saveReportDefinition,
} from "../../../_slices/definition-slice";

import { showNotification } from "@/utils/utils";

export const ReportDefinitionForm = () => {
  //  get current id from url
  const { id } = useParams();

  const navigate = useNavigate();

  //   Initialize dispatch event
  const dispatch = useDispatch();

  const isLoading = useSelector((state) => state.definition.isLoading);

  // Trigge to fetch report definitions and dispatch to redux store
  useEffect(() => {
    // Fetch current report definitions
    const fetchReportDefinition = async () => {
      const currentId = id ? id : "-1";
      await dispatch(loadDefinition(currentId));
    };
    fetchReportDefinition();
  }, [id]);

  //   Handle submit form add new report
  const handleSubmit = async (formData) => {
    if (formData) {
      // Check display field contains
      if (Object.keys(formData[DISPLAY_KEY]).length > 0) {
        const displayItemSelected = Object.keys(formData[DISPLAY_KEY]).filter(
          (fieldId) => formData[DISPLAY_KEY][fieldId]
        );

        const newFormData = {
          ...formData,
          id: id,
          display: displayItemSelected,
        };

        const {
          meta: { requestStatus },
          payload: { reportId },
        } = await dispatch(saveReportDefinition(newFormData));

        if (requestStatus === "fulfilled") {
          showNotification("Save successfully");

          setTimeout(
            () => navigate(`/report-and-analytics/${reportId}/report-template`),
            3000
          );
        } else {
          showNotification("Save failed", "error");
        }
      } else {
        showNotification(
          "At least one display field should be selected",
          "warning"
        );
      }
    }
  };

  const handleNext = (formData) => {
    console.log("Handle next: ", formData);
  };

  const handleBack = (formData) => {
    console.log("handle back: ", formData);
  };

  const handleCancel = () => {
    navigate("/report-and-analytics/catalogue");
  };

  return (
    <>
      <FormMultiStep
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        onNext={handleNext}
        onBack={handleBack}
      >
        <ReportNameStep title="Report Name" />
        <ReportFilterStep title="Select Filters" />
        <ReportDisplayStep title="Display" />
      </FormMultiStep>

      <Loading isOpen={isLoading} />
    </>
  );
};
