import data from "../recipe/recipes.json";
import "../components/recipe_cards.css";
import { Link } from "react-router-dom";
import icon_share from "../assets/icon-share.svg"
import icon_delete from "../assets/icon-delete.svg";
import axios from "axios";
import {  useContext, useState } from "react";
import Header from "./Header";
import { RecipeNameContext } from "./Header";


export default function RecipeCards() {

  const serverUrl = import.meta.env.VITE_SERVER_URL;

  const handleDelete = async (recipeId: String) => {
    await axios.post(`${serverUrl}/delete`, { recipeId });
  };

  const categories = [...new Set(data.map((recipe) => recipe.strCategory))];

  const [category, setCatergory] = useState<String>("All");
  const [isActive, setIsActive] = useState(false);
  
 
  const searchTerm = useContext(RecipeNameContext).toLowerCase();
  let recipe = data.filter((recipe) => recipe.strMeal.toLowerCase().includes(searchTerm));

  if (category === "All") recipe = data;
  else if (category === "Alphabetical")
    recipe = data.sort((a, b) => a.strMeal.localeCompare(b.strMeal));
  else
    recipe = data.filter((recipe) => recipe.strCategory == category);

  return (
    <>
      <Header />
      <div className="filter-ribbon">
        <h4>Filter</h4>
        <select
          className="category-dropdown"
          onChange={(e) => setCatergory(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Alphabetical">Alphabetical</option>
          {categories.map((value, index) => (
            <option key={index} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
      <div className="recipe_cards">
        {recipe.length === 0 ? (
          <div className="empty-recipe"><h1>No recipes saved</h1><br/><p>Add recipes using search</p></div>
        ) : (
          recipe.map((recipe, index) => (
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
      <div className={`add_icon ${isActive ? 'active' : ''}`} onClick={()=>{setIsActive(!isActive)}}>+</div>
      </div>
    </>
  );
}
