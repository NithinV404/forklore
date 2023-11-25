import data from "../recipe/recipes.json";
import "../components/recipe_cards.css";
import Header from "../components/header";
import { Link} from "react-router-dom";
export default function RecipeCards()
{
    return(<>
        <Header />
        <div className="recipe_cards">
        {data.map(recipe=>
        <div className="recipe_card">
        <div className="recipe_card_header">
        <h1>{recipe.title}</h1>
        <p>{recipe.context}</p>
        </div>
        <img src={recipe.image} alt={recipe.title} />
        <div className="recipe_card_footer">
        <Link className="btn" to={`recipe_details/${recipe.id}`}>Read more</Link>
        </div>
        </div>
        )}
        </div>
        </>
        );
}