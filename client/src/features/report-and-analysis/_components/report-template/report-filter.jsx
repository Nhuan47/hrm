import React from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { AiFillPieChart } from "react-icons/ai";
import { MdOutlineEdit } from "react-icons/md";
import { MdOutlinePublic } from "react-icons/md";

import { FormSelect } from "@/shared/components/form/form-select";
import { ButtonTooltip } from "@/shared/components/ui/button-tooltip";
import { usePermissions } from "@/shared/hooks/use-permission";
import { Button } from "@/shared/components/ui/button";
import { featureKeys, permissionKeys } from "@/shared/permission-key";

import {
  loadFilters,
  activeModal,
  activeChart,
  onPublic,
} from "../../_slices/report-slice";
import { Wrapper } from "./wrapper";

export const ReportFilter = () => {
  const { isReadable, isUpdateable } = usePermissions(featureKeys.REPORT, {
    isCheckIdByParam: false,
  });

  // Get params from url
  const { id } = useParams();

  const navigate = useNavigate();

  const {
    selectedFilters,
    reportName,
    availableFilters,
    isPublic,
    chartInfo: { chartType, isActiveChart },
  } = useSelector((state) => state.report);

  // Define use dispatch hook
  const dispatch = useDispatch();

  //   Init hook form
  const methods = useForm();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  // find the filter field selected to render
  const currentFilterFields = Object.values(availableFilters).filter((obj) =>
    selectedFilters.hasOwnProperty(obj.id)
  );

  //   Function to handle button generate click
  const handleGenerate = async (dataForm) => {
    await dispatch(loadFilters(dataForm));
  };

  //  Function to handle chart button click
  const handleChartButtonClick = async () => {
    if (chartType) {
      // Dispatch action to update the group by for chart
      await dispatch(activeChart(!isActiveChart));
    } else {
      // Dispatch action to add new the group by for chart
      await dispatch(activeModal(true));
    }
  };

  const onPublicReport = async (reportId) => {
    const {
      meta: { requestStatus },
    } = await dispatch(onPublic({ isPublic: !isPublic, reportId }));
    if (requestStatus === "fulfilled") {
      if (isPublic) {
        toast.success("Report successfully made private");
      } else {
        toast.success("Report successfully made public");
      }
    } else {
      toast.error("Save failed.");
    }
  };

  return (
    <Wrapper>
      {/* Header */}
      <header className="flex justify-between items-center  pb-5  border-b border-slate-300">
        {/* Title */}
        <span className="font-semibold">{reportName}</span>

        {/*Action*/}
        <div className="flex items-center gap-2">
          {isUpdateable && isReadable ? (
            <>
              <ButtonTooltip
                tooltip={{
                  message: "Public report",
                  position: "top",
                  className: "w-[6rem]",
                }}
                className={`p-2  rounded-full cursor-pointer duration-300
              ${
                isPublic === 1
                  ? "text-primary-400 bg-primary-100/60"
                  : "text-secondary-500/80 bg-secondary-200/60"
              }`}
                onClick={() => onPublicReport(id)}
              >
                <MdOutlinePublic size={21} />
              </ButtonTooltip>

              <ButtonTooltip
                tooltip={{
                  message: isActiveChart ? "Active Chart" : "InActive Chart",
                  position: "top",
                  className: "w-[5rem]",
                }}
                className={`p-2  rounded-full cursor-pointer duration-300
              ${
                isActiveChart && chartType
                  ? "text-primary-400 bg-primary-100/60"
                  : "text-secondary-500/80 bg-secondary-200/60"
              }`}
                onClick={handleChartButtonClick}
              >
                <AiFillPieChart size={21} />
              </ButtonTooltip>

              <ButtonTooltip
                tooltip={{
                  message: "Edit report",
                  position: "top",
                  className: "w-[5rem]",
                }}
                className="p-2 bg-secondary-200/60 rounded-full cursor-pointer hover:bg-secondary-200 duration-300"
                onClick={() =>
                  navigate(`/report-and-analytics/${id}/definition`)
                }
              >
                <MdOutlineEdit size={21} />
              </ButtonTooltip>
            </>
          ) : null}
        </div>
      </header>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleGenerate)}>
          {/* Content */}
          <article className="py-5">
            <div className="flex flex-wrap min-h-[6rem]">
              {currentFilterFields &&
                currentFilterFields.map((item) => {
                  return (
                    <div
                      key={item.id}
                      className="basis-1/3 max-w-[33%] p-2 2xl:basis-1/3 2xl:max-w-[25%]"
                    >
                      <FormSelect
                        name={`${item.id}`}
                        label={item?.name}
                        defaultValue={
                          selectedFilters[item.id] || { label: "", value: "" }
                        }
                        isMulti
                        options={item?.choices}
                      />
                    </div>
                  );
                })}
            </div>
          </article>

          {/* Footer */}
          <footer className="flex justify-end items-center gap-3">
            {/* <Button className="btn-secondary">Save As</Button> */}
            <Button type="submit" className="btn-primary">
              Generate
            </Button>
          </footer>
        </form>
      </FormProvider>
    </Wrapper>
  );
};
