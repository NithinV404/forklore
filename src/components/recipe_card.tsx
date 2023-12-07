import data from "../recipe/recipes.json";
import "../components/recipe_cards.css";
import Header from "../components/header";
import { Link } from "react-router-dom";
import icon_share from "../assets/icon-share.svg";
import icon_delete from "../assets/icon-delete.svg";
import axios from "axios";
export default function RecipeCards()
{
 

    const handleDelete = async (recipeId: String) => {
        await axios.post('http://localhost:5000/delete', {recipeId});
    }
    return(<>
        <Header />
        <div className="recipe_cards">
        {data.map((recipe,index)=>
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
        <Link className="btn" to={`recipe_details/${recipe.idMeal}`}>Read more</Link>
        <div className="share_btn">
        <img className="ic-hover" src={ icon_share } alt="share"/> 
        </div>
        <div className="delete_btn" onClick={()=> handleDelete(recipe.idMeal)}>
        <img className="ic-hover" src={ icon_delete } alt="delete"/>
        </div>
        </div>
        </div>
        )}
        </div>
        </>
        );
}