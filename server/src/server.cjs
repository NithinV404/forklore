const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

app.use(cors());
app.listen(5000, () => console.log("listening at 5000"));
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, '../../server/recipes/images')));

const fetch_recipes = require("./routes/fetch_recipes");
const deleteRecipe = require("./routes/delete_recipe");
const add_recipe_api = require("./routes/add_recipe_api");
const addRecipeUser = require("./routes/add_recipe_user");
const search_recipe = require("./routes/search_recipe");
const edit_recipe = require("./routes/edit_recipe");

app.use("/", fetch_recipes)
app.use("/search", search_recipe)
app.use("/delete", deleteRecipe)
app.use("/add", add_recipe_api)
app.use("/addrecipe", addRecipeUser)
app.use("/editrecipe", edit_recipe)


// app.find("/details/:id", async (req, res) => {
//   res.send(await findRecipesDetails(req.params.id));
// });
