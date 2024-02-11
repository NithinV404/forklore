import { useState } from "react";
import styles from "./Add_recipe.module.css";
import React from "react"; 
import axios from "axios";


export default function AddRecipe() {
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
    recipeData.append("recipeingredients",JSON.stringify(recipeingredients));
    recipeData.append("recipeinstructions", recipeinstructions);
    recipeData.append("recipemeasureunit", JSON.stringify(recipemeasureunit));
    recipeData.append("recipemeasurevalue", JSON.stringify(recipemeasurevalue));
    recipeData.append("recipecategory", recipecategory);
    recipeData.append("recipeyoutube", recipeyoutube);
    recipeData.append("recipetags", recipetags);
    recipeData.append("recipearea", recipearea);
    console.log(recipeData);
    try {
      const response = await axios.post(`${serverUrl}/addrecipe`, recipeData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
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
            />
          </div>

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

