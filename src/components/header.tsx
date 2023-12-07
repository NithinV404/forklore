import { useState } from 'react';
import axios from 'axios';
import './header.css';
import data from '../recipe/recipes.json'
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
    const [responseData, setResponseData] = useState<ResponseData | null>(null); 


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



    const handleaddrecipe = async (recipeId: String) => {
        const index = data.findIndex((recipe) => recipe.idMeal === recipeId);
        if(index != -1)
        {
            alert("Recipe already exists");
            return;
        }
        else
        { await axios.post('http://localhost:5000/add',{recipeId});}
    }
    
    return (
        <div className="header">
        <div className="header-name"><h2>Recipe App</h2></div>
        <div className="header-search"><input 
        type="text" 
        placeholder="Search for recipes"
        value={recipeName}
        onChange={(e) => setRecipeName(e.target.value)}
        onKeyPress={handleSearch}
        //onBlur={() => setResponseData(null)}
        />
        { responseData && responseData.meals!=null ? (<div className='search-items'>
        {
            responseData.meals.map((meal: any) => (
            <div key={meal.idMeal} className='items'>
            <p>{meal.strMeal}</p>
            <img src={meal.strMealThumb}/>
            <button className="btn" onClick={()=>handleaddrecipe(meal.idMeal)}>Add</button>
            </div>
        ))}
        </div>) : null
        }
        </div>
        </div>
    )
}