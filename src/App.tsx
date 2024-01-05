import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import RecipeCards from './components/Recipe_cards'
import Add_recipe from './components/Add_recipe'
import RecipeDetails from './components/recipe_details'
import Header from './components/header'
import { useState } from 'react'
export default function App() {

  const [searchInput, setSearchInput] = useState<String | null>('');
  return (
    <>
    <Header setSearchInput={setSearchInput}/>
    <Router>
      <Routes>
        <Route path="/" element={<RecipeCards searchInput={searchInput}/>} />
        <Route path='/recipe_details/:id' element={<RecipeDetails />} />
        <Route path='/add_recipe' element={<Add_recipe />} />
      </Routes>
    </Router>
  </>
  )
}
