import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

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
    const [searchInput, setSearchInput] = useState<string>('');
    const [searchReturn, setSearch] = useState<SearchItemType[]>();

    const fetchSearch = async (input: string) => {
        try {
            setSearchInput(input);
            const response = await axios.post(`${serverUrl}/search`, {
                search_value: input,
                search_type: 'name'
            });
            setSearch(JSON.parse(response.data).meals);
        } catch (err) {
            console.log(err);
        }
    };

    const idSearch = async (id: string) => {
        try {
            const response = await axios.post(`${serverUrl}/search`, {
                search_value: id,
                search_type: 'lookup'
            });

            const data = response.data;
            if (!data || !data.meals) {
                throw new Error('Recipe not found');
            }

            setSearch(data.meals);
        } catch (err) {
            console.error('Error fetching recipe:', err);
            setSearch([]);
        }
    }

    return (
        <SearchContext.Provider value={{ searchInput, searchReturn, fetchSearch, idSearch }}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch() {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
}