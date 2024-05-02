import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import _ from "lodash";

import { FormAction } from "./form-action";
import { useFormProgress } from "../../../_hooks/use-form-progress";

export const FormBody = ({ children, onNext, onBack, onSubmit, onCancel }) => {
  const {
    trigger,
    watch,
    formState: { errors },
    clearErrors,
  } = useFormContext();
  const { currentStep, goForward, goBack } = useFormProgress();

  const lastStep = React.Children.count(children) - 1;
  const steps = React.Children.toArray(children);

  const formData = watch();

  const [form, setForm] = useState({});

  const handleSubmit = (data) => {
    if (_.isEmpty(errors)) {
      onSubmit(data);
    }
  };

  const updateCurrentForm = () =>
    setForm((state) => ({ ...state, ...formData }));

  const handleNext = async () => {
    const status = await trigger();

    if (!status) return;

    updateCurrentForm();

    if (currentStep === lastStep) {
      handleSubmit({ ...form, ...formData });
      return;
    }

    goForward();
    clearErrors();
    onNext(formData);
  };

  const handleBack = () => {
    updateCurrentForm();

    goBack();
    onBack(formData);
  };

  return (
    <>
      <form>{steps[currentStep]}</form>
      <FormAction
        lastStep={lastStep}
        activeStep={currentStep}
        onBack={handleBack}
        onNext={handleNext}
        onCancel={onCancel}
      />
    </>
  );
};
