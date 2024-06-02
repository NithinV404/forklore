var express = require("express");
var router = express.Router();
var fs = require("fs");
var path = require("path");
const { readFileData, recipesFolder } = require("./file_utils");

const deleteLocalImage = (imageName) => {
    if (fs.existsSync(`${recipesFolder}/images/${imageName}`))
        fs.unlink(`${recipesFolder}/images/${imageName}`, (err) => {
            if (err) throw err;
        });
}

router.delete("/:id", async function (req, res) {
    try {
        const recipes = await readFileData();
        const index = recipes.findIndex((recipe) => recipe.idMeal === req.params.id);

        if (index != -1) {
            const recipe = recipes[index];
            const filename = path.basename(recipe.strMealThumb);
            deleteLocalImage(filename);
            recipes.splice(index, 1);
            fs.writeFile(
                `${recipesFolder}/recipes.json`,
                JSON.stringify(recipes),
                (err) => {
                    if (err) throw err;
                }
            );
        }
        res.status(200).send({ message: 'Recipe deleted successfully' });
    } catch (err) {
        console.log(err);
    }
})

module.exports = router;