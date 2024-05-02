import { useConfirm } from "@/lib/useConfirm";

import { Modal } from "./modal";
import { Button } from "./ui/button";

export const ConfirmDialog = () => {
  const { isAsking, message, options, deny, confirm } = useConfirm();

  return (
    <Modal isOpen={isAsking} onClose={deny} title="Are you sure ?">
      <div className="pb-3 px-5 w-[25rem]">
        {/* Content */}
        <div className="pb-5 pt-3 text-sm text-center text-secondary-600">
          {message}
        </div>

        {/* Footer */}
        <div className="flex justify-center items-center gap-2 ">
          <Button className="btn-secondary" onClick={deny}>
            cancel
          </Button>

          <Button
            className="px-10 btn-primary "
            isPadding={false}
            onClick={confirm}
          >
            Yes
          </Button>
        </div>
      </div>
    </Modal>
  );
};
