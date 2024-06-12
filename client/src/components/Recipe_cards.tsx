import "../components/recipe_cards.css";
import { Link, useNavigate } from "react-router-dom";
import icon_delete from "../assets/icon-delete.svg";
import axios from "axios";
import { useEffect, useState } from "react";

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

export default function RecipeCards(
  { searchInput, recipes, fetchRecipes }: { searchInput: String | null, recipes: Recipe[], fetchRecipes: () => void }
) {
  const navigate = useNavigate();
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const [category, setCategory] = useState("All");
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(recipes);


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
      sessionStorage.removeItem('scrollPosition'); // Clear the scroll position after using it
    }
  }, []);


  const handleDelete = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      const response = await axios.delete(`${serverUrl}/delete/${id}`);
      if (response.status === 200) { fetchRecipes(); }
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  return (
    <>
      <div className="filter-ribbon">
        <h4>Filter</h4>
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
                    tagIndex < 2 && <p className="tag" key={tagIndex}>{tag}</p>
                  ))}
                </div>
                <img src={recipe.strMealThumb} alt={recipe.strMeal} />
              </div>
              <div className="recipe_card_footer">
                <div className="recipe_card_details">
                  <h3>{recipe.strMeal}</h3>
                  <p>{recipe.idMeal}</p>
                  <div className="category_container"><p id='recipe_card_category'>{recipe.strCategory}</p></div>
                </div>
                <div className="icons_container">
                  <div><button
                    className="delete_btn"
                  >
                    <img className="ic-hover" src={icon_delete} alt="delete" onClick={(event) => handleDelete(recipe.idMeal, event)} />
                  </button></div>
                  <div><button
                    className="share_btn"
                  >
                  </button></div>
                </div>

              </div>
            </div>
          ))
        )}
        <Link
          to="/add_recipe" className={`add_icon`}>
          +
        </Link>
      </div>
    </>
  );
}
