import "../components/recipe_details.css";
import { useParams } from "react-router-dom";
import HeaderBack from "./header_back";
import { useEffect } from "react";
import icon_edit from "../assets/icon-edit.svg";
import icon_delete from "../assets/icon-delete.svg";
import axios from "axios";

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

export default function RecipeDetails({ recipes, fetchRecipes }: { recipes: Recipe[], fetchRecipes: () => void }) {
  var { id } = useParams();
  const recipe = recipes.find((recipe) => recipe.idMeal === id);
  const videoId = recipe?.strYoutube ? new URL(recipe.strYoutube).searchParams.get("v") : null;
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handeRecipeDelete = async (id: string) => {
    try {
      const response = await axios.delete(`${serverUrl}/delete/${id}`);
      if (response.status === 200) {
        fetchRecipes();
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  }

  return (
    <>
      <HeaderBack />
      {recipe == null ? (<div className="loading">Loading. . .</div>) : (
        <div className="recipe_details" key={recipe.idMeal}>
          <div className="recipe_details_header">
            <div className="recipe_details_header_left">
              <h1>{recipe.strMeal}</h1>
              <br />
              <p>
                <b>ID:</b> {recipe.idMeal}
              </p>
              <p>
                <b>Category:</b> {recipe.strCategory}
              </p>
              <p>
                <b>Area:</b> {recipe.strArea}
              </p>
              <p>
                <b>Tags:</b> {recipe.strTags}
              </p>
              <div className="modify_icons">
                <div
                  onClick={(event) => {
                    event.preventDefault();
                    window.location.href = `/edit_recipe/${id}`;
                  }}
                ><embed type="image/svg+xml" className="edit_icon" src={icon_edit} /></div>
                <div
                  onClick={(event) => {
                    event.preventDefault();
                    handeRecipeDelete(recipe.idMeal);
                  }}
                ><embed type="image/svg+xml" src={icon_delete} /></div>
              </div>
            </div>
            <img src={recipe.strMealThumb} alt={recipe.strCategory} />
          </div>
          <h3>Ingredients</h3>
          <ul>
            {Array.from({ length: 20 }, (_, i) => i + 1)
              .map((i) => ({
                ingredient: recipe[`strIngredient${i}` as keyof typeof recipe],
                measure: recipe[`strMeasure${i}` as keyof typeof recipe],
              }))
              .filter((item) => item.ingredient)
              .map((item, index) => (
                <li key={index}>
                  {item.ingredient} - {item.measure}
                </li>
              ))}
          </ul>
          <h3>Instructions</h3>
          <pre>{recipe.strInstructions}</pre>
          {!recipe.strSource ? (
            <>
              <h3>Source</h3>
              <a href={recipe.strSource}></a>
            </>
          ) : null}
          <h3>Video</h3>
          <embed
            width="560"
            height="315"
            src={embedUrl} >
          </embed>
        </div>)}
    </>
  );
}
