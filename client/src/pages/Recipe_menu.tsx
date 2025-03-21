import "../pages/Recipe_menu.css";
import { icons } from "../assets/icon";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Recipe, useRecipes } from "../context/Recipe_context";
import { useToast } from "../context/Toast_context";
import { useSearch } from "../context/Search_context";

export default function RecipeCards() {
  const { recipes, deleteRecipe } = useRecipes();
  const { searchInput } = useSearch();
  const { showToast } = useToast();
  const [category, setCategory] = useState("All");
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(recipes);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const idRegex = /^[0-9]+$/;
    let filtered = [...recipes];

    if (category === "Alphabetical") {
      filtered.sort((a, b) => a.strMeal.localeCompare(b.strMeal));
    } else if (category !== "All") {
      filtered = filtered.filter((recipe) => recipe.strCategory === category);
    }
    if (searchInput !== "" && searchInput !== null) {
      if (idRegex.test(searchInput)) {
        filtered = filtered.filter((recipe) => recipe.idMeal === searchInput);
      } else {
        filtered = filtered.filter((recipe) =>
          recipe.strMeal.toLowerCase().includes(searchInput.toLowerCase()),
        );
      }
    }
    console.log(idRegex.test(searchInput));
    setFilteredRecipes(filtered);
  }, [category, searchInput, recipes]);

  useEffect(() => {
    const categorySet = new Set<string>();
    recipes.forEach((recipe) => categorySet.add(recipe.strCategory));
    setCategoryList(Array.from(categorySet));
  }, [recipes]);

  const recipeDetailsRedirect = (id: string) => {
    navigate(`/recipe_details/${id}`, {
      state: {
        from: location.pathname,
        scrollPosition: scrollY,
      },
    });
  };

  useEffect(() => {
    window.scrollTo(0, location.state?.scrollPosition || 0);
  }, [location.state?.scrollPosition]);

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
          {categoryList.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
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
            <div
              className="recipe_card"
              key={index}
              onClick={() => recipeDetailsRedirect(recipe.idMeal)}
            >
              <div className="recipe_card_header">
                <div className="tag-container">
                  {recipe.strTags &&
                    recipe.strTags.split(",").map(
                      (tag, tagIndex) =>
                        tagIndex < 2 && (
                          <p className="tag" key={tagIndex}>
                            # {tag}
                          </p>
                        ),
                    )}
                </div>
                <img src={recipe.strMealThumb} alt={recipe.strMeal} />
              </div>
              <div className="recipe_card_footer">
                <div className="recipe_card_details">
                  <h3>{recipe.strMeal}</h3>
                  <div className="category_divider">
                    <div className="category_container">
                      <b>Category</b>
                      <p id="recipe_card_category">{recipe.strCategory}</p>
                    </div>
                    <div className="icons_container">
                      <div>
                        <button
                          className="delete_btn"
                          onClick={(event) => {
                            deleteRecipe(recipe.idMeal);
                            showToast("Recipe deleted");
                            event.stopPropagation();
                          }}
                        >
                          <img
                            className="ic-hover"
                            src={icons.delete}
                            alt="delete"
                          />
                        </button>
                      </div>
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
