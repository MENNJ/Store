import React from "react";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search } from "lucide-react";

interface SearchInputProps {
  setSearchTerm: (term: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ setSearchTerm }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value); // Update the search term
  };

  return (
    <div className="space-y-2 w-4/5">
      <div className="relative">
        <Input
          id="input-26"
          className="peer pe-9 ps-9 rounded-xl"
          placeholder="搜索一下"
          type="search"
          onChange={handleInputChange}
        />
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
          <Search size={16} strokeWidth={2} />
        </div>
        <button
          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Submit search"
          type="submit"
        >
          <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default SearchInput;
