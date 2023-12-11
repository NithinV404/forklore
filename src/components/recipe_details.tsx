import data from "../recipe/recipes.json";
import "../components/recipe_details.css";
import { Link, useParams } from "react-router-dom";
import icon_back from "../assets/icon-back.svg";
import { useEffect } from "react";

export default function RecipeDetails() {
  var { id } = useParams();
  var recipe = data.filter((recipe) => recipe.idMeal == id)[0];
  const videoId = new URL(recipe.strYoutube).searchParams.get("v");
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
      </div>
    </>
  );
}
