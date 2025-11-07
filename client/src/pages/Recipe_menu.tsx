import recipe_menu_style from "../pages/Recipe_menu.module.css";
import Delete from "../assets/SVG/Delete";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Recipe, useRecipes } from "../context/Recipe_context";
import { useToast } from "../context/Toast_context";
import { useSearch } from "../context/Search_context";

export default function RecipeCards() {
  const { recipes, deleteRecipe } = useRecipes();
  const { searchInput } = useSearch();
  const { showToast } = useToast();
  const [categorySelected, setCategorySelected] = useState(["All"]);
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(recipes);
  const navigate = useNavigate();
  const location = useLocation();

  useMemo(() => {
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
    let filtered = [...recipes];

    if (!(categorySelected.length === 1 && categorySelected[0] === "All")) {
      filtered = filtered.filter((recipe) =>
        categorySelected.includes(recipe.strCategory),
      );
    }

    if (searchInput && searchInput.trim() !== "") {
      filtered = filtered.filter((recipe) =>
        recipe.strMeal.toLowerCase().includes(searchInput.toLowerCase()),
      );
    }

    setFilteredRecipes(filtered);
  }, [recipes, categorySelected, searchInput]);

  useEffect(() => {
    if (location.state?.from === location.pathname) {
      setTimeout(() => {
        window.scrollTo(0, location.state?.scrollPosition);
      }, 0);
    } else window.scrollTo(0, 0);
  }, [location.state?.scrollPosition, location.pathname, location.state?.from]);

  const categoryAddClickHandler = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const buttonText = e.currentTarget.textContent;
      if (buttonText) {
        setCategorySelected((prev) =>
          prev.includes(buttonText)
            ? prev.filter((category) => category !== buttonText)
            : [...prev, buttonText],
        );
      }
    },
    [],
  );

  return (
    <>
      <div className={recipe_menu_style.filter_ribbon}>
        {useMemo(
          () => (
            <>
              <button
                value="All"
                className={`${recipe_menu_style.filter_ribbon_button} ${
                  categorySelected.includes("All")
                    ? recipe_menu_style.active
                    : ""
                }`}
              >
                All
              </button>
              {categoryList.map((category) => (
                <button
                  key={category}
                  className={`${recipe_menu_style.filter_ribbon_button} ${
                    categorySelected.includes(category)
                      ? recipe_menu_style.active
                      : ""
                  }`}
                  value={category}
                  onClick={(e) => {
                    categoryAddClickHandler(e);
                  }}
                >
                  {category}
                </button>
              ))}
            </>
          ),
          [categoryList, categorySelected, categoryAddClickHandler],
        )}
      </div>
      <div className={recipe_menu_style.recipe_menu}>
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
              className={recipe_menu_style.recipe_card}
              key={index}
              onClick={() => recipeDetailsRedirect(recipe.idMeal)}
            >
              <Delete
                className="ic-hover"
                onClick={(event) => {
                  deleteRecipe(recipe.idMeal);
                  showToast("Recipe deleted");
                  event.stopPropagation();
                }}
              />
              <div className={recipe_menu_style.image_container}>
                <img src={`${recipe.strMealThumb}`} />
              </div>
              <p id="recipe_card_category">{recipe.strCategory}</p>
              <h2>{recipe.strMeal}</h2>
            </div>
          ))
        )}
      </div>
    </>
  );
}
