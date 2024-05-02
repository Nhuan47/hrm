import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { usePermissions } from "@/shared/hooks/use-permission";
import { featureKeys } from "@/shared/permission-key";

import { ReportFilter } from "../_components/report-template/report-filter";
import { ReportSummary } from "../_components/report-template/report-summary";
import { ReportDisplay } from "../_components/report-template/report-display";
import { loadDefinition } from "../_slices/report-slice";

import { ChartModal } from "../_components/report-template/chart-modal";

const ReportTemplatePage = () => {
  const { isReadable } = usePermissions(featureKeys.REPORT, {
    isCheckIdByParam: false,
  });

  if (isReadable) {
    // Get report id from url
    const { id } = useParams();

    // define dispatch
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(true);

    const isActiveModal = useSelector(
      (state) => state.report.chartInfo.isActiveModal
    );

    //   Trigge to fetch report definitions and dispatch to redux store
    useEffect(() => {
      // Fetch current report definitions
      const fetchReportDefinition = async () => {
        setIsLoading(true);
        await dispatch(loadDefinition(id));
        setIsLoading(false);
      };
      fetchReportDefinition();
    }, [id]);

    return (
      <div className="space-y-10 ">
        <ReportFilter />
        <ReportSummary />
        <ReportDisplay />
        {isActiveModal && <ChartModal />}
      </div>
    );
  } else {
    return <span>Fobbident 403</span>;
  }
};

export default ReportTemplatePage;
