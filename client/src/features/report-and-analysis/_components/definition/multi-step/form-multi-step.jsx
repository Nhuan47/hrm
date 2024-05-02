import { FormProvider, useForm } from "react-hook-form";

import { FormBody } from "./form-body";

export const FormMultiStep = ({
  children,
  title,
  onNext,
  onBack,
  onSubmit,
  onCancel,
  ...props
}) => {
  const methods = useForm({
    defaultValues: {
      filters: {},
      display: {},
    },
  });

  const handleCancel = () => {
    onCancel();
    methods.reset();
  };

  return (
    <div {...props}>
      <FormProvider {...methods}>
        <FormBody
          onNext={onNext}
          onBack={onBack}
          onSubmit={onSubmit}
          onCancel={handleCancel}
        >
          {children}
        </FormBody>
      </FormProvider>
    </div>
  );
};
