import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import RecipeCards from './components/Recipe_cards'
import RecipeDetails from './components/Recipe_details'
export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<RecipeCards />} />
        <Route path='/recipe_details/:id' element={<RecipeDetails />} />
      </Routes>
    </Router>
  )
}
