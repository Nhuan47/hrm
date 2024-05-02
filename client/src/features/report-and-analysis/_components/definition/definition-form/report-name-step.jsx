import { memo, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useFormContext, Controller } from "react-hook-form";

import { FormInput } from "@/shared/components/form/form-input";
import { FormSelect } from "@/shared/components/form/form-select";

import { Wrapper } from "./wrapper";
import * as api from "../../../_services/definition-service";
import { getFolders } from "../../../_services/folder-service";

export const ReportNameStep = memo(({ title }) => {
  const folderFetched = useRef();
  const moduleFetched = useRef();

  const [folders, setFolders] = useState([]);

  const [modules, setModules] = useState([]);

  const folderId = useSelector((state) => state.definition.folderId);

  const reportName = useSelector((state) => state.definition.reportName);

  // Fetch folders
  useEffect(() => {
    if (!folderFetched.current) {
      folderFetched.current = true;

      const fetchFolders = async () => {
        const { data } = await getFolders();
        return data;
      };

      fetchFolders().then((folders) => {
        let customFolders = folders.map((folder) => ({
          label: folder.name,
          value: folder.id,
        }));
        setFolders(customFolders);
      });
    }
  }, []);

  //   fetch modules
  useEffect(() => {
    if (!moduleFetched.current) {
      moduleFetched.current = true;
      const fetchModules = async () => {
        const { data } = await api.getModules();
        return data;
      };
      fetchModules()
        .then((modules) => {
          setModules(modules);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  // State to manage name
  const {
    watch,
    control,
    setValue,
    formState: { errors, dirtyFields },
  } = useFormContext();

  // Trigger field reportName, folder with data from redux when update
  useEffect(() => {
    if (reportName && folderId) {
      if (reportName && !dirtyFields?.reportName === true) {
        setValue("reportName", reportName);
      }

      if (folderId && !dirtyFields?.folder === true) {
        const folder = folders.filter((folder) => folder.value === folderId);
        if (folder.length > 0) {
          setValue("folder", folder[0]);
        }
      }
    } else {
      setValue("reportName", "");
      setValue("folder", "");
    }
  }, [reportName, folderId, folders]);

  return (
    <Wrapper title={title}>
      <div className="flex flex-wrap w-full">
        {/* Report name field */}
        <div className="basis-1/2 py-3 px-2">
          <FormInput
            name="reportName"
            label="Name"
            placeholder="Enter report name"
            className="w-full"
            rules={{
              required: {
                value: true,
                message: `Report name is required`,
              },
              validate: {
                validateReportName: (value) => {
                  let moduleWithoutCurrentName = modules.filter(
                    (module) => module !== reportName
                  );
                  return (
                    !moduleWithoutCurrentName.includes(value.trim()) ||
                    "Already exists"
                  );
                },
              },
            }}
          />
        </div>

        {/* Report folder field */}
        <div className="basis-1/2 py-3 px-2">
          <FormSelect
            name="folder"
            label="Folder"
            options={folders}
            isRequired
            rules={{
              required: {
                value: true,
                message: `Folder is required`,
              },
            }}
          />
        </div>
      </div>
    </Wrapper>
  );
});
