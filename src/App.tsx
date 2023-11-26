import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import RecipeCards from './components/recipe_card'
import RecipeDetails from './components/recipe_details'
import Qrgenerator from './components/qr_generator'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<RecipeCards />} />
        <Route path='/recipe_details/:id' element={<RecipeDetails />} />
        <Route path='/qr-code/:id' element={<Qrgenerator />} />
      </Routes>
    </Router>
  )
}

export default App
