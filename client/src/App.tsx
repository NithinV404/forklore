import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Pages import 
import RecipeCards from './pages/Recipe_menu'
import RecipeDetails from './pages/Recipe_details'
import Add_recipe from './pages/Add_recipe'
import Edit_recipe from './pages/Edit_recipe'
import Header from './components/Header'


// Dependencies
import { useState } from 'react'
import { RecipeProvider } from './context/Recipe_context'

export default function App() {

  const [searchInput, setSearchInput] = useState<string | null>('');

  return (
    <RecipeProvider>
      <Router>
        <>
          <Header setSearchInput={setSearchInput} />
          <Routes>
            <Route path="/" element={<RecipeCards searchInput={searchInput} />} />
            <Route path="/recipe_details/:id" element={<RecipeDetails />} />
            <Route path="/add_recipe" element={<Add_recipe />} />
            <Route path="/edit_recipe/:id" element={<Edit_recipe />} />
          </Routes>
        </>
      </Router>
    </RecipeProvider>
  );
}
