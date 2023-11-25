import data from "../recipe/recipes.json";
import "../components/recipe_details.css";
import { useParams } from "react-router-dom";

  export default function RecipeDetails(){
  var { id } = useParams();
  var recipe = data.filter(recipe=>recipe.id==Number(id))[0];
  return(
    <div className="recipe_details" key={recipe.id}>
    <div className="recipe_details_header">
    <div className="recipe_details_header_left">
    <h1>{recipe.title}</h1>
    <p>{recipe.context}</p>
    </div>
    <img src={recipe.image} alt={recipe.title} />
    </div>
    <h3>Description</h3>
    <p>{recipe.description}</p>
    <h3>Preparation Time</h3>
    <p>{recipe.cook_time}</p>
    <h3>Difficulty</h3>
    <p>{recipe.difficulty}</p>
    <h3>Ingredients</h3>
    <ul>
      {recipe.ingredients.map((ingredient,index)=><li key={index}>{ingredient.name} - {ingredient.quantity}</li>)}
    </ul>
    <h3>Steps</h3>
    <ol>
      {recipe.method.map((step,index)=><li key={index}>{step.step}</li>)}
    </ol>
    </div>
    );
  }
  
 