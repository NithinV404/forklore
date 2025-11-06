import React from 'react'
import { Recipe } from '../api'
import RecipeCard from './RecipeCard'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type Props = {
    favorites: Recipe[]
    onDelete: (id: string) => void
    onToggleFavorite: (id: string) => void
    onView?: (r: Recipe) => void
    view?: 'grid' | 'list'
}

export default function Favorites({ favorites, onDelete, onToggleFavorite, onView, view = 'grid' }: Props) {
    if (favorites.length === 0) return <div className="text-center text-muted-foreground py-10">No saved recipes</div>

    if (view === 'list') {
        return (
            <div className="space-y-3">
                {favorites.map((r) => (
                    <Card key={r.idMeal} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onView?.(r)}>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 bg-muted rounded overflow-hidden flex-shrink-0">
                                    {r.strMealThumb ? (
                                        <img
                                            src={r.strMealThumb.startsWith('http') ? r.strMealThumb : `http://127.0.0.1:5000${r.strMealThumb}`}
                                            alt={r.strMeal}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold">{r.strMeal}</div>
                                    <div className="text-sm text-muted-foreground">{r.strCategory || ''} — {r.strArea || ''}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onToggleFavorite(r.idMeal) }}>Unsave</Button>
                                    <Button variant="destructive" size="sm" onClick={(e) => { e.stopPropagation(); onDelete(r.idMeal) }}>Delete</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((r) => (
                <RecipeCard key={r.idMeal} recipe={r} onDelete={onDelete} onToggleFavorite={onToggleFavorite} isFavorite={true} onView={onView} />
            ))}
        </div>
    )
}
