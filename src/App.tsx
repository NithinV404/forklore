import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import RecipeCards from './components/recipe_card'
import RecipeDetails from './components/recipe_details'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<RecipeCards />} />
        <Route path='/recipe_details/:id' element={<RecipeDetails />} />
      </Routes>
    </Router>
  )
}

export default App
