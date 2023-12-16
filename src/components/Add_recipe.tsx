import { useState } from 'react';
import styles from './Add_recipe.module.css'
export default function AddRecipe() {

    const [addbutton, setbutton] = useState<number>(1);


    return(<>
    {console.log(addbutton)}
    <div className={styles.addrecipe_form_style}>
        <form action="" className={styles.form_style}>
            <label htmlFor="recipe_name">Recipe Name</label>
            <input type="text" name="recipe_name" id="recipe_name" />
            <div className="ingredients_list">
                <label htmlFor="recipe_ingredients">Recipe Ingredients</label> <button onClick={(e) => { addbutton < 10 ? setbutton(addbutton => addbutton +1) : null; e.preventDefault()}}>Add</button>
                {[...Array(addbutton)].map((_, index) => (
                    <><br/><input key={index} type="text" name={`ingredient_${index + 1}`} id={`ingredient_${index + 1}`} /></>
                ))}
            </div>
            <label htmlFor="recipe_instructions">Recipe Instructions</label>
            <input type="text" name="recipe_instructions" id="recipe_instructions" />
            <label htmlFor="recipe_image">Recipe Image</label>
            <input type="text" name="recipe_image" id="recipe_image" />
            <input type="" />
        </form>
    </div>
    </>
    );
}