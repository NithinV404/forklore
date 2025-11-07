import React, { useState, useEffect } from "react";
import { AddRecipePayload, Recipe } from "../api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Props = {
  onAdd: (payload: AddRecipePayload) => Promise<void>;
  editRecipe?: Recipe | null;
};

export default function AddRecipeForm({ onAdd, editRecipe }: Props) {
  const [title, setTitle] = useState("");
  const [ingredientsText, setIngredientsText] = useState("");
  const [instructions, setInstructions] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editRecipe) {
      setTitle(editRecipe.strMeal || "");
      setInstructions(editRecipe.strInstructions || "");
      setImageUrl(editRecipe.strMealThumb || "");
      setCategory(editRecipe.strCategory || "");

      // Extract ingredients
      const ingredients: string[] = [];
      for (let i = 1; i <= 20; i++) {
        const ing = editRecipe[`strIngredient${i}`];
        const measure = editRecipe[`strMeasure${i}`];
        if (ing) ingredients.push(`${measure ?? ""} ${ing}`.trim());
      }
      setIngredientsText(ingredients.join("\n"));

      // Extract tags
      if (editRecipe.strTags) {
        setTags(editRecipe.strTags.split(",").map((tag) => tag.trim()));
      } else {
        setTags([]);
      }
    } else {
      // Reset form for new recipe
      setTitle("");
      setIngredientsText("");
      setInstructions("");
      setImageUrl("");
      setCategory("");
      setTags([]);
      setTagInput("");
    }
  }, [editRecipe]);

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !tags.includes(tag)) {
        setTags([...tags, tag]);
        setTagInput("");
      }
    }
  }

  function removeTag(tagToRemove: string) {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      const ingredients = ingredientsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      await onAdd({
        title,
        ingredients,
        instructions,
        imageUrl,
        category,
        tags: tags.join(", "),
      });

      setTitle("");
      setIngredientsText("");
      setInstructions("");
      setImageUrl("");
      setCategory("");
      setTags([]);
      setTagInput("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Recipe title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ingredients">Ingredients (one per line)</Label>
        <Textarea
          id="ingredients"
          value={ingredientsText}
          onChange={(e) => setIngredientsText(e.target.value)}
          placeholder="List ingredients, one per line"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category (optional)</Label>
        <Input
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g., Dessert, Main Course"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (optional)</Label>
        <Input
          id="tags"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          placeholder="Type a tag and press Enter"
        />
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-primary hover:text-primary/70"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL (optional)</Label>
        <Input
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="http://... or /recipes/images/..."
        />
      </div>

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting
          ? editRecipe
            ? "Updating..."
            : "Adding..."
          : editRecipe
            ? "Update Recipe"
            : "Add Recipe"}
      </Button>
    </form>
  );
}
