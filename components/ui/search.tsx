"use client";

import { useState } from "react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function InputButtonGroup() {
  const router = useRouter();
  const searchParams = useSearchParams();


  const searchFromUrl = searchParams.get("search") || "";

  const [query, setQuery] = useState(searchFromUrl);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (query.trim()) {
      params.set("search", query.trim());
    } else {
      params.delete("search"); 
    }
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <Field className="w-full">
      <ButtonGroup className="w-full flex">
        <Input
          key={searchFromUrl}
          id="input-button-group"
          placeholder="Type to search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full min-w-0 bg-neutral-200"
        />
        <Button 
          type="button" 
          onClick={handleSearch} 
          variant="outline" 
          className="shrink-0"
        >
          Search
        </Button>
      </ButtonGroup>
    </Field>
  );
}