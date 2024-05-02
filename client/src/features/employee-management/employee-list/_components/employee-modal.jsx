import React, { useRef } from "react";
import { object, string } from "yup";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Modal } from "@/shared/components/modal";
import { useFetch } from "@/shared/hooks/use-fetch";
import { Loading } from "@/shared/components/loading-overlay";
import { FormInput } from "@/shared/components/form/form-input";
import { FormSelect } from "@/shared/components/form/form-select";
import { LoadingReload } from "@/shared/components/loading-reload";

import { ModalImage } from "./modal-image";
import { ModalAction } from "./modal-action";
import { useEmployeeModal } from "../_hooks/use-employee-modal";

import {
  TYPE_DATE_ACCESSOR,
  TYPE_DATE_TIME_ACCESSOR,
  TYPE_SELECT_ACCESSOR,
  TYPE_SELECT_CITY_ACCESSOR,
  TYPE_SELECT_DISTRICT_ACCESSOR,
  TYPE_SELECT_WARD_ACCESSOR,
  TYPE_TEXT_ACCESSOR,
  TYPE_TIME_ACCESSOR,
  fieldNotChange,
} from "@/shared/constants";

import { getEmails, getStaffCodes } from "../_services/employee-service";

export const EmployeeModal = ({ isOpen, onClose }) => {
  const mailRef = useRef(null);
  const staffCodeRef = useRef(null);

  const { data: fields, isFetching } = useFetch(
    "/employee/employee-modal/fields"
  );

  const emailValidation = async (email) => {
    try {
      let emails = mailRef.current;
      if (!mailRef.current) {
        const resp = await getEmails();
        if (resp.status === 200) {
          emails = resp.data;
          mailRef.current = resp.data;
        }
      }

      let isExisted = emails?.find((e) => e === email.trim()) ? true : false;
      return !isExisted;
    } catch (error) {
      console.error(`Error validation email: ${error}`);
      return true;
    }
  };

  const staffCodeValidation = async (code) => {
    try {
      let codes = staffCodeRef?.current;
      if (!staffCodeRef?.current) {
        let resp = await getStaffCodes();
        if (resp.status === 200) {
          codes = resp.data;
          staffCodeRef.current = resp.data;
        }
      }

      let isExisted = codes?.find((e) => e === code.trim()) ? true : false;
      return !isExisted;
    } catch (error) {
      console.error(`Error validation staff code: ${error}`);
      return true;
    }
  };

  let schema = {};
  fields?.forEach((field) => {
    if (field.required) {
      if (field.type === TYPE_TEXT_ACCESSOR) {
        if (field.accessor === fieldNotChange.EMAIL) {
          schema[field.accessor] = string()
            .required(`${field.name} is required`)
            .test("is-existed", `${field.name} already exists`, emailValidation)
            .test("is-savarti-email", "Email must be @savarti.com", (email) =>
              email?.trim()?.endsWith("@savarti.com")
            );
        } else if (field.accessor === fieldNotChange.STAFF_CODE) {
          schema[field.accessor] = string()
            .required(`${field.name} is required`)
            .test(
              "is-existed",
              `${field.name} already exists`,
              staffCodeValidation
            )
            .test(
              "is-id-start",
              `${field.name} must be start with 'SAV-'`,
              (id) => id?.trim()?.startsWith("SAV-")
            );
        } else {
          schema[field.accessor] = string().required(
            `${field.name} is required`
          );
        }
      } else if (field.type === TYPE_SELECT_ACCESSOR) {
        schema[field.accessor] = object().shape({
          value: string().required(`${field.name} is required`),
          label: string().required(`${field.name} is required`),
        });
      }
    }
  });

  const { onSubmit, isLoading } = useEmployeeModal();

  schema = object().shape(schema);
  const methods = useForm({
    resolver: yupResolver(schema),
  });

  const { handleSubmit, control, reset } = methods;

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Modal title="Add Employee" isOpen={isOpen} onClose={onClose}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full flex gap-2 p-5 max-w-[50rem] 2xl:max-w-[60rem]">
            {/* AVATAR */}
            <ModalImage control={control} />

            {/* Fields */}
            <div className="flex flex-wrap min-w-[32rem]">
              {!isFetching ? (
                fields?.map((field) => (
                  <div className="basis-1/3 p-2">
                    {field?.type === TYPE_TEXT_ACCESSOR ||
                    field?.type === TYPE_DATE_ACCESSOR ||
                    field?.type === TYPE_TIME_ACCESSOR ||
                    field?.type === TYPE_DATE_TIME_ACCESSOR ? (
                      <FormInput
                        key={field.id}
                        name={field.accessor}
                        label={field.name}
                        isRequired={field.required}
                      />
                    ) : null}

                    {field?.type === TYPE_SELECT_ACCESSOR && (
                      <FormSelect
                        key={field.id}
                        name={field.accessor}
                        options={field?.defaultValue}
                        label={field.name}
                        isRequired={field.required}
                      />
                    )}

                    {field?.type === TYPE_SELECT_CITY_ACCESSOR ||
                    field?.type === TYPE_SELECT_DISTRICT_ACCESSOR ||
                    field?.type === TYPE_SELECT_WARD_ACCESSOR
                      ? null
                      : null}
                  </div>
                ))
              ) : (
                <div className="w-full h-full">
                  <LoadingReload />
                </div>
              )}
            </div>
          </div>

          {/* Modal actions */}
          <ModalAction onCancel={handleCancel} />
        </form>
      </FormProvider>
      <Loading isOpen={isLoading} />
    </Modal>
  );
};
