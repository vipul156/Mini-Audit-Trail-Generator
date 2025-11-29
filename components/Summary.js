import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

const Summary = ({ summary }) => {
    return (
        <div className="mb-3 p-2 bg-muted/50 rounded text-xs space-y-1">
            <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Word Count:</span>
                <span className="font-medium">
                    {summary.previousWordCount} → {summary.currentWordCount}
                </span>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Net Change:</span>
                <span className={`font-medium flex items-center gap-1 ${summary.netWordChange > 0 ? 'text-green-600 dark:text-green-400' :
                    summary.netWordChange < 0 ? 'text-red-600 dark:text-red-400' : ''
                    }`}>
                    {summary.netWordChange > 0 && <TrendingUp className="h-3 w-3" />}
                    {summary.netWordChange < 0 && <TrendingDown className="h-3 w-3" />}
                    {summary.netWordChange > 0 ? '+' : ''}{summary.netWordChange} words
                </span>
            </div>
        </div>
    )
}

export default Summary