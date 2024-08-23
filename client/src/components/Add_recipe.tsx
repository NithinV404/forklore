import { useState } from "react";
import styles from "./Add_recipe.module.css";
import React from "react";
import axios from "axios";
import HeaderBack from "./header_back";

export default function AddRecipe({ fetchRecipes }: { fetchRecipes: () => void }) {
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const measure = [
    "grams",
    "ml",
    "tsp",
    "tbsp",
    "cups",
    "kg",
    "oz",
    "pinch",
    "whole",
  ];
  const [recipename, setrecipename] = useState<string>("");
  const [recipecategory, setrecipecategory] = useState<string>("");
  const [recipetags, setrecipetags] = useState<string>("");
  const [recipeyoutube, setrecipeyoutube] = useState<string>("");
  const [recipearea, setrecipearea] = useState<string>("");
  const [recipesource, setrecipesource] = useState<string>("");
  const [recipeingredients, setrecipeingredients] = useState<string[]>([""]);
  const [recipeinstructions, setrecipeinstructions] = useState<string>("");
  const [recipemeasureunit, setrecipemeasureunit] = useState<string[]>([""]);
  const [recipemeasurevalue, setrecipemeasurevalue] = useState<string[]>([""]);
  const [recipeImage, setRecipeImage] = useState<File | null>(null);
  const [addbutton, setbutton] = useState<number>(1);

  const handleSubmit = async () => {
    const recipeData = new FormData();
    recipeData.append("file", recipeImage as Blob);
    recipeData.append("recipename", recipename);
    recipeData.append("recipeingredients", JSON.stringify(recipeingredients));
    recipeData.append("recipeinstructions", recipeinstructions);
    recipeData.append("recipemeasureunit", JSON.stringify(recipemeasureunit));
    recipeData.append("recipemeasurevalue", JSON.stringify(recipemeasurevalue));
    recipeData.append("recipecategory", recipecategory);
    recipeData.append("recipeyoutube", recipeyoutube);
    recipeData.append("recipesource", recipesource);
    recipeData.append("recipetags", recipetags);
    recipeData.append("recipearea", recipearea);
    console.log(recipeData);
    try {
      const response = await axios.post(`${serverUrl}/addrecipe`, recipeData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) { fetchRecipes(); }
    } catch (err) {
      console.log(err);
    }
    window.location.href = "/";
  }

  return (
    <>
      <HeaderBack />
      <div className={styles.addrecipe_form_style}>
        <form action="" className={styles.form_style}>
          <div>
            <label htmlFor="recipe_name">Recipe Name</label>
            <br />
            <input
              className={styles.form_inputs}
              type="text"
              name="recipe_name"
              id="recipe_name"
              value={recipename}
              onChange={(e) => setrecipename(e.target.value)}
              placeholder="Enter recipe name"
            />
          </div>
          <div>
            <label htmlFor="recipe_category">Recipe Category</label>
            <br />
            <input
              className={styles.form_inputs}
              type="text"
              name="recipe_category"
              id="recipe_category"
              value={recipecategory}
              onChange={(e) => setrecipecategory(e.target.value)}
              placeholder="Enter recipe category"
            />
          </div>
          <div><label htmlFor="recipe_area">Recipe Area</label>
            <br />
            <input
              className={styles.form_inputs}
              type="text"
              name="recipe_area"
              id="recipe_area"
              value={recipearea}
              onChange={(e) => setrecipearea(e.target.value)}
              placeholder="Enter recipe area"
            /></div>
          <div><label htmlFor="recipe_tags">Recipe Tags</label>
            <br />
            <input
              className={styles.form_inputs}
              type="text"
              name="recipe_tags"
              id="recipe_tags"
              value={recipetags}
              onChange={(e) => setrecipetags(e.target.value)}
              placeholder="Enter recipe tags"
            /></div>
          <div className="ingredients_list">
            <label>Recipe Ingredients</label>{" "}
            <button
              className={styles.add_btn}
              onClick={(e) => {
                addbutton < 10 ? setbutton((addbutton) => addbutton + 1) : null;
                e.preventDefault();
              }}
            >
              Add
            </button>
            <button
              className={styles.add_btn}
              onClick={(e) => {
                if (addbutton > 0) {
                  setbutton((addbutton) => addbutton - 1);
                }
                e.preventDefault();
              }}
            >
              Delete
            </button>
            <hr />
            {[...Array(addbutton)].map((_, index) => (
              <React.Fragment key={`ingredients_key_${index}`}>
                <br />
                <input
                  className={styles.form_inputs}
                  type="text"
                  placeholder={`Ingredient ${index + 1}`}
                  value={recipeingredients[index] || ""}
                  onChange={(e) => {
                    const newIngredients = [...recipeingredients];
                    newIngredients[index] = e.target.value;
                    setrecipeingredients(newIngredients);
                  }}
                />
                <input
                  className={styles.form_inputs}
                  type="text"
                  placeholder={`Quantity ${index + 1}`}
                  value={recipemeasurevalue[index]}
                  onChange={(e) => {
                    const newMeasureValues = [...recipemeasurevalue];
                    newMeasureValues[index] = e.target.value;
                    setrecipemeasurevalue(newMeasureValues);
                  }}
                />
                <select
                  className={styles.form_inputs_dropdown}
                  value={recipemeasureunit[index]}
                  onChange={(e) => {
                    const newMeasures = [...recipemeasureunit];
                    newMeasures[index] = e.target.value;
                    setrecipemeasureunit(newMeasures);
                  }}
                >
                  <option value="">select</option>
                  {measure.map((measure, index) => (
                    <option key={`measure_${index}`} value={measure}>
                      {measure}
                    </option>
                  ))}
                </select>
              </React.Fragment>
            ))}
          </div>
          <hr />
          <div>
            <label htmlFor="recipe_instructions">Recipe Instructions</label>
            <br />
            <textarea
              className={styles.form_inputs}
              cols={80}
              rows={10}
              name="recipe_instructions"
              id="recipe_instructions"
              style={{ resize: "none" }}
              value={recipeinstructions}
              onChange={(e) => {
                setrecipeinstructions(e.target.value);
              }}
            />
          </div>
          <div>
            <label>Recipe Image</label>
            <input
              className={styles.add_btn}
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) {
                  setRecipeImage(e.target.files[0]);
                }
              }}
              name="file"
            />
          </div>
          <div>
            <label htmlFor="recipe_youtube">Youtube Link</label>
            <br />
            <input
              className={styles.form_inputs}
              type="text"
              name="recipe_youtube"
              id="recipe_youtube"
              value={recipeyoutube}
              onChange={(e) => setrecipeyoutube(e.target.value)}
              placeholder="Enter YouTube link" // Add this line
            />
          </div>
          <div>
            <label htmlFor="recipe_source">Recipe Source</label>
            <br />
            <input
              className={styles.form_inputs}
              type="text"
              name="recipe_source"
              id="recipe_source"
              value={recipesource}
              onChange={(e) => setrecipesource(e.target.value)}
              placeholder="Enter recipe source" // Add this line
            />
          </div>
          <input
            className={`${styles.submit_btn} ${styles.add_btn}`}
            type="button"
            value="Submit"
            onClick={handleSubmit}
          />
        </form>
      </div>
    </>
  );
}

