import React, { useEffect, useState } from 'react'
import RecipeList from './components/RecipeList'
import AddRecipeModal from './components/AddRecipeModal'
import SearchBar from './components/SearchBar'
import RecipeDetail from './components/RecipeDetail'
import Favorites from './components/Favorites'
import { Recipe, fetchRecipes, addRecipe, editRecipe, deleteRecipe, searchRemote } from './api'
import { FiGrid, FiList, FiPlus, FiSearch, FiHeart, FiSun, FiMoon } from 'react-icons/fi'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'

export default function App() {
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [allRecipes, setAllRecipes] = useState<Recipe[]>([])
    const [loading, setLoading] = useState(true)
    const [view, setView] = useState<'browse' | 'saved'>('browse')
    const [detail, setDetail] = useState<Recipe | null>(null)
    const [favorites, setFavorites] = useState<Recipe[]>([])
    const [addOpen, setAddOpen] = useState(false)
    const [editRecipeData, setEditRecipeData] = useState<Recipe | null>(null)
    const [savedView, setSavedView] = useState<'grid' | 'list'>('grid')
    const [browseView, setBrowseView] = useState<'grid' | 'list'>('grid')
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [savedCategory, setSavedCategory] = useState<string>('all')
    const [theme, setTheme] = useState<'light' | 'dark'>('light')

    useEffect(() => {
        load()
        const raw = localStorage.getItem('favorites')
        if (raw) setFavorites(JSON.parse(raw))

        // Load theme preference
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
        if (savedTheme) {
            setTheme(savedTheme)
        } else {
            // Default to dark theme
            setTheme('dark')
        }
    }, [])

    // Apply theme to document
    useEffect(() => {
        const root = document.documentElement
        if (theme === 'dark') {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }
        localStorage.setItem('theme', theme)
    }, [theme])

    async function load() {
        setLoading(true)
        const data = await fetchRecipes()
        setRecipes(data)
        setAllRecipes(data)
        setLoading(false)
    }

    async function handleAdd(payload: any) {
        if (editRecipeData) {
            await editRecipe(editRecipeData.idMeal, payload)
        } else {
            await addRecipe(payload)
        }
        await load()
    }

    function handleEdit(recipe: Recipe) {
        setEditRecipeData(recipe)
        setAddOpen(true)
    }

    async function handleDelete(id: string) {
        await deleteRecipe(id)
        // remove from favorites if present
        const updatedFavs = favorites.filter((f) => f.idMeal !== id)
        setFavorites(updatedFavs)
        localStorage.setItem('favorites', JSON.stringify(updatedFavs))
        await load()
    }

    function toggleTheme() {
        setTheme(theme === 'light' ? 'dark' : 'light')
    }

    function toggleFavorite(recipe: Recipe) {
        const exists = favorites.find((f) => f.idMeal === recipe.idMeal)
        let updated: Recipe[]
        if (exists) {
            updated = favorites.filter((f) => f.idMeal !== recipe.idMeal)
        } else {
            updated = [recipe, ...favorites]
        }
        setFavorites(updated)
        localStorage.setItem('favorites', JSON.stringify(updated))
    }

    async function handleSearch(value: string, type: string) {
        if (!value.trim()) {
            // Reset to all recipes
            setRecipes(allRecipes)
            setSelectedCategory('all')
            return
        }

        setLoading(true)
        const res = await searchRemote(value, type)
        // the external API returns { meals: [...] }
        const meals = res?.meals ?? []
        setRecipes(meals)
        setSelectedCategory('all')
        setLoading(false)
    }

    // Get unique categories for filter
    const categories = ['all', ...Array.from(new Set(allRecipes.map(r => r.strCategory).filter(Boolean)))] as string[]
    const savedCategories = ['all', ...Array.from(new Set(favorites.map(r => r.strCategory).filter(Boolean)))] as string[]

    // Filter recipes by category
    const filteredRecipes = selectedCategory === 'all'
        ? recipes
        : recipes.filter(r => r.strCategory === selectedCategory)

    // Filter favorites by category
    const filteredFavorites = savedCategory === 'all'
        ? favorites
        : favorites.filter(r => r.strCategory === savedCategory)

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
                                variant={view === 'browse' ? 'default' : 'ghost'}
                                className="w-full justify-start"
                                onClick={() => setView('browse')}
                            >
                                <FiSearch className="w-4 h-4 mr-2" />
                                Browse
                            </Button>
                        </li>
                        <li>
                            <Button
                                variant={view === 'saved' ? 'default' : 'ghost'}
                                className="w-full justify-start"
                                onClick={() => setView('saved')}
                            >
                                <FiHeart className="w-4 h-4 mr-2" />
                                Saved ({favorites.length})
                            </Button>
                        </li>
                    </ul>
                </nav>

                <div className="space-y-2">
                    <Button variant="outline" onClick={toggleTheme} className="w-full">
                        {theme === 'light' ? (
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
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8">
                    <div className="mb-6">
                        <SearchBar onSearch={handleSearch} />
                    </div>

                    {view === 'browse' && (
                        <div className="flex items-center justify-between mb-6">
                            {categories.length > 1 && (
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger className="w-48">
                                        <SelectValue placeholder="Filter by category" />
                                    </SelectTrigger>
                                    <SelectContent position="popper" side="bottom" align="start" className="w-[--radix-select-trigger-width]">
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category === 'all' ? 'All Categories' : category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                            <div className="flex items-center gap-3">
                                <Button
                                    variant={browseView === 'grid' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setBrowseView('grid')}
                                    aria-label="Grid view"
                                >
                                    <FiGrid className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={browseView === 'list' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setBrowseView('list')}
                                    aria-label="List view"
                                >
                                    <FiList className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {view === 'saved' && (
                        <div className="flex items-center justify-between mb-6">
                            {savedCategories.length > 1 && (
                                <Select value={savedCategory} onValueChange={setSavedCategory}>
                                    <SelectTrigger className="w-48">
                                        <SelectValue placeholder="Filter by category" />
                                    </SelectTrigger>
                                    <SelectContent position="popper" side="bottom" align="start" className="w-[--radix-select-trigger-width]">
                                        {savedCategories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category === 'all' ? 'All Categories' : category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                            <div className="flex items-center gap-3">
                                <Button
                                    variant={savedView === 'grid' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setSavedView('grid')}
                                    aria-label="Grid view"
                                >
                                    <FiGrid className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={savedView === 'list' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setSavedView('list')}
                                    aria-label="List view"
                                >
                                    <FiList className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {view === 'browse' && (
                        <section>
                            {loading ? (
                                <div className="text-center py-10">Loading...</div>
                            ) : browseView === 'list' ? (
                                <div className="space-y-3">
                                    {filteredRecipes.map((recipe) => (
                                        <Card key={recipe.idMeal} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setDetail(recipe)}>
                                            <CardContent className="p-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-20 h-20 bg-muted rounded overflow-hidden flex-shrink-0">
                                                        {recipe.strMealThumb ? (
                                                            <img
                                                                src={recipe.strMealThumb.startsWith('http') ? recipe.strMealThumb : `http://127.0.0.1:5000${recipe.strMealThumb}`}
                                                                alt={recipe.strMeal}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-semibold">{recipe.strMeal}</div>
                                                        <div className="text-sm text-muted-foreground">{recipe.strCategory || ''} — {recipe.strArea || ''}</div>
                                                        {recipe.strInstructions && (
                                                            <div className="text-sm text-muted-foreground mt-1 line-clamp-2">{recipe.strInstructions}</div>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                toggleFavorite(recipe)
                                                            }}
                                                            aria-label={favorites.some(f => f.idMeal === recipe.idMeal) ? 'Unsave recipe' : 'Save recipe'}
                                                        >
                                                            {favorites.some(f => f.idMeal === recipe.idMeal) ? (
                                                                <AiFillHeart className="h-4 w-4 text-red-500" />
                                                            ) : (
                                                                <AiOutlineHeart className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleDelete(recipe.idMeal)
                                                            }}
                                                        >
                                                            Delete
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
                                    onDelete={handleDelete}
                                    onToggleFavorite={(id) => {
                                        const r = filteredRecipes.find((x) => x.idMeal === id)
                                        if (r) toggleFavorite(r)
                                    }}
                                    favorites={favorites.map(f => f.idMeal)}
                                    onView={(r) => setDetail(r)}
                                />
                            )}
                        </section>
                    )}

                    {view === 'saved' && (
                        <section>
                            <Favorites
                                favorites={filteredFavorites}
                                onDelete={handleDelete}
                                onToggleFavorite={(id) => {
                                    const r = favorites.find((x) => x.idMeal === id)
                                    if (r) toggleFavorite(r)
                                }}
                                onView={(r) => setDetail(r)}
                                view={savedView}
                            />
                        </section>
                    )}

                    <RecipeDetail recipe={detail} onClose={() => setDetail(null)} onEdit={handleEdit} />
                    <AddRecipeModal
                        open={addOpen}
                        onClose={() => { setAddOpen(false); setEditRecipeData(null) }}
                        onAdd={async (p) => { await handleAdd(p); setAddOpen(false); setEditRecipeData(null) }}
                        editRecipe={editRecipeData}
                    />
                </div>
            </main>
        </div>
    )
}
