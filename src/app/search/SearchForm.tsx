"use client";

import { Input, InputGroup, InputLeftElement, Icon } from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchForm() {
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch}>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Icon as={FiSearch} color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder="Search products, orders, customers, or anything..."
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          size="lg"
          bg="glass.backdrop"
          border="1px solid"
          borderColor="glass.border"
          borderRadius="lg"
          _hover={{
            borderColor: "glass.borderDark",
            bg: "glass.primary",
          }}
          _focus={{
            borderColor: "brand.500",
            bg: "white",
            boxShadow: "0 0 0 3px rgba(14, 165, 233, 0.1)",
          }}
        />
      </InputGroup>
    </form>
  );
}
