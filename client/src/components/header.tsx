import { createContext, useState } from "react";
import axios from "axios";
import header_style from "./header.module.css";
import ic_plus from '../assets/icon-plus.svg';
import { Link } from "react-router-dom";



export const RecipeNameContext = createContext("");

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}
interface ResponseData {
  meals: Meal[];
}

export default function Header({
  setSearchInput,
  recipes,
  fetchRecipes
}: {
  setSearchInput: (input: string) => void;
  recipes: Meal[];
  fetchRecipes: () => void;
}) {

  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const [recipeName, setRecipeName] = useState("");
  const [responseData, setResponseData] = useState<ResponseData | null>(null);


  const handleSearch = async () => {
    try {
      const response = await axios.post(`${serverUrl}/search`, {
        recipeName,
      });
      setResponseData(JSON.parse(response.data));
    } catch (err) {
      console.log(err);
    }
  };

  const handleaddrecipe = async (recipeId: string) => {
    const index = recipes.findIndex((recipe) => recipe.idMeal === recipeId);
    if (index != -1) {
      alert("Recipe already exists");
      return;
    } else {
      const response = await axios.post(`${serverUrl}/add`, { recipeId });
      if (response.status === 200) { fetchRecipes(); }
    }
  };

  return (
    <>
      <div className={header_style.header}>
        <div className={header_style.header_name}>
          <p>ForkLore</p>
        </div>

        <div onBlur={() => setResponseData(null)}>
          <input
            className={header_style.header_input}
            type="text"
            placeholder="Search for recipes"
            onChange={(e) => { setRecipeName(e.currentTarget.value); setSearchInput(e.currentTarget.value); }}
            onKeyDown={handleSearch}
            onFocus={handleSearch}
          />
          <RecipeNameContext.Provider value={recipeName} />
          {responseData && responseData.meals != null ? (
            <div className={header_style.search_items}>
              {responseData.meals.map((meal: Meal) => (
                <div key={meal.idMeal} className={header_style.items}>
                  <div className={header_style.item_name}>
                    <p>{meal.strMeal}</p>
                  </div>
                  <img src={meal.strMealThumb} />
                  <div className={`${header_style.add_icon}  ${header_style.ic_hover}`}>
                    <img
                      src={ic_plus}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleaddrecipe(meal.idMeal);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <Link to="/add_recipe" className={header_style.add_button}>
          <img src={ic_plus} alt="" />
        </Link>
      </div>
    </>
  );
}
