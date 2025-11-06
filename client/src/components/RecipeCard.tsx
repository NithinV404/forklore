import React from 'react'
import { Recipe } from '../api'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type Props = {
    recipe: Recipe
    onDelete: (id: string) => void
    onToggleFavorite?: (id: string) => void
    isFavorite?: boolean
    onView?: (r: Recipe) => void
}

export default function RecipeCard({ recipe, onDelete, onToggleFavorite, isFavorite, onView }: Props) {
    const thumb = recipe.strMealThumb || recipe.strMealThumb || ''
    const title = recipe.strMeal || 'Untitled'
    return (
        <Card
            role="button"
            tabIndex={0}
            onClick={() => onView?.(recipe)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onView?.(recipe) }}
            className="cursor-pointer hover:shadow-lg transition-shadow"
        >
            <CardHeader className="p-0">
                {thumb ? (
                    <img src={thumb.startsWith('http') ? thumb : `http://127.0.0.1:5000${thumb}`} alt={title} className="w-full h-48 object-cover rounded-t-lg" />
                ) : (
                    <div className="w-full h-48 bg-muted flex items-center justify-center text-muted-foreground rounded-t-lg">No Image</div>
                )}
            </CardHeader>

            <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <div className="flex items-center justify-between mb-3 text-sm text-muted-foreground">
                    <span>{recipe.strCategory || '—'}</span>
                    <span>{recipe.strArea || ''}</span>
                </div>

                {recipe.strInstructions && <p className="text-sm mb-3 line-clamp-4">{recipe.strInstructions}</p>}

                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        {onToggleFavorite && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(recipe.idMeal) }}
                                aria-label={isFavorite ? 'Unsave recipe' : 'Save recipe'}
                            >
                                {isFavorite ? (
                                    <AiFillHeart className="h-4 w-4 text-red-500" />
                                ) : (
                                    <AiOutlineHeart className="h-4 w-4" />
                                )}
                            </Button>
                        )}
                    </div>

                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); onDelete(recipe.idMeal) }}
                    >
                        Delete
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
