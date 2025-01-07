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
  [key: string]: string | undefined; // To handle dynamic ingredient and measure properties
};

export default function RecipeDetails({ recipes, fetchRecipes }: { recipes: Recipe[], fetchRecipes: () => void }) {
  const { id } = useParams();
  const recipe = recipes.find((recipe) => recipe.idMeal === id);
  const videoId = recipe?.strYoutube ? new URL(recipe.strYoutube).searchParams.get("v") : null;
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleRecipeDelete = async (id: string) => {
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

  if (!recipe) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <HeaderBack />
      <div className="recipe_details" key={recipe.idMeal}>
        <div className="recipe_details_header">
          <div className="recipe_details_header_left">
            <h1>{recipe.strMeal}</h1>
            <div className="recipe_meta">
              <span className="pill_id"><b>ID:</b> {recipe.idMeal}</span>
              <span className="pill_category"><b>Category:</b> {recipe.strCategory}</span>
              <span className="pill_area"><b>Area:</b> {recipe.strArea}</span>
            </div>
            <div className="recipe_tags">
              <b>Tags:   </b> {recipe.strTags && recipe.strTags.split(',').map((tag, index) => (
                <span key={index} className="pill_tags">{`# ${tag}`}</span>
              ))}
            </div>
            <div className="modify_icons">
              <div onClick={(event) => { event.preventDefault(); window.location.href = `/edit_recipe/${id}`; }}>
                <embed type="image/svg+xml" className="edit_icon" src={icon_edit} />
              </div>
              <div onClick={(event) => { event.preventDefault(); handleRecipeDelete(recipe.idMeal); }}>
                <embed type="image/svg+xml" src={icon_delete} />
              </div>
            </div>
          </div>
          <img src={recipe.strMealThumb} alt={recipe.strCategory} />
        </div>
        <h3>Ingredients</h3>
        <div className="recipe_ingredients">
          {Array.from({ length: 20 }, (_, i) => i + 1)
            .map((i) => ({
              ingredient: recipe[`strIngredient${i}` as keyof typeof recipe],
              measure: recipe[`strMeasure${i}` as keyof typeof recipe],
            }))
            .filter((item) => item.ingredient)
            .map((item, index) => (
              <span key={index} className="pill_ingredient">
                <img src={`https://www.themealdb.com/images/ingredients/${item.ingredient}.png`} alt={item.ingredient} />
                {item.ingredient} - {item.measure}
              </span>
            ))}
        </div>
        <h3>Instructions</h3>
        <div className="recipe_instructions">
          <pre>{recipe.strInstructions}</pre>
        </div>
        {recipe.strSource && (
          <>
            <h3>Source</h3>
            <div className="recipe_source">
              <a href={recipe.strSource}>{recipe.strSource}</a>
            </div>
          </>
        )}
        <h3>Video</h3>
        <div className="recipe_video">
          <embed width="560" height="315" src={embedUrl} />
        </div>
      </div>
    </>
  );
}