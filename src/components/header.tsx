import { useState } from 'react';
import axios from 'axios';
import './header.css';
export default function Header()
{
    interface Meal
    {
        idMeal: string;
        strMeal: string;
        strMealThumb: string;
    }
    interface ResponseData
    {
        meals: Meal[];
    }

    const [recipeName, setRecipeName] = useState("");
    const [responseData, setResponseData] = useState<ResponseData | null>(null); // [
    const handleSearch = async () => {
        try{
            const response = await axios.post('http://localhost:5000/search', {recipeName});
            setResponseData(response.data);
            console.log(response.data);
        }
        catch(err)
        {
            console.log(err);
        }
    }
    const handleKeyPress = (event: { key: string; }) => {
        if (event.key === 'Enter') {
          handleSearch();
        }
      }
    return (
        <div className="header">
        <div className="header-name"><h2>Recipe App</h2></div>
        <div className="header-search"><input 
        type="text" 
        placeholder="Search for recipes"
        value={recipeName}
        onChange={(e) => setRecipeName(e.target.value)}
        onKeyPress={handleKeyPress}
        onBlur={() => setResponseData(null)}
        />
        { responseData ? (<div className='search-items'>
        {responseData && responseData.meals.map((meal: any) => (
            <div key={meal.idMeal} className='items'><p>{meal.strMeal}</p><img src={meal.strMealThumb}/></div>
        ))}
        </div>) : null
        }
        </div>
        </div>
    )
}