import { useState, useRef, useEffect } from "react";
import axios from "axios";
import header_style from "./Header.module.css";
import ic_plus from '../assets/icon-plus.svg';
import { Link } from "react-router-dom";
import { useRecipes } from "../context/Recipe_context";
import { useToast } from "../context/Toast_context";
import { SearchItemType, useSearch } from "../context/Search_context";


const Header = () => {

  const { recipes, fetchRecipes } = useRecipes();
  const { searchReturn, fetchSearch } = useSearch();
  const { showToast } = useToast();
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const [showDropdown, setShowDropdown] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleaddrecipe = async (recipeId: string) => {
    const index = recipes.findIndex((recipe) => recipe.idMeal === recipeId);
    if (index != -1) {
      showToast("Recipe already exists");
      return;
    } else {
      const response = await axios.post(`${serverUrl}/add`, { recipeId });
      if (response.status === 200) { fetchRecipes(); }
    }
  };

  const handleSearch = (value: string) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      fetchSearch(value);
    }, 500);

    setSearchTimeout(timeout);
  };

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  return (
    <>
      <div className={header_style.header}>
        <div className={header_style.header_name}>
          <p>ForkLore</p>
        </div>

        <div>
          <input
            className={header_style.header_input}
            type="text"
            placeholder="Search for recipes"
            onChange={(e) => handleSearch(e.target.value)}
            onBlur={() => {
              setTimeout(() => setShowDropdown(false), 200);
            }}
            onFocus={() => setShowDropdown(true)}
          />
          {searchReturn && searchReturn.length > 0 && showDropdown && (
            <div ref={dropdownRef} className={header_style.search_items}>
              {searchReturn.map((meal: SearchItemType) => (
                <div key={meal.idMeal} className={header_style.items}>
                  <div className={header_style.item_name}>
                    <p>{meal.strMeal}</p>
                  </div>
                  <img src={meal.strMealThumb} alt={meal.strMeal} />
                  <div className={`${header_style.add_icon} ${header_style.ic_hover}`}>
                    <img
                      src={ic_plus}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleaddrecipe(meal.idMeal);
                      }}
                      alt="Add recipe"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Link to="/add_recipe" className={header_style.add_button}>
          <img src={ic_plus} alt="" />
        </Link>
      </div>
    </>
  );
};

export default Header;
