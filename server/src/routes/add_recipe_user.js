var express = require("express");
var router = express.Router();
var fs = require("fs");
const path = require("path");
const multer = require("multer");
const shortid = require('shortid');
const {readFileData, recipesFolder} = require("./file_utils");

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

router.post("/", upload.single('file'), async function (req, res) {
    try {
        console.log(req.body)
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
        res.status(200).send({ message: 'Recipe added successfully' });
      } catch (err) {
        console.log(err);
      }
})

module.exports = router;