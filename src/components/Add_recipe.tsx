import { useState } from "react";
import styles from "./Add_recipe.module.css";
import React from "react";
export default function AddRecipe() {
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
  const [addbutton, setbutton] = useState<number>(1);
  const [recipename, setrecipename] = useState<string>("");
  const [recipeingredients, setrecipeingredients] = useState<string[]>([]);
  const [recipeinstructions, setrecipeinstructions] = useState<string>("");
  const [recipemeasure, setrecipemeasure] = useState<string[]>([]);
  const [recipemeasurevalue, setrecipemeasurevalue] = useState<string[]>([]);
  
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
                  value={recipemeasure[index]}
                  onChange={ (e) => {
                    const newMeasures = [...recipemeasure];
                    newMeasures[index] = e.target.value;
                    setrecipemeasure(newMeasures);
                  }}
                >
                  <option>select</option>
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
            <input
              className={styles.add_btn}
              type="file"
              accept="image/*"
            />
          </div>

          <input
            className={`${styles.submit_btn} ${styles.add_btn}`}
            type="button"
            value="Submit"
            onClick={() => {
              console.log({
                measures: recipemeasurevalue,
                ingredients: recipeingredients,
                name: recipename,
                instructions: recipeinstructions,
                measurment: recipemeasure
              });
            }}
          />
        </form>
      </div>
    </>
  );
}
