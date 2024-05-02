import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string, array } from "yup";

import { LoadingLocal } from "@/shared/components/loading-local";
import { Modal } from "@/shared/components/modal";

import { FormSelect } from "./form-select";
import { FormInput } from "./form-input";
import { FormAction } from "./form-action";
import { useModalForm } from "../../../_hooks/user-roles/use-modal-form";
import { useFetchUserRoleEditing } from "../../../_hooks/user-roles/use-fetch-user-role-editing";
import { FormStatus } from "./form-status";

export const UserRoleModal = ({ isOpen, id, onClose, roles }) => {
  const { isFetching, userRoleEditing } = useFetchUserRoleEditing(id);
  const { onSubmit } = useModalForm({ id, onClose });

  const methods = useForm({
    shouldUnregister: true,
  });

  return (
    <Modal title="User Role" isOpen={isOpen} onClose={onClose}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className=" flex items-stretch  p-3 gap-y-3 w-[30rem] 2xl:w-[40rem] flex-wrap text-secondary-500 text-sm">
            {isFetching ? (
              <div className="flex justify-center items-center  w-full h-40">
                <LoadingLocal isOpen={isFetching} />
              </div>
            ) : (
              <>
                <FormInput value={userRoleEditing?.name} />
                <FormSelect roles={roles} value={userRoleEditing?.roles} />
                <FormStatus value={userRoleEditing?.status} />
                <FormAction onCancel={onClose} />
              </>
            )}
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
