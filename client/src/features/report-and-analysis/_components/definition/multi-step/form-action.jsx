import { useSelector } from "react-redux";

import { Button } from "@/shared/components/ui/button";

export const FormAction = ({
  activeStep,
  onBack,
  onNext,
  onCancel,
  lastStep,
}) => {
  const isLoading  = useSelector((state) => state.definition.isLoading);

  const FIRST_STEP = 0;
  return (
    <div className="flex justify-between items-center mt-5">
      {/* Cancel button */}
      {activeStep === FIRST_STEP && (
        <Button onClick={onCancel} className="btn-primary">
          Cancel
        </Button>
      )}

      {/* On back button */}
      {activeStep > FIRST_STEP && (
        <Button onClick={onBack} className="btn-primary">
          Prev
        </Button>
      )}

      {/* Submit button */}
      {activeStep === lastStep && (
        <Button
          onClick={onNext}
          disabled={isLoading}
          className={`btn-primary ${isLoading ? "bg-primary-400" : ""}`}
        >
          Save
        </Button>
      )}

      {/* Onnext button */}
      {activeStep !== lastStep && (
        <Button onClick={onNext} className="btn-primary">
          Next
        </Button>
      )}
    </div>
  );
};
