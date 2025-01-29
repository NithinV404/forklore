import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

export type Recipe = {
    idMeal: string;
    strMeal: string;
    strCategory: string;
    strArea: string;
    strInstructions: string;
    strMealThumb: string;
    strTags: string;
    strYoutube: string;
    strSource: string;
};

type RecipeContextType = {
    recipes: Recipe[];
    loading: boolean;
    error: string | null;
    fetchRecipes: () => void;
    deleteRecipe: (id: string) => Promise<string | undefined>;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export function RecipeProvider({ children }: { children: ReactNode }) {
    const serverUrl = import.meta.env.VITE_SERVER_URL;
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRecipes = async () => {
        try {
            const response = await axios.get(`${serverUrl}/`);
            setRecipes(response.data);
            setLoading(false);
        } catch (error) {
            setError(error instanceof Error ? error.message : "An error occurred");
            setLoading(false);
        }
        console.log(error);
    };

    const deleteRecipe = async (id: string) => {
        try {
            const response = await axios.delete(`${serverUrl}/delete/${id}`);
            if (response.status === 200) { fetchRecipes(); return "Recipe deleted successfully"; }
        } catch (error) {
            return error instanceof Error ? error.message : "An error occurred";
        }
    };

    useEffect(() => {
        fetchRecipes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <RecipeContext.Provider value={{ recipes, loading, error, fetchRecipes, deleteRecipe }}>
            {children}
        </RecipeContext.Provider>
    );
}

export function useRecipes() {
    const context = useContext(RecipeContext);
    if (!context) {
        throw new Error("useRecipes must be used within a RecipeProvider");
    }
    return context;
}