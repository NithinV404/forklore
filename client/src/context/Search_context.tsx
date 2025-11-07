import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";

export type SearchItemType = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

export type SearchContextType = {
  searchInput: string;
  searchReturn: SearchItemType[] | undefined;
  fetchSearch: (input: string) => void;
  idSearch: (id: string) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchReturn, setSearch] = useState<SearchItemType[]>([]);

  const fetchSearch = useCallback(
    async (input: string) => {
      try {
        const idRegex = /^[0-9]+$/;
        setSearchInput(input);
        let response;
        if (idRegex.test(input)) {
          response = await axios.post(`${serverUrl}/search`, {
            search_value: input,
            search_type: "id",
          });
        } else {
          response = await axios.post(`${serverUrl}/search`, {
            search_value: input,
            search_type: "name",
          });
        }

        // Assuming axios parses JSON automatically
        setSearch(response.data?.meals);
      } catch (err) {
        console.error(err);
      }
    },
    [serverUrl],
  );

  const idSearch = useCallback(
    async (id: string) => {
      try {
        const response = await axios.post(`${serverUrl}/search`, {
          search_value: id,
          search_type: "lookup",
        });
        const data = response.data;
        if (!data || !data.meals) {
          throw new Error("Recipe not found");
        }
        setSearch(data.meals);
      } catch (err) {
        console.error("Error fetching recipe:", err);
        setSearch([]);
      }
    },
    [serverUrl],
  );

  return (
    <SearchContext.Provider
      value={{ searchInput, searchReturn, fetchSearch, idSearch }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useRecipes must be used within a RecipeProvider");
  }
  return context;
}
