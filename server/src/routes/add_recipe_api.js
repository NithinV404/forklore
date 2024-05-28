var express = require("express");
var router = express.Router();
var fs = require("fs");
const {readFileData, recipesFolder} = require("./file_utils");

router.post("/", async (req, res) => {
    try {
        let url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${req.body.recipeId}`;
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
        res.status(200).send({ message: 'Recipe added successfully' });
      } catch (err) {
        console.log(err);
      }
});

module.exports = router;