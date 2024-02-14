import "../components/recipe_details.css";
import { Link, useParams } from "react-router-dom";
import icon_back from "../assets/icon-back.svg";
import { useEffect } from "react";

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

export default function RecipeDetails( { recipes }: { recipes: Recipe[] }) {
  var { id } = useParams();
  const recipe = recipes.find((recipe) => recipe.idMeal === id);
  const videoId = recipe?.strYoutube ? new URL(recipe.strYoutube).searchParams.get("v") : null;
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  useEffect(() => {
    window.scrollTo(0, 0);
  },[]);

  return (
    <>
      <header>
        <Link to="/">
          <img src={icon_back} alt="back" />
        </Link>
      </header>
      { recipe == null ? (<div className="loading">Loading. . .</div>) : (
        
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
