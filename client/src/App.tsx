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

  const [searchInput, setSearchInput] = useState<string | null>(''); 

  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const fetchRecipes = async () => {
  console.log('fetched')
  const response = await axios.get(`${serverUrl}/`);
      setRecipes(response.data);
  };

  useEffect(() => {
    fetchRecipes();
  }, []);



  return (
    <>
    <Header setSearchInput={setSearchInput} recipes={recipes} fetchRecipes={fetchRecipes}/>
    <Router>
      <Routes>
        <Route path="/" element={<RecipeCards searchInput={searchInput}  recipes={recipes} fetchRecipes={fetchRecipes}/>} /> 
        <Route path='/recipe_details/:id' element={<RecipeDetails recipes={recipes} />} />
        <Route path='/add_recipe' element={<Add_recipe fetchRecipes={fetchRecipes} />} />
      </Routes>
      </Router>
  </>
  )
}
