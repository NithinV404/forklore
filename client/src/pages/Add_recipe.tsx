import { useState } from "react";
import styles from "./Add_recipe.module.css";
import React from "react";
import axios from "axios";
import HeaderBack from "../components/Header_back";
import { useRecipes } from "../context/Recipe_context";

export default function AddRecipe() {
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const { fetchRecipes } = useRecipes();
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
  const [recipetags, setrecipetags] = useState<string[]>([]);
  const [recipeyoutube, setrecipeyoutube] = useState<string>("");
  const [recipearea, setrecipearea] = useState<string>("");
  const [recipesource, setrecipesource] = useState<string>("");
  const [recipeingredients, setrecipeingredients] = useState<string[]>([""]);
  const [recipeinstructions, setrecipeinstructions] = useState<string>("");
  const [recipemeasureunit, setrecipemeasureunit] = useState<string[]>([""]);
  const [recipemeasurevalue, setrecipemeasurevalue] = useState<string[]>([""]);
  const [recipeImage, setRecipeImage] = useState<File | null>(null);
  const [addbutton, setbutton] = useState<number>(1);
  const [tagInput, setTagInput] = useState<string>("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>("");

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      setrecipetags([...recipetags, tagInput.trim()]);
      setTagInput("");
      e.preventDefault();
    }
  };

  const handleDeleteTag = (index: number) => {
    setrecipetags(recipetags.filter((_, i) => i !== index));
  };

  const previewImageSet = (e: React.ChangeEvent<HTMLInputElement> | null) => {
    if (e?.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setRecipeImage(e.target.files[0]);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      (e.target as HTMLInputElement).blur();
    }
  };

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
    recipeData.append("recipetags", JSON.stringify(recipetags));
    recipeData.append("recipearea", recipearea);
    console.log(recipeData);
    try {
      const response = await axios.post(`${serverUrl}/addrecipe`, recipeData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        fetchRecipes();
      }
    } catch (err) {
      console.log(err);
    }
    window.location.href = "/";
  };

  return (
    <>
      <HeaderBack />
      <div className={styles.addrecipe_form_style}>
        <form action="" className={styles.form_style}>
          <div className={styles.horizontal_fields}>
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
                onKeyDown={handleKeyDown}
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
                onKeyDown={handleKeyDown}
                placeholder="Enter recipe category"
              />
            </div>
            <div>
              <label htmlFor="recipe_area">Recipe Area</label>
              <br />
              <input
                className={styles.form_inputs}
                type="text"
                name="recipe_area"
                id="recipe_area"
                value={recipearea}
                onChange={(e) => setrecipearea(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter recipe area"
              />
            </div>
          </div>
          <div>
            <label htmlFor="recipe_tags">Recipe Tags</label>
            <br />
            <input
              className={styles.form_inputs}
              type="text"
              name="recipe_tags"
              id="recipe_tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && tagInput.trim() !== "") {
                  handleTagKeyDown(e);
                } else {
                  handleKeyDown(e);
                }
              }}
              placeholder="Enter recipe tags and press Enter"
            />
            <div className={styles.tags_container}>
              {recipetags.map((tag, index) => (
                <span key={index} className={styles.tag_pill}>
                  {tag}
                  <button
                    type="button"
                    className={styles.delete_tag_button}
                    onClick={() => handleDeleteTag(index)}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className={styles.ingredients_list}>
            <div>
              <label>Recipe Ingredients</label>{" "}
              <button
                type="button"
                className={styles.form_btn}
                onClick={(e) => {
                  if (addbutton < 10) {
                    setbutton((addbutton) => addbutton + 1);
                  }
                  e.preventDefault();
                }}
              >
                Add
              </button>
              <button
                type="button"
                className={styles.form_btn}
                onClick={(e) => {
                  if (addbutton > 0) {
                    setbutton((addbutton) => addbutton - 1);
                  }
                  e.preventDefault();
                }}
              >
                Delete
              </button>
            </div>
            <div className={styles.ingredients_list_input}>
              {[...Array(addbutton)].map((_, index) => (
                <React.Fragment key={`ingredients_key_${index}`}>
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
                    onKeyDown={handleKeyDown}
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
                    onKeyDown={handleKeyDown}
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
          </div>
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
          <div className={styles.horizontal_fields}>
            <div>
              <label>Recipe Image</label>
              <input
                className={styles.form_btn}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  previewImageSet(e);
                }}
                name="file"
              />
            </div>
            <div className={styles.imagePreview}>
              {imagePreviewUrl ? (
                <img src={imagePreviewUrl} alt="recipe_image_preview" />
              ) : (
                <p>No image selected</p>
              )}
            </div>
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
              onKeyDown={handleKeyDown}
              placeholder="Enter YouTube link"
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
              onKeyDown={handleKeyDown}
              placeholder="Enter recipe source"
            />
          </div>
          <div><button
            className={styles.form_btn}
            onClick={handleSubmit}
          >Submit</button></div>
        </form>
      </div>
    </>
  );
}
