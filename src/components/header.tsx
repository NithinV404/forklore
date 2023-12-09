import { useState } from "react";
import axios from "axios";
import "./header.css";
import data from "../recipe/recipes.json";
import ic_plus from "../assets/icon-plus.svg"
export default function Header() {
  interface Meal {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
  }
  interface ResponseData {
    meals: Meal[];
  }

  const [recipeName, setRecipeName] = useState("");
  const [responseData, setResponseData] = useState<ResponseData | null>(null);

  const handleSearch = async () => {
    try {
      const response = await axios.post("http://localhost:5000/search", {
        recipeName,
      });
      setResponseData(response.data);
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleaddrecipe = (recipeId: String) => {
    const index = data.findIndex((recipe) => recipe.idMeal === recipeId);
    if (index != -1) {
      alert("Recipe already exists");
      return;
    } else {
      axios.post("http://localhost:5000/add", { recipeId });
    }
  };

  return (
    <div className="header">
      <div className="header-name">
        <h2>Recipe App</h2>
      </div>
      <div className="header-search" onBlur={() => setResponseData(null)}
      >
        <input
          type="text"
          placeholder="Search for recipes"
          value={recipeName}
          onChange={(e) => setRecipeName(e.target.value)}
          onKeyDown={handleSearch}
          onFocus={handleSearch}
        />
        {responseData && responseData.meals != null ? (
          <div className="search-items">
            {responseData.meals.map((meal: any) => (
              <div key={meal.idMeal} className="items">
                <div className="item-name"><p>{meal.strMeal}</p></div>
                <img src={meal.strMealThumb} />
                <img
                  className="add-icon ic-hover"
                  src={ic_plus}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleaddrecipe(meal.idMeal);
                  }}
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
