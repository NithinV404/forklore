import { useState } from "react";
import styles from "./Add_recipe.module.css";
export default function AddRecipe() {
  const [addbutton, setbutton] = useState<number>(1);

  return (
    <>
      {console.log(addbutton)}
      <div className={styles.addrecipe_form_style}>
        <form action="" className={styles.form_style}>
          <div>
            <label htmlFor="recipe_name">Recipe Name</label>
            <input type="text" name="recipe_name" id="recipe_name" />
          </div>

          <div className="ingredients_list">
            <label >Recipe Ingredients</label>{" "}
            <button
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
                  key={index}
                  type="text"
                  name={`ingredient_${index + 1}`}
                  id={`ingredient_${index + 1}`}
                />
              </>
            ))}
          </div>

          <div>
            <label htmlFor="recipe_instructions">Recipe Instructions</label><br/>
            <input
              type="text"
              name="recipe_instructions"
              id="recipe_instructions"
            />
          </div>

          <div>
            <label htmlFor="recipe_image">Recipe Image</label><br/>
            <input type="text" name="recipe_image" id="recipe_image" />
          </div>

          <input type="button" value="submit"/>
        </form>
      </div>
    </>
  );
}
