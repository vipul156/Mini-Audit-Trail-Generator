import React from 'react'
import { Plus } from 'lucide-react'

const AddedWords = ({ addedWords }) => {
    return (
        <div className="flex items-start gap-2 text-sm">
            <Plus className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
                <span className="text-muted-foreground">Added ({addedWords.length}):</span>{' '}
                <span className="text-green-700 dark:text-green-300 font-medium">
                    {addedWords.slice(0, 10).join(', ')}
                    {addedWords.length > 10 && ` ... +${addedWords.length - 10} more`}
                </span>
            </div>
        </div>
    )
}

export default AddedWords