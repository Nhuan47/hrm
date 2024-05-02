import React, { useState, useEffect } from "react";

import { BsSearch } from "react-icons/bs";

import { Input } from "@/shared/components/ui/input";
import { useDebounced } from "@/shared/hooks/use-debounced";

export const Search = ({ onSearch }) => {
  const [searchQuery, setSeachQuery] = useState("");

  const debouncedSearchQuery = useDebounced(searchQuery, 500);

  const handleInputChange = (e) => {
    setSeachQuery(e.target.value);
  };

  const performSearh = (query) => {
    onSearch(query);
  };

  // Execute the search oparation when debounced search quey change
  useEffect(() => {
    performSearh(debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  return (
    <div className="w-72 flex justify-between items-center border border-slate-300 rounded-3xl overflow-hidden p-1 ">
      <Input
        className="border-none px-2 rounded-xl outline-none text-sm text-secondary placeholder:text-sm text-secondary-500"
        placeholder="Search"
        onChange={handleInputChange}
      />

      <div className="bg-secondary-200 rounded-full cursor-pointer flex justify-center items-center w-8 h-8">
        <BsSearch size={12} />
      </div>
    </div>
  );
};
