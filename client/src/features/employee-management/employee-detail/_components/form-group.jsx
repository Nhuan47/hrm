import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";

import {
  TYPE_TEXT_ACCESSOR,
  TYPE_DATE_ACCESSOR,
  TYPE_DATE_TIME_ACCESSOR,
  TYPE_SELECT_ACCESSOR,
  TYPE_SELECT_CITY_ACCESSOR,
  TYPE_SELECT_DISTRICT_ACCESSOR,
  TYPE_SELECT_WARD_ACCESSOR,
  TYPE_TIME_ACCESSOR,
} from "@/shared/constants";

import { FormInput } from "./form-input";
import { FormSelect } from "./form-select";
import { FormAction } from "./form-action";
import { useFormAction } from "../hooks/use-employee-form-action";
import { useProvince } from "../hooks/use-province";

export const FormGroup = ({ fields, item, canEdit, cache }) => {
  let fieldOrders = [...fields];
  fieldOrders = fieldOrders.sort(
    (a, b) => parseInt(a.order) - parseInt(b.order)
  );

  let cityName, districtName;
  if (fields) {
    // handle district options when load data of current user
    const cityField = fields?.find((f) => f.type === TYPE_SELECT_CITY_ACCESSOR);
    cityName = item?.[cityField?.accessor];

    // handle ward options when load data of current user
    const districtField = fields?.find(
      (f) => f.type === TYPE_SELECT_DISTRICT_ACCESSOR
    );
    // Get current city in item
    districtName = item?.[districtField?.accessor];
  }

  const {
    isLoading: isFetching,
    cities,
    districts,
    wards,
    onCityChange,
    onDistrictChange,
  } = useProvince({ cacheRef: cache, props: { cityName, districtName } });

  const { onSubmit, isEditable, isLoading, onEditable } = useFormAction();

  const defaultValues = {};
  fields?.forEach((field) => {
    let accessor = field.accessor;

    if (
      field?.type === TYPE_SELECT_ACCESSOR ||
      field?.type === TYPE_SELECT_CITY_ACCESSOR ||
      field?.type === TYPE_SELECT_DISTRICT_ACCESSOR ||
      field?.type === TYPE_SELECT_WARD_ACCESSOR
    ) {
      defaultValues[accessor] = {
        value: item?.[accessor],
        label: item?.[accessor],
      };
    }

    if (
      field.type === TYPE_TEXT_ACCESSOR ||
      field.type === TYPE_DATE_ACCESSOR ||
      field.type === TYPE_DATE_TIME_ACCESSOR ||
      field.type === TYPE_TIME_ACCESSOR
    ) {
      defaultValues[accessor] = item?.[accessor];
    }
  });

  const methods = useForm({ defaultValues });
  const { handleSubmit, setValue } = methods;

  const handleCityChange = (e) => {
    onCityChange(e.value);

    // reset district and ward field
    let fieldsReset = fields.filter(
      (field) =>
        field.type === TYPE_SELECT_DISTRICT_ACCESSOR ||
        field.type === TYPE_SELECT_WARD_ACCESSOR
    );

    fieldsReset?.forEach((f) => {
      setValue(f.accessor, null);
    });
  };

  const handleDistrictChange = (e) => {
    onDistrictChange(e.value);

    // reset district and ward field
    let fieldsReset = fields.filter(
      (field) => field.type === TYPE_SELECT_WARD_ACCESSOR
    );

    fieldsReset?.forEach((f) => {
      setValue(f.accessor, null);
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap mt-2">
          {fieldOrders?.map((field) => (
            <div key={field.accessor} className="basis-1/3 p-3">
              {/* Type text, time, date, date-time */}
              {field.type === TYPE_TEXT_ACCESSOR ||
              field.type === TYPE_DATE_ACCESSOR ||
              field.type === TYPE_DATE_TIME_ACCESSOR ||
              field.type === TYPE_TIME_ACCESSOR ? (
                <FormInput
                  label={field.name}
                  name={field.accessor}
                  disabled={!isEditable}
                  required={field.required === 1}
                />
              ) : null}

              {/* Type Select */}
              {field.type === TYPE_SELECT_ACCESSOR && (
                <FormSelect
                  label={field.name}
                  name={field.accessor}
                  options={field.defaultValue}
                  isDisabled={!isEditable}
                  required={field.required === 1}
                  onChange={() => {}}
                />
              )}

              {/* Handle type is select city */}
              {field.type === TYPE_SELECT_CITY_ACCESSOR && (
                <FormSelect
                  label={field.name}
                  name={field.accessor}
                  options={cities}
                  isDisabled={!isEditable}
                  required={field.required === 1}
                  onChange={handleCityChange}
                  placeholder={"-- Select city --"}
                />
              )}

              {/* Handle type is select city */}
              {field.type === TYPE_SELECT_DISTRICT_ACCESSOR && (
                <FormSelect
                  label={field.name}
                  name={field.accessor}
                  options={districts}
                  isDisabled={!isEditable}
                  required={field.required === 1}
                  onChange={handleDistrictChange}
                  placeholder={"-- Select district --"}
                />
              )}

              {/* Handle type is select ward */}
              {field.type === TYPE_SELECT_DISTRICT_ACCESSOR && (
                <FormSelect
                  label={field.name}
                  name={field.accessor}
                  options={wards}
                  isDisabled={!isEditable}
                  required={field.required === 1}
                  placeholder={"-- Select ward --"}
                  onChange={() => {}}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form actions */}
        {canEdit ? (
          <FormAction
            isEditable={isEditable}
            onEditable={onEditable}
            isDisabled={isLoading}
          />
        ) : null}
      </form>
    </FormProvider>
  );
};
