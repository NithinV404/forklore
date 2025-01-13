import "../pages/Recipe_menu.css";
import icon_delete from "../assets/icon-delete.svg";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Recipe, useRecipes } from "../context/Recipe_context";


export default function RecipeCards(
  { searchInput }: { searchInput: string | null }
) {
  const { recipes, deleteRecipe } = useRecipes();
  const [category, setCategory] = useState("All");
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(recipes);
  const navigate = useNavigate();


  useEffect(() => {
    let filtered = [...recipes];

    if (category === "Alphabetical") {
      filtered.sort((a, b) => a.strMeal.localeCompare(b.strMeal));
    } else if (category !== "All") {
      filtered = filtered.filter(recipe => recipe.strCategory === category);
    }
    if (searchInput !== "" && searchInput !== null) {
      filtered = filtered.filter(recipe => recipe.strMeal.toLowerCase().includes(searchInput.toLowerCase()));
    }

    setFilteredRecipes(filtered);
  }, [category, searchInput, recipes]);


  useEffect(() => {
    const categorySet = new Set<string>();
    recipes.forEach(recipe => categorySet.add(recipe.strCategory));
    setCategoryList(Array.from(categorySet));
  }, [recipes]);

  const recipeDetailsRedirect = (id: string) => {
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    navigate(`/recipe_details/${id}`, {
      state: {
        from: '/',
      }
    });
  }

  useEffect(() => {
    const scrollPos = sessionStorage.getItem('scrollPosition');
    if (scrollPos) {
      window.scrollTo(0, parseInt(scrollPos));
      sessionStorage.removeItem('scrollPosition');
    }
  }, []);

  return (
    <>
      <div className="filter-ribbon">
        <p>Filter</p>
        <select
          className="category-dropdown"
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Alphabetical">Alphabetical</option>
          {categoryList.map((category, index) => <option key={index} value={category}>{category}</option>)}
        </select>
      </div>
      <div className="recipe_cards">
        {filteredRecipes.length === 0 ? (
          <div className="empty-recipe">
            <h1>No recipes saved</h1>
            <br />
            <p>Add recipes using search or +</p>
          </div>
        ) : (
          filteredRecipes &&
          filteredRecipes.map((recipe, index) => (
            <div className="recipe_card" key={index} onClick={() => recipeDetailsRedirect(recipe.idMeal)}>
              <div className="recipe_card_header">
                <div className="tag-container">
                  {recipe.strTags && recipe.strTags.split(',').map((tag, tagIndex) => (
                    tagIndex < 2 && <p className="tag" key={tagIndex}># {tag}</p>
                  ))}
                </div>
                <img src={recipe.strMealThumb} alt={recipe.strMeal} />
              </div>
              <div className="recipe_card_footer">
                <div className="recipe_card_details">
                  <h3>{recipe.strMeal}</h3>
                  <div className="category_divider">
                    <div className="category_container">
                      <b>Category</b>
                      <p id='recipe_card_category'>{recipe.strCategory}</p>
                    </div>
                    <div className="icons_container">
                      <div><button
                        className="delete_btn"
                        onClick={(event) => { deleteRecipe(recipe.idMeal); event.stopPropagation(); }}
                      >
                        <img className="ic-hover" src={icon_delete} alt="delete" />
                      </button></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

      </div>
    </>
  );
}
