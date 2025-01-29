import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import HeaderBack from "../components/Header_back";
import styles from "./Add_recipe.module.css";
import axios from "axios";
import React from "react";
import { Recipe, useRecipes } from "../context/Recipe_context";
import { useToast } from "../context/Toast_context";

export default function Edit_recipe() {
  const { id } = useParams();
  const { recipes, fetchRecipes } = useRecipes();
  const { showToast } = useToast();
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const recipe = recipes.find((e) => e.idMeal === id);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [measureunit, setMeasureunit] = useState<string[]>([]);
  const [measurevalue, setMeasurevalue] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (recipe) {
      const tempIngredients: string[] = [];
      const tempMeasureunit: string[] = [];
      const tempMeasurevalue: string[] = [];

      for (let i = 1; i <= 20; i++) {
        if (
          recipe[`strIngredient${i}` as keyof Recipe] &&
          recipe[`strIngredient${i}` as keyof Recipe].trim() !== ""
        ) {
          tempIngredients.push(recipe[`strIngredient${i}` as keyof Recipe]);
        }
        if (
          recipe[`strMeasure${i}` as keyof Recipe] &&
          recipe[`strMeasure${i}` as keyof Recipe].trim() !== ""
        ) {

          const measureParts = recipe[`strMeasure${i}` as keyof Recipe].trim().split(' ');
          tempMeasurevalue.push(measureParts[0]);
          tempMeasureunit.push(measureParts[1] || '');
        }
      }

      setIngredients(tempIngredients);
      setMeasureunit(tempMeasureunit);
      setMeasurevalue(tempMeasurevalue);
    }
  }, [recipe]);

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
  const [recipemealthumb, setrecipemealthumb] = useState<string>("");
  const [recipesource, setrecipesource] = useState<string>("");
  const [recipeingredients, setrecipeingredients] = useState<string[]>([]);
  const [recipeinstructions, setrecipeinstructions] = useState<string>("");
  const [recipemeasureunit, setrecipemeasureunit] = useState<string[]>([]);
  const [recipemeasurevalue, setrecipemeasurevalue] = useState<string[]>([]);
  const [recipeImage, setRecipeImage] = useState<File | null | string>(null);
  const [addbutton, setbutton] = useState<number>(1);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>("");

  useEffect(() => {
    if (recipe) {
      setrecipename(recipe.strMeal || "");
      setrecipecategory(recipe.strCategory || "");
      setrecipetags(recipe.strTags ? recipe.strTags.split(",") : []);
      setrecipeyoutube(recipe.strYoutube || "");
      setrecipearea(recipe.strArea || "");
      setrecipeingredients(ingredients);
      setrecipeinstructions(recipe.strInstructions || "");
      setrecipemeasureunit(measureunit);
      setrecipemeasurevalue(measurevalue);
      setbutton(ingredients.length);
      setrecipemealthumb(recipe.strMealThumb || "");
    }
  }, [ingredients, measureunit, measurevalue, recipe]);

  useEffect(() => {
    window.scrollTo(0, location.state?.scrollPosition || 0);
  }, [location.state?.scrollPosition]);

  const handleSubmit = async () => {
    const recipeData = new FormData();
    if (recipeImage) {
      recipeData.append("file", recipeImage as Blob);
    } else {
      recipeData.append("file", recipemealthumb);
    }
    recipeData.append("idMeal", recipe?.idMeal || "");
    recipeData.append("recipename", recipename);
    recipeData.append("recipeingredients", JSON.stringify(recipeingredients));
    recipeData.append("recipeinstructions", recipeinstructions);
    recipeData.append("recipemeasureunit", JSON.stringify(recipemeasureunit));
    recipeData.append("recipemeasurevalue", JSON.stringify(recipemeasurevalue));
    recipeData.append("recipecategory", recipecategory);
    recipeData.append("recipeyoutube", recipeyoutube);
    recipeData.append("recipetags", recipetags.join(","));
    recipeData.append("recipearea", recipearea);
    recipeData.append("recipesource", recipesource);
    try {
      const response = await axios.post(`${serverUrl}/editrecipe`, recipeData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        showToast("Recipe added");
        fetchRecipes();
      }

    } catch (err) {
      console.log(err);
    }
  };

  const handleAddTag = (tag: string) => {
    if (tag && !recipetags.includes(tag)) {
      setrecipetags([...recipetags, tag]);
    }
  };

  const handleDeleteTag = (index: number) => {
    const newTags = [...recipetags];
    newTags.splice(index, 1);
    setrecipetags(newTags);
  };

  const previewImageSet = (e: React.ChangeEvent<HTMLInputElement> | null) => {
    if (e?.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setRecipeImage(e.target.files[0]);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <>
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag(e.currentTarget.value);
                    e.currentTarget.value = "";
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
                <p>Recipe Ingredients</p>{" "}
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
                  <div key={`ingredients_key_${index}`}>
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
                      {!measure.includes(recipemeasureunit[index]) &&
                        recipemeasureunit[index] && (
                          <option value={recipemeasureunit[index]}>
                            {recipemeasureunit[index]}
                          </option>
                        )}
                    </select>
                  </div>
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
              className={`${styles.submit_btn} ${styles.form_btn}`}
              type="button"
              value="Submit"
              onClick={(e) => {
                handleSubmit();
                e.preventDefault();
                e.stopPropagation();
                navigate(location.state?.from || "/");
              }}
            />
          </form>
        </div>
      </>
    </>
  );
}
