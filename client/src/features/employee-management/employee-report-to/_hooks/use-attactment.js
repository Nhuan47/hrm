import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useConfirm } from '@/lib/useConfirm';

import {
    addAttachment,
    getAttachments,
    deleteAttachment,
    downloadAttachment,
    updateAttachment,
    uploadAttachmentFile
} from '../_services/attachment-service';

export const useAttachment = id => {
    const [isFetching, setIsFetching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [attachmentEditing, setAttachmentEditing] = useState(null);

    const { ask } = useConfirm();

    useEffect(() => {
        const fetchAttachments = async () => {
            try {
                setIsFetching(true);
                const { data, message, status } = await getAttachments(id);

                if (status === 200) {
                    setAttachments(data);
                } else {
                    console.error(`HTTP Error! status: ${status} - ${message}`);
                }
            } catch (error) {
                throw new Error(error);
            } finally {
                setIsFetching(false);
            }
        };
        fetchAttachments();
    }, [id]);

    const onOpenModal = () => {
        setIsOpenModal(true);
    };

    const onCloseModal = () => {
        setIsOpenModal(false);
        setAttachmentEditing(null);
    };

    const onUpload = async files => {
        // Create an array of promises for each file upload
        const uploadPromises = Array.from(files).map(file => {
            const data = new FormData();
            data.append('file', file);

            // Return a promise that resolves when the file is uploaded
            return uploadAttachmentFile(data);
        });

        // Wait for all file uploads to complete
        const uploadResults = await Promise.all(uploadPromises);

        let attachmentInfo = [];
        for (let i = 0; i < uploadResults.length; i++) {
            let uploadresponse = uploadResults[i];
            if (uploadresponse.status === 201) {
                let uploadItemResult = uploadresponse.data;
                for (let item of files) {
                    if (item.name == uploadItemResult.name) {
                        attachmentInfo.push({
                            name: item.name,
                            size: `${(item.size / 1024).toFixed(2)} KB`,
                            type: item.type,
                            url: uploadItemResult.url
                        });
                    }
                }
            }
        }
        return attachmentInfo;
    };

    const onSubmit = async formData => {
        try {
            setIsLoading(true);

            // Upload current file to the server
            let attachFiles = formData.files;

            if (attachmentEditing) {
                let attachmentUploaded = [];

                if (attachFiles.length > 0) {
                    attachmentUploaded = await onUpload(attachFiles);
                }

                let formDataUpdate = {
                    employeeId: id,
                    description: formData.description,
                    files: attachmentUploaded,
                    employeeAttachmentId: attachmentEditing
                };

                let {
                    data: payload,
                    message,
                    status
                } = await updateAttachment(formDataUpdate);

                if (status === 201) {
                    let attachmentModified = attachments?.map(item => {
                        if (+item.id === +payload.id) {
                            return payload;
                        } else {
                            return item;
                        }
                    });
                    setAttachments(attachmentModified);
                    onCloseModal(false);
                    toast.success(`Save successfully`);
                } else {
                    console.error(`HTTP Error! status: ${status} - ${message}`);
                    toast.error(`Save failed`);
                    onCloseModal();
                }
            } else {
                let attachmentUploaded = [];

                let attachFiles = formData.files;

                if (attachFiles.length > 0) {
                    attachmentUploaded = await onUpload(attachFiles);
                }

                let formDataAddNew = {
                    employeeId: id,
                    description: formData.description,
                    files: attachmentUploaded
                };
                let {
                    data: payload,
                    message,
                    status
                } = await addAttachment(formDataAddNew);
                // Show notification
                if (status === 201) {
                    setAttachments([...attachments, ...payload]);
                    onCloseModal();
                    toast.success(`Save successfully`);
                } else {
                    console.error(`HTTP Error! status: ${status} - ${message}`);
                    toast.error(`Save failed`);
                    onCloseModal();
                }
            }
        } catch (error) {
            throw new Error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const onDelete = async id => {
        try {
            let isDelete = await ask(
                'You are about to delete data permanently. Are you sure you want to continue?'
            );

            if (isDelete) {
                setIsLoading(true);
                const {
                    data: payload,
                    message,
                    status
                } = await deleteAttachment(id);

                // Show notification
                if (status === 201) {
                    let attacthmentModified = attachments?.filter(
                        item => +item.id !== +payload.id
                    );
                    setAttachments(attacthmentModified);
                    toast.success(`Delete successfully`);
                } else {
                    console.error(`HTTP Error! status: ${status} - {message}`);
                    toast.error(`Delete failed`);
                }
            }
        } catch (error) {
            throw new Error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const onDownload = async ({ url, name }) => {
        try {
            setIsLoading(true);

            const fileId = url.split('/').slice(-1)[0];
            let response = await downloadAttachment({
                fileId,
                name
            });

            // Check the Content-Type of the response
            const contentType = response.headers['content-type'];

            if (
                contentType === 'application/octet-stream' ||
                contentType === 'application/pdf'
            ) {
                // Supported file types (you can customize this list)
                const blob = new Blob([response.data], { type: contentType });
                const url = window.URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', name);
                link.click();

                window.URL.revokeObjectURL(url);
            } else {
                // Display a message to the user that the file format is not supported
                toast.error('Sorry, this file format is not support.');
            }
        } catch (error) {
            throw new Error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const onEditing = id => {
        setIsOpenModal(true);
        setAttachmentEditing(id);
    };

    return {
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
        onDownload
    };
};
