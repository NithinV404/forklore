import data from "../recipe/recipes.json";
import "../components/recipe_cards.css";
import Header from "../components/header";
import { Link } from "react-router-dom";
import icon_share from "../assets/icon-share.svg";
import icon_delete from "../assets/icon-delete.svg";
export default function RecipeCards()
{
    return(<>
        <Header />
        <div className="recipe_cards">
        {data.map((recipe,index)=>
        <div className="recipe_card" key={index}>
        <div className="recipe_card_header">
        <h1>{recipe.title}</h1>
        <p>{recipe.context}</p>
        </div>
        <img src={recipe.image} alt={recipe.title} />
        <div className="recipe_card_footer">
        <Link className="btn" to={`recipe_details/${recipe.id}`}>Read more</Link>
        <div className="share_btn">
        <img src={ icon_share } alt="share"/> 
        </div>
        <div className="delete_btn">
        <img src={ icon_delete } alt="delete"/>
        </div>
        </div>
        </div>
        )}
        </div>
        </>
        );
}