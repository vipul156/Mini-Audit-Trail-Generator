'use client'
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, FileText } from 'lucide-react'
import { useAppContext } from '@/context/AppContext'
import Summary from './Summary'
import AddedWords from './AddedWords'
import RemovedWords from './RemovedWords'


const History = () => {
    const { versions, loading } = useAppContext()

    const formatDate = (timestamp) => {
        const date = new Date(timestamp)
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <Card className="shadow-lg border-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Version History
                </CardTitle>
                <CardDescription>
                    {versions.length} version{versions.length !== 1 ? 's' : ''} saved
                </CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="text-center text-muted-foreground py-8">
                        <div className="animate-pulse">Loading versions...</div>
                    </div>
                ) : versions.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                        <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No versions yet. Save your first version to get started.</p>
                    </div>
                ) : (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                        {versions.map((version, index) => (
                            <div
                                key={version.id}
                                className="p-4 rounded-lg border-2 bg-card hover:bg-accent/50 transition-colors"
                            >
                                {/* Version Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="font-mono font-semibold">
                                            v{versions.length - index}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDate(version.timestamp)}
                                        </span>
                                    </div>
                                </div>

                                {/* Changes Summary */}
                                <Summary summary={version.summary} />

                                {/* Word Changes */}
                                <div className="space-y-2">
                                    {version.addedWords && version.addedWords.length > 0 && (
                                        <AddedWords addedWords={version.addedWords} />
                                    )}

                                    {version.removedWords && version.removedWords.length > 0 && (
                                        <RemovedWords removedWords={version.removedWords} />
                                    )}

                                    {(!version.addedWords || version.addedWords.length === 0) &&
                                        (!version.removedWords || version.removedWords.length === 0) && (
                                            <div className="text-sm text-muted-foreground italic">
                                                Initial version or no changes detected
                                            </div>
                                        )}
                                </div>

                                {/* Content Preview */}
                                <div className="mt-3 pt-3 border-t">
                                    <details className="text-xs">
                                        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                                            View content
                                        </summary>
                                        <div className="mt-2 p-2 bg-muted/30 rounded font-mono text-xs max-h-32 overflow-y-auto">
                                            {version.content}
                                        </div>
                                    </details>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default History