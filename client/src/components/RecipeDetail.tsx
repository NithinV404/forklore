import React from 'react'
import { Recipe } from '../api'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FiEdit } from 'react-icons/fi'

type Props = {
    recipe: Recipe | null
    onClose: () => void
    onEdit?: (recipe: Recipe) => void
}

export default function RecipeDetail({ recipe, onClose, onEdit }: Props) {
    if (!recipe) return null

    // Helper function to extract YouTube video ID
    const getYouTubeVideoId = (url: string) => {
        const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        return match ? match[1] : '';
    }

    const ingredients: string[] = []
    for (let i = 1; i <= 20; i++) {
        const ing = recipe[`strIngredient${i}`]
        const measure = recipe[`strMeasure${i}`]
        if (ing) ingredients.push(`${measure ?? ''} ${ing}`.trim())
    }

    return (
        <Dialog open={!!recipe} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto pt-6">
                {/* Floating close button */}
                <DialogClose asChild>
                    <button
                        className="absolute top-2 right-2 z-[110] w-8 h-8 rounded-sm opacity-70 hover:opacity-100 flex items-center justify-center text-muted-foreground hover:text-foreground transition-opacity"
                        aria-label="Close dialog"
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                </DialogClose>
                <DialogHeader>
                    <div className="flex items-center gap-4">
                        <DialogTitle className="flex-1">{recipe.strMeal}</DialogTitle>
                    </div>
                    <DialogDescription>
                        View detailed recipe information including ingredients, instructions, and additional resources.
                    </DialogDescription>
                </DialogHeader>

                <div className="relative">
                    {recipe.strMealThumb && (
                        <img
                            src={recipe.strMealThumb}
                            alt={recipe.strMeal}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                    )}
                    {onEdit && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(recipe)}
                            className="absolute bottom-6 right-4 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                        >
                            <FiEdit className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                    )}
                </div>

                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold">Category</h3>
                        <p className="text-muted-foreground">{recipe.strCategory} — {recipe.strArea}</p>
                    </div>

                    {recipe.strTags && (
                        <div>
                            <h3 className="font-semibold">Tags</h3>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {recipe.strTags.split(',').map((tag, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                                        {tag.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <h3 className="font-semibold">Ingredients</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                            {ingredients.map((ing, idx) => {
                                const ingredientName = recipe[`strIngredient${idx + 1}`]
                                const measure = recipe[`strMeasure${idx + 1}`]
                                const imageUrl = ingredientName ? `https://www.themealdb.com/images/ingredients/${encodeURIComponent(ingredientName)}-small.png` : null

                                return (
                                    <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                                        {imageUrl && (
                                            <img
                                                src={imageUrl}
                                                alt={ingredientName}
                                                className="w-8 h-8 object-cover rounded"
                                                onError={(e) => {
                                                    // Hide image if it fails to load
                                                    e.currentTarget.style.display = 'none'
                                                }}
                                            />
                                        )}
                                        <span className="text-sm">{ing}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold">Instructions</h3>
                        <p className="whitespace-pre-wrap text-sm">{recipe.strInstructions}</p>
                    </div>

                    {recipe.strYoutube && (
                        <div>
                            <h3 className="font-semibold mb-2">Video Tutorial</h3>
                            <div className="bg-muted/50 rounded-lg p-4">
                                <a
                                    href={recipe.strYoutube}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                >
                                    Watch on YouTube
                                </a>
                            </div>
                        </div>
                    )}

                    {recipe.strSource && (
                        <div>
                            <h3 className="font-semibold mb-2">Original Source</h3>
                            <div className="bg-muted/50 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <span className="text-primary font-semibold text-sm">📄</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Recipe Article</p>
                                        <a
                                            href={recipe.strSource}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline text-sm"
                                        >
                                            {recipe.strSource}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
