import React, { useEffect, useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import RecipeList from "./components/RecipeList";
import AddRecipeModal from "./components/AddRecipeModal";
import SearchBar from "./components/SearchBar";
import RecipeDetail from "./components/RecipeDetail";
import Favorites from "./components/Favorites";
import {
  Recipe,
  fetchRecipes,
  fetchSavedRecipes,
  addRecipe,
  addRecipeById,
  editRecipe,
  deleteRecipe,
  searchRemote,
} from "./api";
import {
  FiGrid,
  FiList,
  FiPlus,
  FiSearch,
  FiHeart,
  FiSun,
  FiMoon,
  FiUpload,
  FiDownload,
} from "react-icons/fi";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { exportRecipes, importRecipes } from "./api";

export default function App() {
  const queryClient = useQueryClient();
  const [view, setView] = useState<"browse" | "saved">("saved");
  const [detail, setDetail] = useState<Recipe | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editRecipeData, setEditRecipeData] = useState<Recipe | null>(null);
  const [savedView, setSavedView] = useState<"grid" | "list">("grid");
  const [browseView, setBrowseView] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [savedCategory, setSavedCategory] = useState<string>("all");
  const [savedSearchTerm, setSavedSearchTerm] = useState<string>("");
  const [savedSearchType, setSavedSearchType] = useState<string>("name");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const recipesQuery = useQuery({
    queryKey: ["recipes"],
    queryFn: fetchRecipes,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
  const savedRecipesQuery = useQuery({
    queryKey: ["saved"],
    queryFn: fetchSavedRecipes,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const recipes = recipesQuery.data || [];
  const allRecipes = recipes;
  const loading = recipesQuery.isLoading;
  const savedRecipes = savedRecipesQuery.data || [];

  useEffect(() => {
    // Load theme preference
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Check browser preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  async function handleAdd(payload: any) {
    if (editRecipeData) {
      await editRecipe(editRecipeData.idMeal, payload);
    } else {
      await addRecipe(payload);
    }
    queryClient.invalidateQueries({ queryKey: ["recipes"] });
    queryClient.invalidateQueries({ queryKey: ["saved"] });
  }

  function handleEdit(recipe: Recipe) {
    setEditRecipeData(recipe);
    setAddOpen(true);
  }

  async function handleDelete(id: string) {
    await deleteRecipe(id);
    queryClient.invalidateQueries({ queryKey: ["saved"] });
  }

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  async function toggleSaved(recipe: Recipe) {
    const exists = savedRecipes.find((s) => s.idMeal === recipe.idMeal);
    if (exists) {
      await deleteRecipe(recipe.idMeal);
    } else {
      await addRecipeById(recipe.idMeal);
    }
    queryClient.invalidateQueries({ queryKey: ["saved"] });
  }

  async function handleExport() {
    try {
      await exportRecipes();
    } catch (error) {
      console.error("Export failed", error);
    }
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await importRecipes(file);
        queryClient.invalidateQueries({ queryKey: ["recipes"] });
        queryClient.invalidateQueries({ queryKey: ["saved"] });
      } catch (error) {
        console.error("Import failed", error);
      }
    }
  }

  async function handleSearch(value: string, type: string) {
    if (view === "saved") {
      setSavedSearchTerm(value);
      setSavedSearchType(type);
      setSavedCategory("all");
      return;
    }

    if (!value.trim()) {
      // Reset to all recipes
      queryClient.setQueryData(["recipes"], recipesQuery.data || []);
      setSelectedCategory("all");
      return;
    }

    const res = await searchRemote(value, type);
    // the external API returns { meals: [...] }
    const meals = res?.meals ?? [];
    queryClient.setQueryData(["recipes"], meals);
    setSelectedCategory("all");
  }

  // Get unique categories for filter
  const categories = [
    "all",
    ...Array.from(
      new Set(allRecipes.map((r) => r.strCategory).filter(Boolean)),
    ),
  ] as string[];
  const savedCategories = [
    "all",
    ...Array.from(
      new Set(savedRecipes.map((r) => r.strCategory).filter(Boolean)),
    ),
  ] as string[];

  // Filter recipes by category
  const filteredRecipes =
    selectedCategory === "all"
      ? recipes
      : recipes.filter((r) => r.strCategory === selectedCategory);

  // Filter saved recipes by category and search
  const filteredSavedRecipes = savedRecipes
    .filter((r) => {
      if (!savedSearchTerm.trim()) return true;
      const term = savedSearchTerm.toLowerCase();
      switch (savedSearchType) {
        case "name":
          return r.strMeal?.toLowerCase().includes(term);
        case "category":
          return r.strCategory?.toLowerCase().includes(term);
        case "area":
          return r.strArea?.toLowerCase().includes(term);
        default:
          return r.strMeal?.toLowerCase().includes(term);
      }
    })
    .filter((r) => savedCategory === "all" || r.strCategory === savedCategory);

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 bg-accent p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary">Forklore</h1>
          <p className="text-sm text-muted-foreground">Recipe Manager</p>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <Button
                variant={view === "saved" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setView("saved")}
              >
                <FiHeart className="w-4 h-4 mr-2" />
                Saved ({savedRecipes.length})
              </Button>
            </li>
            <li>
              <Button
                variant={view === "browse" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setView("browse")}
              >
                <FiSearch className="w-4 h-4 mr-2" />
                Browse
              </Button>
            </li>
          </ul>
        </nav>

        <div className="space-y-2">
          <Button variant="outline" onClick={toggleTheme} className="w-full">
            {theme === "light" ? (
              <>
                <FiMoon className="w-4 h-4 mr-2" />
                Dark Mode
              </>
            ) : (
              <>
                <FiSun className="w-4 h-4 mr-2" />
                Light Mode
              </>
            )}
          </Button>

          <Button onClick={() => setAddOpen(true)} className="w-full">
            <FiPlus className="w-4 h-4 mr-2" />
            Add Recipe
          </Button>

          <Button onClick={handleExport} className="w-full">
            <FiDownload className="w-4 h-4 mr-2" />
            Export Recipes
          </Button>

          <Button
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            <FiUpload className="w-4 h-4 mr-2" />
            Import Recipes
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-6">
            <SearchBar onSearch={handleSearch} />
          </div>

          {view === "browse" && (
            <div className="flex items-center justify-between mb-6">
              {categories.length > 1 && (
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    side="bottom"
                    align="start"
                    className="w-[--radix-select-trigger-width]"
                  >
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <div className="flex items-center gap-3">
                <Button
                  variant={browseView === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBrowseView("grid")}
                  aria-label="Grid view"
                >
                  <FiGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={browseView === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBrowseView("list")}
                  aria-label="List view"
                >
                  <FiList className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {view === "saved" && (
            <div className="flex items-center justify-between mb-6">
              {savedCategories.length > 1 && (
                <Select value={savedCategory} onValueChange={setSavedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    side="bottom"
                    align="start"
                    className="w-[--radix-select-trigger-width]"
                  >
                    {savedCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <div className="flex items-center gap-3">
                <Button
                  variant={savedView === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSavedView("grid")}
                  aria-label="Grid view"
                >
                  <FiGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={savedView === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSavedView("list")}
                  aria-label="List view"
                >
                  <FiList className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {view === "browse" && (
            <section>
              {loading ? (
                <div className="text-center py-10">Loading...</div>
              ) : browseView === "list" ? (
                <div className="space-y-3">
                  {filteredRecipes.map((recipe) => (
                    <Card
                      key={recipe.idMeal}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setDetail(recipe)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 bg-muted rounded overflow-hidden flex-shrink-0">
                            {recipe.strMealThumb ? (
                              <img
                                src={
                                  recipe.strMealThumb.startsWith("http")
                                    ? recipe.strMealThumb
                                    : `http://127.0.0.1:5000${recipe.strMealThumb}`
                                }
                                alt={recipe.strMeal}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                No Image
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold">
                              {recipe.strMeal}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {recipe.strCategory || ""} —{" "}
                              {recipe.strArea || ""}
                            </div>
                            {recipe.strInstructions && (
                              <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {recipe.strInstructions}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSaved(recipe);
                              }}
                              aria-label={
                                savedRecipes.some(
                                  (s) => s.idMeal === recipe.idMeal,
                                )
                                  ? "Unsave recipe"
                                  : "Save recipe"
                              }
                            >
                              {savedRecipes.some(
                                (s) => s.idMeal === recipe.idMeal,
                              ) ? (
                                <AiFillHeart className="h-4 w-4 text-red-500" />
                              ) : (
                                <AiOutlineHeart className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <RecipeList
                  recipes={filteredRecipes}
                  onToggleFavorite={(id) => {
                    const r = filteredRecipes.find((x) => x.idMeal === id);
                    if (r) toggleSaved(r);
                  }}
                  favorites={savedRecipes.map((s) => s.idMeal)}
                  onView={(r) => setDetail(r)}
                />
              )}
            </section>
          )}

          {view === "saved" && (
            <section>
              <Favorites
                favorites={filteredSavedRecipes}
                onToggleFavorite={(id) => {
                  const r = savedRecipes.find((x) => x.idMeal === id);
                  if (r) toggleSaved(r);
                }}
                onView={(r) => setDetail(r)}
                view={savedView}
              />
            </section>
          )}

          <RecipeDetail
            recipe={detail}
            onClose={() => setDetail(null)}
            onEdit={handleEdit}
          />
          <AddRecipeModal
            open={addOpen}
            onClose={() => {
              setAddOpen(false);
              setEditRecipeData(null);
            }}
            onAdd={async (p) => {
              await handleAdd(p);
              setAddOpen(false);
              setEditRecipeData(null);
            }}
            editRecipe={editRecipeData}
          />
        </div>
      </main>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        style={{ display: "none" }}
        accept=".json"
      />
    </div>
  );
}
