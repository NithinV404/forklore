import { Recipe, useRecipes } from "../context/Recipe_context";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../context/Toast_context";
import { useSearch } from "../context/Search_context";
import Edit from "../assets/SVG/Edit";
import Delete from "../assets/SVG/Delete";

interface RecipeDetailsPaneProps {
  id: string;
}

export default function RecipeDetailsPane({ id }: RecipeDetailsPaneProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { recipes, deleteRecipe, loading } = useRecipes();
  const { idSearch, searchReturn } = useSearch();
  let recipe = recipes.find((recipe) => recipe.idMeal === id);
  if (!recipe) {
    idSearch(id);
    recipe = searchReturn?.find((item): item is Recipe => item.idMeal === id);
  }

  const { showToast } = useToast();

  const videoId = recipe?.strYoutube
    ? new URL(recipe.strYoutube).searchParams.get("v")
    : null;
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  const handleRecipeDelete = async (id: string) => {
    deleteRecipe(id);
    showToast("Recipe deleted");
    navigate(location.state?.from || "/", {
      state: { from: location.pathname },
    });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!recipe) {
    return <div className="error">Recipe not found</div>;
  }

  return (
    <div className="recipe_details" key={recipe.idMeal}>
      <div className="recipe_details_header">
        <div className="recipe_details_header_left">
          <h1>{recipe.strMeal}</h1>
          <div className="recipe_meta">
            <span className="pill_id">
              <b>ID:</b> {recipe.idMeal}
            </span>
            <span className="pill_category">
              <b>Category:</b> {recipe.strCategory}
            </span>
            <span className="pill_area">
              <b>Area:</b> {recipe.strArea}
            </span>
          </div>
          <div className="recipe_tags">
            <b>Tags: </b>{" "}
            {recipe.strTags &&
              recipe.strTags
                .split(",")
                .map((tag, index) => (
                  <span key={index} className="pill_tags">{`# ${tag}`}</span>
                ))}
          </div>
          <div className="modify_icons">
            <div
              onClick={(event) => {
                event.preventDefault();
                navigate(`/edit_recipe/${id}`, {
                  state: {
                    from: location.pathname,
                    scrollPosition: scrollY,
                  },
                });
              }}
            >
              <Edit type="image/svg+xml" className="edit_icon" />
            </div>
            <div
              onClick={(event) => {
                event.preventDefault();
                handleRecipeDelete(recipe.idMeal);
              }}
            >
              <Delete type="image/svg+xml" />
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
              <img
                src={`https://www.themealdb.com/images/ingredients/${item.ingredient}-small.png`}
                alt={item.ingredient}
              />
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
  );
}
