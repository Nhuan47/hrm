import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";

import { decodeToken } from "@/shared/utils";
import { usePermissions } from "@/shared/hooks/use-permission";
import { LoadingLocal } from "@/shared/components/loading-local";
import { featureKeys, typeKeys, permissionKeys } from "@/shared/permission-key";

import { Wrapper } from "../wrapper";
import { FormInputName } from "./form-input-name";
import { FormAction } from "./form-action";
import { FormInputNumberic } from "./form-input-numberic";
import { useSalaryFields } from "../../hooks/use-salary-field";
import { useSalaryActions } from "../../hooks/use-salary-actions";

const salaryNameItem = {
  accessor: "salaryName",
  name: "Salary Name",
};

export const SalaryForm = () => {
  const { isFetching } = useSalaryFields();
  const { isUpdateable, isCreateable } = usePermissions(
    featureKeys.EMPLOYEE_SALARY
  );

  const salaries = useSelector((state) => state.salary.salaries);

  if ((salaries?.length > 0 && isUpdateable) || isCreateable) {
    // State logic
    const [isEditable, setIsEditable] = useState(false);

    // Custom hooks
    // fetch salary fields
    const { onSubmit } = useSalaryActions({ onEditable: setIsEditable });

    // Redux stores
    const fields = useSelector((state) => state.salary.fields);
    const idEditing = useSelector((state) => state.salary.currentIdEditing);

    const methods = useForm();
    const {
      handleSubmit,
      setValue,
      reset,
      watch,
      formState: { errors, isSubmitSuccessful },
    } = methods;

    // Re-fill and reset form
    useEffect(() => {
      const updateForm = async () => {
        if (idEditing) {
          const itemEditing = salaries?.find((e) => e.id === idEditing);
          if (itemEditing !== undefined) {
            let items = { ...itemEditing };
            await reset(items, {
              keepDirty: false,
            });
          }
        } else {
          await reset({ salaryName: "" });
        }
        setIsEditable(false);
      };
      updateForm();
    }, [idEditing]);

    // Handle calculate total income
    useEffect(() => {
      const subscription = watch((value, { name, type }) => {
        if (name !== "total_income" && name !== salaryNameItem.accessor) {
          let total = Object.keys(value).reduce((acc, key) => {
            if (
              key !== "total_income" &&
              key !== salaryNameItem.accessor &&
              value[key] !== undefined
            ) {
              return acc + parseInt(value[key]);
            } else {
              return acc;
            }
          }, 0);

          setValue("total_income", total);
        }
      });
      return () => subscription.unsubscribe();
    }, [watch]);

    return (
      <Wrapper title="Salary">
        <LoadingLocal isOpen={isFetching} />

        {/* Render Form */}
        {!isFetching && (
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Salary name */}
              <FormInputName
                item={salaryNameItem}
                type={"month"}
                required
                disabled={idEditing && !isEditable}
                error={errors?.[salaryNameItem.accessor]?.message}
              />

              {/* salary items */}
              {fields?.map((field) => (
                <FormInputNumberic
                  key={field.accessor}
                  item={field}
                  required
                  disabled={
                    field.accessor === "total_income" ||
                    (idEditing && !isEditable)
                  }
                />
              ))}

              {/* Form actions */}
              <FormAction onEditable={setIsEditable} isEditable={isEditable} />
            </form>
          </FormProvider>
        )}
      </Wrapper>
    );
  }
};
