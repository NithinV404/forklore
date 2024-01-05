import { useState } from "react";
import styles from "./Add_recipe.module.css";
export default function AddRecipe() {
  const [addbutton, setbutton] = useState<number>(1);
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
  return (
    <>
      {console.log(addbutton)}
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
            {[...Array(addbutton)].map((_, index) => (
              <>
                <br />
                <input
                  className={styles.form_inputs}
                  key={`ingredient_key_${index}`}
                  type="text"
                  name={`ingredient_${index + 1}`}
                  id={`ingredient_${index + 1}`}
                  placeholder={`Ingredient ${index + 1}`}
                />
                <input
                  className={styles.form_inputs}
                  key={`quantity_key_${index}`}
                  type="text"
                  name={`quantity_${index + 1}`}
                  id={`quantity_${index + 1}`}
                  placeholder={`Quantity ${index + 1}`}
                />
                <select
                  key={`measure_key_${index}`}
                  className={styles.form_inputs_dropdown}
                  name={`measure_${index + 1}`}
                  id={`measure_${index + 1}`}
                >
                {measure.map((measure, index) => <option key={`measure_${index}`} value={measure}>{measure}</option>)}
                </select>
              </>
            ))}
          </div>

          <div>
            <label htmlFor="recipe_instructions">Recipe Instructions</label>
            <br />
            <textarea
              cols={40}
              rows={10}
              name="recipe_instructions"
              id="recipe_instructions"
              style={{ resize: "none" }}
            />
          </div>

          <div>
            <label htmlFor="recipe_image">Recipe Image</label>
            <br />
            <input type="text" name="recipe_image" id="recipe_image" />
          </div>

          <input type="button" value="submit" />
        </form>
      </div>
    </>
  );
}
