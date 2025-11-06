import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type Props = {
    onSearch: (value: string, type: string) => void
}

export default function SearchBar({ onSearch }: Props) {
    const [q, setQ] = useState('')
    const [type, setType] = useState<'name' | 'ingredient' | 'category' | 'area' | 'id'>('name')

    function submit(e: React.FormEvent) {
        e.preventDefault()
        onSearch(q.trim(), type)
    }

    return (
        <form onSubmit={submit} className="flex gap-2">
            <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search recipes (by name, ingredient, category...)"
                className="flex-1"
            />
            <Select value={type} onValueChange={(value) => setType(value as any)}>
                <SelectTrigger className="w-40">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="ingredient">Ingredient</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                    <SelectItem value="area">Area</SelectItem>
                    <SelectItem value="id">ID</SelectItem>
                </SelectContent>
            </Select>
            <Button type="submit">Search</Button>
        </form>
    )
}
