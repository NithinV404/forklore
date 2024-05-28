var express = require("express");
var router = express.Router();
var fs = require("fs");
const {readFileData, recipesFolder} = require("./file_utils"); 

router.delete("/:id", async function (req, res) {
    try {
        const recipes = await readFileData();
        const index = recipes.findIndex((recipe) => recipe.idMeal === req.params.id);
        if (index !== -1) {
            const imageUrl = recipes[index].strMealThumb; // assuming the image URL is stored in the 'strMealThumb' property
            const imageName = path.basename(imageUrl); 
            console.log(imageName)// extract the image name from the URL
            const imagePath = `${recipesFolder}/${imageName}`;
            if (fs.existsSync(imagePath)) {
                fs.unlink(imagePath, (err) => {
                    if (err) throw err;
                    console.log('Image was deleted');
                });
            }
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