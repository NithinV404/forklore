/*
 API helper adapted to server shapes.
 - Uses the server's Recipe shape (fields like idMeal, strMeal, strInstructions)
 - addRecipe will send multipart/form-data to `/addrecipe` (the server expects multipart)
 - addRecipeById will call `/add` with JSON { recipeId } to add by external id
 - searchRemote posts { search_value, search_type } to `/search`
*/

export type Recipe = {
  idMeal: string;
  strMeal: string;
  strInstructions?: string;
  strMealThumb?: string;
  strCategory?: string;
  strArea?: string;
  strTags?: string | null;
  strYoutube?: string;
  [key: string]: any;
};

export type AddRecipePayload = {
  title: string;
  ingredients: string[];
  measureValues?: string[];
  measureUnits?: string[];
  instructions?: string;
  imageUrl?: string; // optional URL string for mealthumb
  youtube?: string;
  category?: string;
  tags?: string;
  area?: string;
  source?: string;
};

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE ?? "http://127.0.0.1:5000";

export async function fetchRecipes(): Promise<Recipe[]> {
  const res = await fetch(`${API_BASE}/`);
  if (!res.ok) return [];
  return (await res.json()) as Recipe[];
}

// Add recipe using multipart/form-data as the server expects (route: /addrecipe)
export async function addRecipe(
  payload: AddRecipePayload | FormData
): Promise<void> {
  const fd = payload instanceof FormData ? payload : new FormData();
  if (!(payload instanceof FormData)) {
    fd.append("recipename", payload.title);
    fd.append("recipeinstructions", payload.instructions ?? "");
    fd.append("recipetags", payload.tags ?? "");
    fd.append("recipecategory", payload.category ?? "");
    fd.append("recipearea", payload.area ?? "");
    fd.append("recipesource", payload.source ?? "");
    fd.append("recipeyoutube", payload.youtube ?? "");
    // ingredients, measure arrays as JSON strings
    fd.append("recipeingredients", JSON.stringify(payload.ingredients || []));
    fd.append(
      "recipemeasurevalue",
      JSON.stringify(payload.measureValues || [])
    );
    fd.append("recipemeasureunit", JSON.stringify(payload.measureUnits || []));
    // For image: server accepts either an URL string or uploaded bytes on field 'file'
    if (payload.imageUrl) fd.append("file", payload.imageUrl);
  }

  await fetch(`${API_BASE}/addrecipe`, {
    method: "POST",
    body: fd,
  });
}

// Edit recipe using multipart/form-data (route: /editrecipe)
export async function editRecipe(
  id: string,
  payload: AddRecipePayload | FormData
): Promise<void> {
  const fd = payload instanceof FormData ? payload : new FormData();
  if (!(payload instanceof FormData)) {
    fd.append("recipeid", id);
    fd.append("recipename", payload.title);
    fd.append("recipeinstructions", payload.instructions ?? "");
    fd.append("recipetags", payload.tags ?? "");
    fd.append("recipecategory", payload.category ?? "");
    fd.append("recipearea", payload.area ?? "");
    fd.append("recipesource", payload.source ?? "");
    fd.append("recipeyoutube", payload.youtube ?? "");
    // ingredients, measure arrays as JSON strings
    fd.append("recipeingredients", JSON.stringify(payload.ingredients || []));
    fd.append(
      "recipemeasurevalue",
      JSON.stringify(payload.measureValues || [])
    );
    fd.append("recipemeasureunit", JSON.stringify(payload.measureUnits || []));
    // For image: server accepts either an URL string or uploaded bytes on field 'file'
    if (payload.imageUrl) fd.append("file", payload.imageUrl);
  }

  await fetch(`${API_BASE}/editrecipe`, {
    method: "POST",
    body: fd,
  });
}

// Add recipe by external id (server route: /add expects JSON { recipeId })
export async function addRecipeById(recipeId: string): Promise<void> {
  await fetch(`${API_BASE}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recipeId }),
  });
}

export async function deleteRecipe(id: string): Promise<void> {
  await fetch(`${API_BASE}/delete/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function searchRemote(
  search_value: string,
  search_type: string
): Promise<any> {
  const res = await fetch(`${API_BASE}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ search_value, search_type }),
  });
  if (!res.ok) return null;
  return await res.json();
}
