import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";

import { Modal } from "@/shared/components/modal";
import { ATTRIBUTE_TYPES, TYPE_SELECT_ACCESSOR } from "@/shared/constants";
import { FormSelect } from "@/shared/components/form/form-select";
import { FormSwitch } from "@/shared/components/form/form-switch";
import { FormInput } from "@/shared/components/form/form-input";

import { FormAction } from "@/shared/components/form/form-action";
import {
  activeAttributeModal,
  attributeEditingReceived,
  groupReceived,
} from "../../../_slices/attribute-slice";
import { useAttribute } from "../../../_hooks/manage-attributes/use-attribute";

export const AttributeModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.attribute.isOpenAttributeModal);
  const attributeEditing = useSelector(
    (state) => state.attribute.attributeEditing
  );
  const groups = useSelector((state) => state.attribute.groups);
  const groupSelected = useSelector((state) => state.attribute.groupSelected);

  const methods = useForm({ shouldUnregister: true });
  const { setValue, watch } = methods;
  const typeWatch = watch("type");
  const nameWatch = watch("name");

  const onClose = async () => {
    await dispatch(activeAttributeModal(false));
    await dispatch(attributeEditingReceived(null));
    await dispatch(groupReceived(null));
    methods.reset();
  };

  const { onSubmit } = useAttribute(onClose);

  useEffect(() => {
    let accessor = nameWatch
      ?.trim()
      ?.toLowerCase()
      ?.split(" ")
      ?.filter((i) => i)
      ?.join("_");
    setValue("accessor", accessor);
  }, [nameWatch]);

  useEffect(() => {
    setValue("group", groupSelected);
  }, [groupSelected]);

  useEffect(() => {
    if (attributeEditing) {
      setValue("id", attributeEditing.id);
      setValue("name", attributeEditing.name);
      setValue("accessor", attributeEditing.accessor);
      setValue("required", attributeEditing.required ? true : false);
      setValue("defaultValue", attributeEditing.defaultValue);

      let type = ATTRIBUTE_TYPES.find(
        (item) => item.value === attributeEditing?.type
      );
      setValue("type", type);

      let group = groups.find((group) => group.id === attributeEditing.groupId);
      if (group) {
        setValue("group", { label: group.name, value: group.id });
      }
    }
  }, [attributeEditing]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={attributeEditing ? "Update attribute" : "Add New Attribute"}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="space-y-3 text-secondary-500 text-sm px-4 pb-5 w-[25rem] max-h-[20rem] overflow-y-scroll">
            {/* Attribute id field */}
            {attributeEditing && <FormInput name="id" className="hidden" />}

            {/* group field */}
            <div className="">
              <FormSelect
                name="group"
                label="Select group"
                options={groups?.map((group) => ({
                  label: group.name,
                  value: group.id,
                }))}
              />
            </div>

            {/* Attribute name */}
            <div className="">
              <FormInput name="name" label="Name" isRequired />
            </div>

            {/* Attribute accessor */}
            <div className="">
              <FormInput name="accessor" label="Accessor" isRequired />
            </div>

            {/* Attribute type */}
            <div>
              <FormSelect
                name="type"
                label="Attribute type"
                options={ATTRIBUTE_TYPES}
              />
            </div>

            {/* Attribute select value  */}
            {typeWatch && typeWatch.value === TYPE_SELECT_ACCESSOR ? (
              <div>
                <FormInput
                  name="defaultValue"
                  label="Select Value"
                  isRequired
                />
              </div>
            ) : null}

            {/* Button switch  require field */}

            <div className="space-x-2">
              <FormSwitch name="required" label="Required value" />
            </div>
          </div>
          <FormAction onCancel={onClose} />
        </form>
      </FormProvider>
    </Modal>
  );
};
