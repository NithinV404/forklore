const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const shortid = require('shortid');
const recipesFolder = path.join(__dirname, "recipes");

function generateUniqueId(recipes) {
  let id = shortid.generate();
  while (Array.isArray(recipes) && recipes.some(recipe => recipe.id === id)) {
      id = shortid.generate();
  }
  return id;
}

app.use(cors());
app.listen(5000, () => console.log("listening at 5000"));
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${recipesFolder}/images`);  },
  filename: (req, file, cb) => {
    const recipeId = "mr" + uuidv4();
    cb(null, recipeId + ".jpg");
  }
});

const upload = multer({ storage: storage });

async function readFileData() {
  try {
    const data = await fs.promises.readFile(
      `${recipesFolder}/recipes.json`,
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
      `${recipesFolder}/recipes.json`,
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
      `${recipesFolder}/recipes.json`,
      JSON.stringify(recipes, null, 2),
      (err) => {
        if (err) throw err;
      }
    );
  } catch (err) {
    console.log(err);
  }
}

async function addRecipeByUser(newRecipe) {
  const { recipename, recipeingredients, recipeinstructions, recipemeasureunit, recipemeasurevalue, recipeimage, recipecategory, recipetags, recipeyoutube,recipearea } = newRecipe;
  try {
        const recipeId = "mr" + generateUniqueId();
        const recipes = await readFileData();
        const tempRecipe = {
          idMeal: recipeId,
          strMeal: recipename,
          strCategory: recipecategory,
          strArea: recipearea,
          strInstructions: recipeinstructions,
          strMealThumb: `${recipesFolder}/images/` + recipeId + ".jpg",
          strTags: recipetags,
          strYoutube: recipeyoutube,
        };
        for (let i = 0; i < 10; i++) {
          const ingredientKey = `strIngredient${i + 1}`;
          const measureKey = `strMeasure${i + 1}`;
          tempRecipe[ingredientKey] = recipeingredients[i];
          tempRecipe[measureKey] = recipemeasurevalue[i]+" "+recipemeasureunit[i];
        }
        recipes.push(tempRecipe);
        fs.writeFile(
          `${recipesFolder}/recipes.json`,
          JSON.stringify(recipes, null, 2),
          (err) => {
            if (err) throw err;
          }
        );
        console.log("Added Recipe", tempRecipe);
      }
   catch (err) {
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

app.post("/addrecipe", upload.single('recipeimage'), async (req, res) => {
  res.send(await addRecipeByUser(req.body.recipeData));
});

// app.find("/details/:id", async (req, res) => {
//   res.send(await findRecipesDetails(req.params.id));
// });
