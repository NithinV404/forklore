import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import RecipeCards from './components/Recipe_cards'
import Add_recipe from './components/Add_recipe'
import RecipeDetails from './components/recipe_details'
import Header from './components/header'
import { useEffect, useState } from 'react'
import axios from 'axios'
export default function App() {

  const serverUrl = import.meta.env.VITE_SERVER_URL;

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

  const getRecipe = async () => {
    const response = await axios.get(`${serverUrl}/`);
    setRecipes(response.data);
  };

  useEffect(() => {
    getRecipe();
  }, []);

  const [searchInput, setSearchInput] = useState<string | null>(''); 

  const [recipes, setRecipes] = useState<Recipe[]>([]);

  return (
    <>
    <Header setSearchInput={setSearchInput} getRecipe={getRecipe} recipes={recipes}/>
    <Router>
      <Routes>
        <Route path="/" element={<RecipeCards searchInput={searchInput} getRecipe={getRecipe} recipes={recipes}/>} /> 
        <Route path='/recipe_details/:id' element={<RecipeDetails recipes={recipes} />} />
        <Route path='/add_recipe' element={<Add_recipe getRecipe={getRecipe} />} />
      </Routes>
      </Router>
  </>
  )
}
