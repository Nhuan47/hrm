import React, { useEffect, useLayoutEffect, useState } from "react";
import { object, string } from "yup";
import { useParams } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

import { Modal } from "@/shared/components/modal";
import { Button } from "@/shared/components/ui/button";

import {
  addSupervisor,
  updateSupervisor,
  openSupervisorModal,
  setCurrentSupervisorId,
} from "../../_slices/supervisor-slice";
import * as api from "../../_services/supervisor-service";
import { getMethods } from "../../_services/method-sevice";
import { FormSelect } from "./form-select";
import { FormInput } from "./form-input";

export const SupervisorModal = () => {
  // Get the employee id from url
  const { id } = useParams();

  // Redux store
  const { isOpenModal, currentId } = useSelector((state) => state.supervisor);

  const dispatcher = useDispatch();

  // Keep track suppervisor state
  const [supervisors, setSupervisors] = useState([]);

  // Keep track suppervisor state
  const [methods, setMethods] = useState([]);

  // keep track state of add new methods
  const [isAddNewMethod, setIsAddNewMethod] = useState(false);

  // Define yup validation
  const yupValidation = object().shape({
    specifyMethod: isAddNewMethod
      ? string()
          .required("Specify method is required")
          .test("is-existed", "Methods already exists", (methodName) => {
            if (methodName) {
              return (
                !methods.filter(
                  (method) =>
                    method.label.toLowerCase() ===
                    methodName.trim().toLowerCase()
                ).length > 0
              );
            }
            return true;
          })
      : string().notRequired(),
    name: object()
      .shape({
        label: string().required("Name is required"),
      })
      .required("Name is required"),

    reportMethod: object().shape({
      label: string().required("Report method is required"),
    }),
  });

  // Initialize react-hook-form with useForm
  const formMethods = useForm({
    resolver: yupResolver(yupValidation),
  });

  const {
    handleSubmit,
    setValue,
    reset,
    watch,
    control,
    formState: { errors, dirtyFields },
  } = formMethods;

  // Init waitch for the report method field
  const watchMethod = watch("reportMethod");

  // Fetch supervisors
  useEffect(() => {
    if (isOpenModal) {
      const fetchSupervisors = async () => {
        const { data } = await api.getEmployeeSupervisors(id);
        let supervisorItems = data.map((supervisor) => ({
          value: supervisor.id,
          label: supervisor.name,
        }));
        return supervisorItems;
      };
      fetchSupervisors()
        .then((data) => {
          setSupervisors(data);
        })
        .catch((err) => {
          setSupervisors([]);
          throw new Error(err);
        });
    }
  }, [isOpenModal]);

  // Fetch report methods
  useEffect(() => {
    if (isOpenModal) {
      const fetchMethods = async () => {
        const { data } = await getMethods();
        let methodItems = data.map((method) => ({
          value: method.id,
          label: method.name,
        }));
        methodItems.push({
          value: "other",
          label: "Other",
        });
        return methodItems;
      };
      fetchMethods()
        .then((methods) => {
          setMethods(methods);
        })
        .catch((err) => {
          setMethods([]);
          throw new Error(err);
        });
    }
  }, [isOpenModal]);

  // Fetch supervisor editing
  useLayoutEffect(() => {
    if (isOpenModal && currentId) {
      const fetchSupervisorEditing = async () => {
        let res = await api.getSupervisorEditing(currentId);

        // Trigger init form
        reset({
          reportMethod: {
            label: res.data?.method.name,
            value: res.data?.method.id,
          },
          name: {
            label: res.data?.supervisor.name,
            value: res.data?.supervisor.id,
          },
        });
      };
      fetchSupervisorEditing();
    }
  }, [currentId]);

  // Check watch add new methods
  useEffect(() => {
    if (watchMethod?.value === "other") {
      setIsAddNewMethod(true);
    } else {
      setIsAddNewMethod(false);
      setValue("specifyMethod", "");
    }
  }, [watchMethod]);

  // Handle form add new supervisor submit
  const handleFormAddNewSubmit = async (formData) => {
    let newFormData = {
      supervisorId: formData.name.value,
      methodId: formData.reportMethod.value,
      newMethod: formData.specifyMethod,
      employeeId: id,
    };
    const {
      meta: { requestStatus },
    } = await dispatcher(addSupervisor(newFormData));

    if (requestStatus === "fulfilled") {
      reset({ _: {} });
      toast.success("Save sucessfully");
    } else {
      toast.error("Save failed");
    }
  };

  // Function to handle submit form update
  const handleFormUpdateSubmit = async (formData) => {
    let newFormData = {
      supervisorId: formData.name.value,
      methodId: formData.reportMethod.value,
      newMethod: formData.specifyMethod,
      employeeId: id,
      supervisorItemId: currentId,
    };

    const {
      meta: { requestStatus },
    } = await dispatcher(updateSupervisor(newFormData));

    if (requestStatus === "fulfilled") {
      reset({ _: {} });
      toast.success("Save sucessfully");
    } else {
      toast.error("Save failed");
    }
  };

  // Function to handle form cancel
  const handleFormCancel = () => {
    dispatcher(setCurrentSupervisorId(null));
    dispatcher(openSupervisorModal(false));
    reset({ _: {} });
  };

  // Flag - Watch fields dirty to enable button submit form
  const isDisableSubmit = Object.keys(dirtyFields).length === 0;

  return (
    <Modal
      title={currentId ? "Edit Supervisor" : "Add Supervisor"}
      isOpen={isOpenModal}
      onClose={handleFormCancel}
    >
      <FormProvider {...formMethods}>
        <form
          onSubmit={handleSubmit(
            currentId ? handleFormUpdateSubmit : handleFormAddNewSubmit
          )}
        >
          {/* Start Form body */}
          <div className="px-5 pb-5 flex flex-col gap-2 justify-center items-stretch w-[25rem]">
            {/* Field Name */}

            <FormSelect
              name="name"
              label="Name"
              placeholder="Select Supervisor"
              options={supervisors}
              noOptionsMessage={() => "No results found"}
            />

            {/* Field report method */}
            <FormSelect
              name="reportMethod"
              label="Reporting Method"
              options={methods}
              isRequired
              noOptionsMessage={() => "No method found"}
              placeholder="Select method"
            />

            {/* Field add new specific report method */}
            {isAddNewMethod && (
              <FormInput
                name="specifyMethod"
                label="Specify Method"
                className="w-full"
                isRequired
              />
            )}
          </div>
          {/* End Form body */}

          {/* Start Footer Form */}
          <div className="flex justify-between items-center border-t px-5">
            {/* Is required text */}
            <p className="text-xs text-secondary-500 capitalize">* required</p>
            {/* End required text */}

            {/* Start button actions */}
            <div className="flex justify-end items-center gap-2 py-5">
              <Button
                className="border-primary-500 text-primary-500  hover:bg-primary-50"
                onClick={handleFormCancel}
              >
                Cancel
              </Button>

              <Button
                disabled={isDisableSubmit}
                type="submit"
                className={` text-light  ${
                  isDisableSubmit
                    ? "bg-primary-400 border-primary-400"
                    : "bg-primary-500 hover:bg-primary-600 border-primary-500"
                }`}
              >
                Save
              </Button>
            </div>
            {/* End button actions */}
          </div>
          {/* End Footer form */}
        </form>
      </FormProvider>
    </Modal>
  );
};
