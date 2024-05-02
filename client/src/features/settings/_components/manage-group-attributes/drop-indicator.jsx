export const DropIndicator = ({ beforeId, column }) => {
  return (
    <div
      data-before={beforeId || -1}
      data-group={column}
      className="my-0.5 h-0.5 w-full opacity-0"
    />
  );
};
