import React from 'react'
import { Minus } from 'lucide-react'

const RemovedWords = ({ removedWords }) => {
    return (
        <div className="flex items-start gap-2 text-sm">
            <Minus className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
                <span className="text-muted-foreground">Removed ({removedWords.length}):</span>{' '}
                <span className="text-red-700 dark:text-red-300 font-medium">
                    {removedWords.slice(0, 10).join(', ')}
                    {removedWords.length > 10 && ` ... +${removedWords.length - 10} more`}
                </span>
            </div>
        </div>
    )
}

export default RemovedWords