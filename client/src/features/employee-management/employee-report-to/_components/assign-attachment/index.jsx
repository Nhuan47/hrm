import { memo } from "react";
import { useParams } from "react-router-dom";

import { HiOutlineDownload } from "react-icons/hi";
import { FaTrash } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";

import { ButtonTooltip } from "@/shared/components/ui/button-tooltip";
import { featureKeys } from "@/shared/permission-key";
import { Loading } from "@/shared/components/loading-overlay";

import { useAttachment } from "../../_hooks/use-attactment";
import { ButtonAddAttachment } from "./btn-add-attactment";
import { AttachmentAction } from "./attachment-action";
import { AttachmentModal } from "./attachment-modal";
import { usePermissions } from "@/shared/hooks/use-permission";

const cols = [
  { id: 1, name: "File Name", accessor: "name" },
  { id: 2, name: "Description", accessor: "description" },
  { id: 3, name: "Size", accessor: "size" },
  { id: 4, name: "Type", accessor: "type" },
  { id: 5, name: "Date Added", accessor: "createdAt" },
  { id: 6, name: "Added By", accessor: "createdBy" },
];

export const AssignAttachment = memo(() => {
  const { isReadable, isUpdateable, isDeleteable, isCreateable } =
    usePermissions(featureKeys.EMPLOYEE_ATTACHMENT);

  if (isReadable) {
    // get employee id from url
    const { id } = useParams();

    const {
      isFetching,
      isLoading,
      isOpenModal,
      onOpenModal,
      onCloseModal,
      attachmentEditing,
      setAttachmentEditing,
      attachments,
      onSubmit,
      onEditing,
      onDelete,
      onDownload,
      onUpload,
    } = useAttachment(id);

    return (
      <div className="bg-white w-full p-5 py-8 rounded-3xl relative">
        {/* Start table */}
        <div className="w-full">
          {/* table Top Header */}
          <div className="flex justify-between border-b pb-5 text-sm text-secondary-500">
            <div className="basis-8/12">
              <p className="font-bold">Attachments</p>
            </div>
            <div className="basis-4/12 flex justify-end items-center gap-2">
              <p>{attachments.length} record(s)</p>

              {/* Button add attachment */}
              {isCreateable && <ButtonAddAttachment onClick={onOpenModal} />}
            </div>
          </div>

          <table className="w-full">
            <thead className="w-full capitalize text-sm font-nutito text-secondary-600">
              <tr className="border-b w-full ">
                <th className="py-2 text-left w-10">#</th>

                {/* Loop cols */}
                {cols?.map((col) => (
                  <th className={"py-2 pr-4 text-left"} key={col.id}>
                    <span className="">{col.name}</span>
                  </th>
                ))}

                {/* col acction */}
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {isFetching
                ? null
                : attachments?.map((row, index) => {
                    return (
                      <tr
                        className="border-b hover:bg-secondary-100 text-sm text-secondary-500 duration-300"
                        key={row?.id}
                      >
                        <td className="py-2.5 pr-4 text-left">{index + 1}</td>
                        <>
                          {cols.map((col) => (
                            <td
                              className="py-2.5 pr-4 text-left"
                              key={`${row.id}__${col.id}`}
                            >
                              {row[col.accessor]}
                            </td>
                          ))}

                          <td className=" w-20 ">
                            <div className="flex justify-center items-center gap-2">
                              {/*  download button */}
                              <ButtonTooltip
                                tooltip={{
                                  message: "Download",
                                  position: "left",
                                }}
                                onClick={() =>
                                  onDownload({
                                    url: row?.url,
                                    name: row?.name,
                                  })
                                }
                              >
                                <HiOutlineDownload size={18} />
                              </ButtonTooltip>

                              {/*  Edit button */}
                              <ButtonTooltip
                                tooltip={{
                                  message: "Edit",
                                  position: "top",
                                  className: "w-12",
                                }}
                                onClick={() => onEditing(row.id)}
                              >
                                <MdEdit size={16} />
                              </ButtonTooltip>

                              {/*  Delete button */}
                              <ButtonTooltip
                                tooltip={{
                                  message: "Delete",
                                  position: "right",
                                }}
                                onClick={() => onDelete(row.id)}
                              >
                                <FaTrash />
                              </ButtonTooltip>
                            </div>
                          </td>
                        </>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>

        {/* End table */}
        {isOpenModal && (
          <AttachmentModal
            isOpen={isOpenModal}
            onClose={onCloseModal}
            onSubmit={onSubmit}
            idEditing={attachmentEditing}
          />
        )}

        {/* End modals */}

        <Loading isOpen={isLoading} />
      </div>
    );
  } else {
    return null;
  }
});
