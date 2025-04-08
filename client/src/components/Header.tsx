import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import header_style from "./Header.module.css";
import Plus from "../assets/SVG/Plus";
import Search from "../assets/SVG/Search";
import { useRecipes } from "../context/Recipe_context";
import { useToast } from "../context/Toast_context";
import { SearchItemType, useSearch } from "../context/Search_context";
import { useDebounce } from "../hooks/useDebounce";

const Header = () => {
  const { recipes, fetchRecipes } = useRecipes();
  const { searchReturn, fetchSearch } = useSearch();
  const { showToast } = useToast();
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, location.state?.scrollPosition || 0);
  }, [location.state?.scrollPosition]);

  const handleDebouncedSearch = useDebounce((value: string) => {
    fetchSearch(value);
    setShowDropdown(true);
  }, 500);

  const handleaddrecipe = async (recipeId: string) => {
    const index = recipes.findIndex((recipe) => recipe.idMeal === recipeId);
    if (index != -1) {
      showToast("Recipe already exists");
      return;
    } else {
      const response = await axios.post(`${serverUrl}/add`, { recipeId });
      if (response.status === 200) {
        fetchRecipes();
      }
    }
  };

  const searchItemsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchItemsRef.current &&
        !searchItemsRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchItemsRef]);

  return (
    <header className={header_style.header}>
      <div className={header_style.title}>
        <h2>Forklore</h2>
      </div>
      <div className={header_style.search_container} ref={searchItemsRef}>
        <input
          ref={inputRef}
          placeholder="Search for recipes"
          className={header_style.input}
          onChange={(e) => {
            handleDebouncedSearch(e.target.value);
          }}
        ></input>
        <Search className={header_style.search_icon}></Search>
        {searchReturn && searchReturn.length > 0 && showDropdown && (
          <div className={`${header_style.search_items}`} ref={searchItemsRef}>
            {searchReturn.map((meal: SearchItemType) => (
              <div className={header_style.search_item}>
                <img src={`${meal.strMealThumb}/small`} alt={meal.strMeal} />
                <h1>{meal.strMeal}</h1>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleaddrecipe(meal.idMeal);
                  }}
                >
                  <Plus />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Plus
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          navigate(`/add_recipe`, {
            state: {
              from: location.pathname,
              scrollPosition: scrollY,
            },
          });
        }}
      />
    </header>
  );
};

export default Header;
