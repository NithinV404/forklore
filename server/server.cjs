const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const shortid = require('shortid');
const recipesFolder = path.join(__dirname, "recipes");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${recipesFolder}/images`);
  },
  filename: function (req, file, cb) {
    // Temporary file name, could use a timestamp or a unique identifier
    const tempName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, tempName);
  },
});

const upload = multer({ storage: storage });
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
app.use('/images', express.static(path.join(__dirname, 'recipes/images')));

async function readFileData() {
  try {
    if (!fs.existsSync(`${recipesFolder}/images`)) {
      fs.mkdirSync(`${recipesFolder}/images`, { recursive: true });
    }
    if (!fs.existsSync(`${recipesFolder}/recipes.json`)) {
      fs.writeFileSync(`${recipesFolder}/recipes.json`, "[]");
    }
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

async function addRecipeByUser(req) {
  try {
    var newRecipe = req.body;
    const recipeId = "mr" + generateUniqueId();
    const recipes = await readFileData();
    const tempRecipe = {
      idMeal: recipeId,
      strMeal: newRecipe.recipename,
      strCategory: newRecipe.recipecategory,
      strArea: newRecipe.recipearea,
      strInstructions: newRecipe.recipeinstructions,
      strMealThumb: `http://localhost:5000/images/` + recipeId + ".jpg",
      strTags: newRecipe.recipetags,
      strYoutube: newRecipe.recipeyoutube,
    };
    console.log(newRecipe.recipeingredients)
    for (let i = 0; i < 10; i++) {
      const ingredientKey = `strIngredient${i + 1}`;
      const measureKey = `strMeasure${i + 1}`;
      const ingredientValue = newRecipe.recipeingredients ? JSON.parse(newRecipe.recipeingredients)[i] : undefined;
      const measureValue = newRecipe.recipemeasurevalue ? JSON.parse(newRecipe.recipemeasurevalue)[i] : undefined;
      const unitValue = newRecipe.recipemeasureunit ? JSON.parse(newRecipe.recipemeasureunit)[i] : undefined;
      tempRecipe[ingredientKey] = ingredientValue !== undefined ? ingredientValue : "";
      tempRecipe[measureKey] = measureValue !== undefined ? `${measureValue} ${unitValue !== undefined ? unitValue : ""}` : "";
    }
    if (req.file) {
      const tempPath = req.file.path;
      const newFilename = `${recipeId}${path.extname(req.file.originalname)}`;
      const newPath = path.join(`${recipesFolder}/images`, newFilename);
  
      try {
        await fs.promises.rename(tempPath, newPath);
        // Update the file path or name in your recipe data if necessary
      } catch (error) {
        console.error("Error renaming file:", error);
        // Handle error (e.g., send a response indicating failure)
      }
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

app.post("/addrecipe", upload.single('file'), async (req, res) => {
    res.send(await addRecipeByUser(req));
});

// app.find("/details/:id", async (req, res) => {
//   res.send(await findRecipesDetails(req.params.id));
// });
