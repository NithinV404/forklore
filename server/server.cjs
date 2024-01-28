const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");

app.use(cors());
app.listen(5000, () => console.log("listening at 5000"));
app.use(express.json());

async function readFileData() {
  try {
    const data = await fs.promises.readFile(
      "./src/recipe/recipes.json",
      "utf8"
    );
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
}
async function findRecipes(mealname) {
  try {
    let url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealname}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function getRecipes() {
  try {
    return await readFileData();
  } catch (error) {
    console.log(error);
  }
}
async function deleteRecipe(recipeid) {
  try {
    const recipes = await readFileData();
    const index = recipes.findIndex((recipe) => recipe.idMeal === recipeid);
    if (index !== -1) recipes.splice(index, 1);
    fs.writeFile(
      "./src/recipe/recipes.json",
      JSON.stringify(recipes),
      (err) => {
        if (err) throw err;
      }
    );
  } catch (err) {
    console.log(err);
  }
}

async function addRecipeByApi(recipeid) {
  try {
    let url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeid}`;
    const response = await fetch(url);
    const newRecipe = await response.json();
    const recipes = await readFileData();
    recipes.push(newRecipe.meals[0]);
    fs.writeFile(
      "./src/recipe/recipes.json",
      JSON.stringify(recipes, null, 2),
      (err) => {
        if (err) throw err;
      }
    );
  } catch (err) {
    console.log(err);
  }
}

async function addRecipeByUser() {
  try {
    fs.readFile("./src/recipe/recipes.json", "utf8", (err, data) => {
      if (err) throw err;
      else {
        const recipes = JSON.parse(data);
        recipes.push(newRecipe.meals[0]);
        fs.writeFile(
          "./src/recipe/recipes.json",
          JSON.stringify(recipes, null, 2),
          (err) => {
            if (err) throw err;
          }
        );
      }
    });
  } catch (err) {
    console.log(err);
  }
}

app.get("/", async (req, res) => {
  res.send(await getRecipes());
});

app.post("/search", async (req, res) => {
  res.send(await findRecipes(req.body.recipeName));
});

app.delete("/delete/:id", async (req, res) => {
  res.send(await deleteRecipe(req.params.id));
});

app.post("/add", async (req, res) => {
  res.send(await addRecipeByApi(req.body.recipeId));
});

// app.find("/details/:id", async (req, res) => {
//   res.send(await findRecipesDetails(req.params.id));
// });
