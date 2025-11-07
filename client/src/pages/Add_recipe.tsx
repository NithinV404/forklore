import { useState, useEffect } from "react";
import styles from "./Add_recipe.module.css";
import React from "react";
import axios from "axios";
import HeaderBack from "../components/Header_back";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../context/Toast_context";
import { useRecipes } from "../context/Recipe_context";

export default function AddRecipe() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { fetchRecipes } = useRecipes();
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
  const [formdata, setformdata] = useState({
    recipeName: "",
    recipeCategory: "",
    recipeTags: [] as string[],
    recipeYoutube: "",
    recipeArea: "",
    recipeSource: "",
    recipeIngredients: [""],
    recipeInstructions: "",
    recipeMeasureUnit: [""],
    recipeMeasureValue: [""],
    recipeImage: null,
  });

  useEffect(() => {
    if (location.state?.from === location.pathname) {
      setTimeout(() => {
        window.scrollTo(0, location.state?.scrollPosition);
      }, 0);
    } else window.scrollTo(0, 0);
  }, [location.state?.scrollPosition, location.pathname, location.state?.from]);

  const handleFormInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setformdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const [recipeImage, setRecipeImage] = useState<File | null>(null);
  const [addbutton, setbutton] = useState<number>(1);
  const [tagInput, setTagInput] = useState<string>("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>("");

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      setformdata({
        ...formdata,
        recipeTags: [...formdata.recipeTags, tagInput.trim()],
      });
      setTagInput("");
      e.preventDefault();
    }
  };

  const handleDeleteTag = (index: number) => {
    setformdata({
      ...formdata,
      recipeTags: formdata.recipeTags.filter(
        (_: string, i: number) => i !== index,
      ),
    });
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
    recipeData.append("recipename", formdata.recipeName);
    recipeData.append(
      "recipeingredients",
      JSON.stringify(formdata.recipeIngredients),
    );
    recipeData.append("recipeinstructions", formdata.recipeInstructions);
    recipeData.append(
      "recipemeasureunit",
      JSON.stringify(formdata.recipeMeasureUnit),
    );
    recipeData.append(
      "recipemeasurevalue",
      JSON.stringify(formdata.recipeMeasureValue),
    );
    recipeData.append("recipecategory", formdata.recipeCategory);
    recipeData.append("recipeyoutube", formdata.recipeYoutube);
    recipeData.append("recipesource", formdata.recipeSource);
    recipeData.append("recipetags", formdata.recipeTags.toString());
    recipeData.append("recipearea", formdata.recipeArea);
    console.log(recipeData);
    try {
      const response = await axios.post(`${serverUrl}/addrecipe`, recipeData, {
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
    navigate(location.state?.from || "/");
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
                name="recipeName"
                id="recipe_name"
                value={formdata.recipeName}
                onChange={handleFormInput}
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
                name="recipeCategory"
                id="recipe_category"
                value={formdata.recipeCategory}
                onChange={handleFormInput}
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
                name="recipeArea"
                id="recipe_area"
                value={formdata.recipeArea}
                onChange={handleFormInput}
                onKeyDown={handleTagKeyDown}
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
              name="recipeTags"
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
              {formdata.recipeTags.map((tag, index) => (
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
                    name="recipeIngredients"
                    placeholder={`Ingredient ${index + 1}`}
                    value={formdata.recipeIngredients[index] || ""}
                    onChange={(e) => {
                      const newIngredients = [...formdata.recipeIngredients];
                      newIngredients[index] = e.target.value;
                      setformdata({
                        ...formdata,
                        recipeIngredients: newIngredients,
                      });
                    }}
                    onKeyDown={handleTagKeyDown}
                  />
                  <input
                    className={styles.form_inputs}
                    type="text"
                    placeholder={`Quantity ${index + 1}`}
                    value={formdata.recipeMeasureValue[index]}
                    onChange={(e) => {
                      const newMeasureValues = [...formdata.recipeMeasureValue];
                      newMeasureValues[index] = e.target.value;
                      setformdata({
                        ...formdata,
                        recipeMeasureValue: newMeasureValues,
                      });
                    }}
                    onKeyDown={handleTagKeyDown}
                  />
                  <select
                    className={styles.form_inputs_dropdown}
                    value={formdata.recipeMeasureUnit[index]}
                    onChange={(e) => {
                      const newMeasures = [...formdata.recipeMeasureUnit];
                      newMeasures[index] = e.target.value;
                      setformdata({
                        ...formdata,
                        recipeMeasureUnit: newMeasures,
                      });
                    }}
                  >
                    <option value="">select</option>
                    {measure.map((measure, index) => (
                      <option key={`measure_${index}`} value={measure}>
                        {measure}
                      </option>
                    ))}
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
              name="recipeInstructions"
              id="recipe_instructions"
              style={{ resize: "none" }}
              value={formdata.recipeInstructions}
              onChange={handleFormInput}
            />
          </div>
          <div className={styles.horizontal_fields}>
            <div>
              <label>Recipe Image</label>
              <input
                className={styles.form_btn}
                type="file"
                accept="image/*"
                onChange={previewImageSet}
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
              name="recipeYoutube"
              id="recipe_youtube"
              value={formdata.recipeYoutube}
              onChange={handleFormInput}
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
              name="recipeSource"
              id="recipe_source"
              value={formdata.recipeSource}
              onChange={handleFormInput}
              onKeyDown={handleTagKeyDown}
              placeholder="Enter recipe source"
            />
          </div>
          <div>
            <button
              className={styles.form_btn}
              onClick={(e) => {
                handleSubmit();
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
