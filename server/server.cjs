const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');

app.use(cors());
app.listen(5000, () => console.log('listening at 5000'));
app.use(express.json());


async function getRecipes(mealname) {
    try {
        let url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealname}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

async function deleteRecipe(recipeid) {
    try{
            fs.readFile('./src/recipe/recipes.json', 'utf8', async (err, data)=>{
            if(err)
            throw err;
            else
            {
                const recipes = await JSON.parse(data);
                const index = recipes.findIndex(recipe => recipe.idMeal === recipeid);
                if (index !== -1)
                recipes.splice(index, 1);
                fs.writeFile('./src/recipe/recipes.json', JSON.stringify(recipes), err => {
                    if (err)
                    throw err;
                });
            }
        })
    }
    catch(err)
    {
        console.log(err);
    }
}

async function addRecipe(recipeid){
    try {
        let url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeid}`;
        const response = await fetch(url);
        const newRecipe = await response.json();
        fs.readFile('./src/recipe/recipes.json', 'utf8', (err, data) => {
            if (err) 
            throw err;
            else {
                    const recipes = JSON.parse(data);
                    recipes.push(newRecipe.meals[0]);
                    fs.writeFile('./src/recipe/recipes.json', JSON.stringify(recipes, null, 2), err => {
                        if (err)
                        throw(err);
                    });
                }
        });
    } 
    catch (err) {
        console.log(err);
    }
}

app.post('/search', async (req, res) => {
    res.send(await getRecipes(req.body.recipeName)); 
});

app.post('/delete',async (req,res)=>{
    res.send(await deleteRecipe(req.body.recipeId));
})

app.post('/add',async (req,res)=>{
    res.send(await addRecipe(req.body.recipeId));
});
