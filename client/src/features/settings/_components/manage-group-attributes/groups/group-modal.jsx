import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";

import { Modal } from "@/shared/components/modal";
import { FormSwitch } from "@/shared/components/form/form-switch";
import { FormInput } from "@/shared/components/form/form-input";
import { FormTextarea } from "@/shared/components/form/form-textarea";
import { FormAction } from "@/shared/components/form/form-action";

import {
  activeGroupModal,
  groupEditingReceived,
  groupReceived,
} from "../../../_slices/attribute-slice";
import { useGroup } from "../../../_hooks/manage-attributes/use-group";

export const GroupModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.attribute.isOpenGroupModal);
  const groupEditing = useSelector((state) => state.attribute.groupEditing);

  const methods = useForm({ shouldUnregister: true });
  const { setValue, watch } = methods;

  const onClose = async () => {
    await dispatch(activeGroupModal(false));
    await dispatch(groupEditingReceived(null));
    await dispatch(groupReceived(null));
    methods.reset();
  };

  const { onSubmit } = useGroup(onClose);
  const nameWatch = watch("name");

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
    if (groupEditing) {
      setValue("id", groupEditing.id);
      setValue("name", groupEditing.name);
      setValue("accessor", groupEditing.accessor);
      setValue("description", groupEditing.description);
      setValue("required", groupEditing.required ? true : false);
      setValue("showOnDetail", groupEditing.showOnDetail ? true : false);
      setValue(
        "showOnReportAnalysis",
        groupEditing.showOnReportAnalysis ? true : false
      );
    }
  }, [groupEditing]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={groupEditing ? "Update Group" : "Add New Group"}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="space-y-3 text-secondary-500 text-sm px-4 pb-5 w-[25rem] h-[24rem] overflow-y-scroll">
            {/* Group ID */}
            <div className="">
              {groupEditing && <FormInput name="id" className="hidden" />}
            </div>

            {/* Group Name */}
            <div>
              <FormInput
                name="name"
                label="Group Name"
                placeholder="Enter group name"
                className=""
              />
            </div>

            {/* Group accessor */}
            <div>
              <FormInput
                name="accessor"
                label="Group Accessor"
                disabled
                className=""
              />
            </div>

            {/* Group description */}
            <div>
              <FormTextarea
                name="description"
                label="Description"
                className=""
              />
            </div>

            {/* Button  toggle show on personal detail page */}

            <div className="flex justify-between">
              <FormSwitch
                name="showOnDetail"
                label="Show on personal detail page:"
              />
            </div>

            {/* button toggle show on report analysis  */}
            <div className="flex justify-between">
              <FormSwitch
                name="showOnReportAnalysis"
                label="Show on report and analysis:"
              />
            </div>
          </div>
          <FormAction onCancel={onClose} />
        </form>
      </FormProvider>
    </Modal>
  );
};
