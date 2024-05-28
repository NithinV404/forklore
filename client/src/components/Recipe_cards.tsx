import "../components/recipe_cards.css";
import { Link } from "react-router-dom";
import icon_share from "../assets/icon-share.svg";
import icon_delete from "../assets/icon-delete.svg";
import axios from "axios";
import { useEffect, useState } from "react";

type Recipe = {
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

export default function RecipeCards(
  { searchInput, recipes, fetchRecipes }: { searchInput: String | null, recipes: Recipe[], fetchRecipes: () => void}
) {
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const [category, setCategory] = useState("All");
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(recipes);

  useEffect(() => {
    let filtered = [...recipes];
  
    if (category === "Alphabetical") {
      filtered.sort((a, b) => a.strMeal.localeCompare(b.strMeal));
    } else if (category !== "All") {
      filtered = filtered.filter(recipe => recipe.strCategory === category);
    } 
    if (searchInput !== "" && searchInput !== null) {
      filtered = filtered.filter(recipe => recipe.strMeal.toLowerCase().includes(searchInput.toLowerCase()));
    }
  
    setFilteredRecipes(filtered);
  }, [category, searchInput, recipes]);

  useEffect(() => {
    const categorySet = new Set<string>();
    recipes.forEach(recipe => categorySet.add(recipe.strCategory));
    setCategoryList(Array.from(categorySet));
  }, [recipes]);

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(`${serverUrl}/delete/${id}`);
      if (response.status === 200) { fetchRecipes(); }
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  return (
    <>
      <div className="filter-ribbon">
        <h4>Filter</h4>
        <select
          className="category-dropdown"
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Alphabetical">Alphabetical</option>
          { categoryList.map((category, index) => <option key={index} value={category}>{category}</option>) }
        </select>
      </div>
      <div className="recipe_cards">
        {filteredRecipes.length === 0 ? (
          <div className="empty-recipe">
            <h1>No recipes saved</h1>
            <br />
            <p>Add recipes using search</p>
          </div>
        ) : (
          filteredRecipes &&
          filteredRecipes.map((recipe, index) => (
            <div className="recipe_card" key={index}>
              <div className="recipe_card_header">
                <h1>{recipe.strMeal}</h1>
                <div className="recipe_card_details">
                  <p>ID: {recipe.idMeal}</p>
                  <p>Category: {recipe.strCategory}</p>
                  <p>Area: {recipe.strArea}</p>
                </div>
              </div>
              <img src={recipe.strMealThumb} alt={recipe.strMeal} />
              <div className="recipe_card_footer">
                <Link className="btn" to={`recipe_details/${recipe.idMeal}`}>
                  Read more
                </Link>
                <div className="share_btn">
                  <img className="ic-hover" src={icon_share} alt="share" />
                </div>
                <div
                  className="delete_btn"
                  onClick={() => handleDelete(recipe.idMeal)}
                >
                  <img className="ic-hover" src={icon_delete} alt="delete" />
                </div>
              </div>
            </div>
          ))
        )}
        <Link to="/add_recipe" className={`add_icon`}>
          +
        </Link>
      </div>
    </>
  );
}
