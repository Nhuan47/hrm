import { RiLoaderLine } from "react-icons/ri";

export const Loading = ({ isOpen }) => {
  return (
    <>
      {isOpen ? (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-20"></div>
          <RiLoaderLine
            className="animate-spin text-primary-600 rounded-full "
            size={40}
          />
        </div>
      ) : null}
    </>
  );
};
