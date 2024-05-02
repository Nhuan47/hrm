import { RiLoaderLine } from "react-icons/ri";

export const LoadingLocal = ({ isOpen }) => {
  return (
    <>
      {isOpen ? (
        <div className="w-full h-full flex justify-center items-center">
          <span className="animate-ping text-primary-500">
            <RiLoaderLine size={33} />
          </span>
        </div>
      ) : null}
    </>
  );
};
