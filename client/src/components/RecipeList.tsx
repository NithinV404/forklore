import React from 'react'
import { Recipe } from '../api'
import RecipeCard from './RecipeCard'

type Props = {
    recipes: Recipe[]
    onDelete: (id: string) => void
    onToggleFavorite?: (id: string) => void
    favorites?: string[]
    onView?: (r: Recipe) => void
}

export default function RecipeList({ recipes, onDelete, onToggleFavorite, favorites = [], onView }: Props) {
    if (recipes.length === 0) return <div className="text-center text-gray-500 py-10">No recipes yet</div>
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recipes.map((r) => (
                <RecipeCard key={r.idMeal} recipe={r} onDelete={onDelete} onToggleFavorite={onToggleFavorite} isFavorite={favorites.includes(r.idMeal)} onView={onView} />
            ))}
        </div>
    )
}
