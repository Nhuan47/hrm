import React, { useState, useEffect, memo } from "react";
import { useParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { Modal } from "@/shared/components/modal";
import { Button } from "@/shared/components/ui/button";
import {
  PIE_CHART_KEY,
  BAR_CHART_KEY,
  PIVOT_CHART_KEY,
  GROUP_BY_KEY,
  AXIS_KEY,
  LEGEND_KEY,
  GROUP_KEY,
  PIVOT_KEY,
} from "@/shared/constants";

import { ChartType } from "./chart-type";
import { ChartSetting } from "./chart-setting";

import {
  addReportGroupBy,
  activeModal,
  activeChart,
} from "../../../_slices/report-slice";
import * as api from "../../../_services/report-service";

export const ChartModal = () => {
  const selectedGroupByFields = useSelector(
    (state) => state.report.selectedGroupByFields
  );

  const isActiveModal = useSelector(
    (state) => state.report.chartInfo.isActiveModal
  );

  const chartType = useSelector((state) => state.report.chartInfo.chartType);

  const dispatch = useDispatch();

  const { id } = useParams();

  const [fields, setFields] = useState([]);

  //   State to manage bar chart select
  const [chartName, setChartName] = useState(chartType || BAR_CHART_KEY);

  const [isInitialForm, setIsInitialForm] = useState(false);

  useEffect(() => {
    const fetchFields = async () => {
      // Fecth data
      const { data } = await api.getFields(id);
      return data;
    };
    fetchFields()
      .then((data) => {
        setFields(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]);

  //   Initialize form
  const methods = useForm({
    defaultValues: {
      [GROUP_KEY]: {},
      [PIVOT_KEY]: {},
    },
  });

  const { watch, handleSubmit, setError, setValue, reset } = methods;

  // Function to handle set default value for the form
  const setDefaultValue = (items, KEY, fields, TYPE) => {
    if (TYPE === GROUP_KEY) {
      // Set default value for form group by
      items?.forEach((item) => {
        let fieldSelected = fields?.filter(
          (field) => field.value === item.attributeId
        );

        if (fieldSelected?.length > 0) {
          setValue(`${KEY}.${item.id}`, fieldSelected[0]);
        }
      });
    } else {
      let fieldSelected = fields?.filter((field) =>
        items.some((item) => item.attributeId === field.value)
      );
      setValue(`${KEY}`, fieldSelected);
    }
  };

  // Function to handle set default value for form
  const initValue = () => {
    console.log("initValue selectedGroupByFields: ", selectedGroupByFields);
    // Check group by on redux store exists
    if (selectedGroupByFields?.length > 0) {
      const groupItems = selectedGroupByFields.filter(
        (item) => item.type === GROUP_BY_KEY
      );

      if (groupItems.length > 0) {
        setDefaultValue(groupItems, GROUP_KEY, fields, GROUP_KEY);
      } else {
        // Set default value for pivot ->  axis
        const axisItems = selectedGroupByFields.filter(
          (item) => item.type === AXIS_KEY
        );

        if (axisItems?.length > 0) {
          setDefaultValue(
            axisItems,
            `${PIVOT_KEY}.${AXIS_KEY}`,
            fields,
            AXIS_KEY
          );
        }

        // Set default value for pivot ->  legend
        const legendItems = selectedGroupByFields.filter(
          (item) => item.type === LEGEND_KEY
        );
        if (legendItems?.length > 0) {
          setDefaultValue(
            legendItems,
            `${PIVOT_KEY}.${LEGEND_KEY}`,
            fields,
            LEGEND_KEY
          );
        }
      }
    } else {
      reset({
        [GROUP_KEY]: {},
        [PIVOT_KEY]: {},
      });
      console.log("Reset form value empty");
    }
  };

  // trigger to set default value for form
  useEffect(() => {
    if (fields.length > 0) {
      setIsInitialForm(false);
      initValue();
      setIsInitialForm(true);
    }
  }, [selectedGroupByFields, fields]);

  // Function to validate form valid
  const validateFormSubmition = (dataForm) => {
    if (chartName === PIVOT_CHART_KEY) {
      let { axis, legend } = dataForm[PIVOT_KEY];
      if (axis === undefined && legend === undefined) {
        setError("axis", { type: 404, message: "Required" });
      } else return true;
    } else {
      // Get all group by field  has the value not equal undefined
      let groupHasValues = Object.keys(dataForm[GROUP_KEY])?.filter(
        (key) => dataForm[GROUP_KEY][key] !== undefined
      );

      // If has at least one value => validate ok otherwise return false
      if (groupHasValues.length > 0) return true;

      // Set error message for field
      Object.keys(dataForm[GROUP_KEY])?.forEach((key) => {
        setError(`${GROUP_KEY}.${key}`, { type: 404, message: "Required" });
      });
    }
    return false;
  };

  //   Function to handle form submit
  const handleFormSubmit = async (dataForm) => {
    let isValid = validateFormSubmition(dataForm);

    let newFormData = {};

    if (isValid) {
      // Prepare data form submit
      if (chartName === PIVOT_CHART_KEY) {
        console.log("dataForm submit: ", dataForm);
        const { axis, legend } = dataForm[PIVOT_KEY];

        let groupCustom = [];

        // Add axis field selected
        if (axis !== undefined && axis.length > 0) {
          axis?.forEach((item) => {
            groupCustom.push({
              attributeId: item.value,
              type: AXIS_KEY,
            });
          });
        }

        // Add legend field selected
        if (legend !== undefined && legend.length > 0) {
          legend?.forEach((item) => {
            groupCustom.push({
              attributeId: item.value,
              type: LEGEND_KEY,
            });
          });
        }

        // Custom data form to submit
        newFormData = {
          reportId: id,
          groupBy: groupCustom,
          chartType: chartName,
        };
      } else {
        const groupByFields = dataForm[GROUP_KEY];
        // custom group value
        let groupCustom = [];
        Object.keys(groupByFields)?.forEach((item) => {
          if (groupByFields[item]) {
            groupCustom.push({
              id: item,
              attributeId: groupByFields[item]?.value,
              type: GROUP_BY_KEY,
            });
          }
        });

        // Custom data form to submit
        newFormData = {
          reportId: id,
          groupBy: groupCustom,
          chartType: chartName,
        };
      }

      //  Dispath action to add new report
      const {
        meta: { requestStatus },
        payload,
      } = await dispatch(addReportGroupBy(newFormData));

      if (requestStatus === "fulfilled") {
        initValue();
        toast.success("Save successfully");
        await dispatch(activeChart(true));
      } else {
        reset();
        // initValue();
        toast.error("Save failed");
      }
    } else {
    }
  };

  // Function to handle chart close
  const handleCancel = () => {
    initValue();
    dispatch(activeModal(false));
  };

  if (!fields.length) return null;

  return (
    <Modal
      title={selectedGroupByFields?.length > 0 ? "Edit Chart" : "Add Chart"}
      isOpen={isActiveModal}
      onClose={handleCancel}
    >
      <FormProvider {...methods}>
        {/* Chart type */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="px-5 pt-2 pb-5 min-w-[45rem] max-w-[60rem]"
        >
          {/* Chart type */}
          <ChartType chartName={chartName} setChartName={setChartName} />

          {/* Chart setting  */}
          {isInitialForm && (
            <ChartSetting
              isPivot={
                chartName === PIE_CHART_KEY || chartName === BAR_CHART_KEY
                  ? false
                  : true
              }
              fields={fields}
            />
          )}

          {/* Action button */}
          <div className="pt-6 pb-2 flex justify-end  items-center gap-2 border-t">
            <Button
              type="button"
              className="btn-secondary"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button type="submit" className="btn-primary">
              Save
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};

export default memo(ChartModal);
