'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { FileText, Save } from 'lucide-react'
import { useAppContext } from '@/context/AppContext'


const Editor = () => {

    const { content, setContent, versions, setError, fetchVersions } = useAppContext()
    const [saving, setSaving] = useState(false)

    const saveVersion = async () => {
        if (!content.trim()) {
            alert('Content cannot be empty')
            return
        }

        setSaving(true)
        setError(null)
        try {
            const res = await fetch('/api', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content })
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.error || 'Failed to save version')
            }

            await fetchVersions()
            // Content will be loaded from fetchVersions, so we don't clear it
        } catch (error) {
            console.error('Error saving version:', error)
            setError(error.message)
            alert('Error saving version: ' + error.message)
        } finally {
            setSaving(false)
        }
    }

    const getWordCount = (text) => {
        return text.trim().split(/\s+/).filter(Boolean).length
    }

    return (
        <Card className="shadow-lg border-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Content Editor
                </CardTitle>
                <CardDescription>
                    Enter your text and save versions to track changes
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                        {versions.length > 0 ? 'Editing latest version' : 'Create your first version'}
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setContent('')}
                        disabled={!content.trim()}
                        className="text-xs"
                    >
                        Clear
                    </Button>
                </div>
                <Textarea
                    placeholder="Start typing your content here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[300px] font-mono text-sm resize-none"
                />
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                        {getWordCount(content)} words
                    </span>
                    <Button
                        onClick={saveVersion}
                        disabled={saving || !content.trim()}
                        className="gap-2"
                    >
                        <Save className="h-4 w-4" />
                        {saving ? 'Saving...' : 'Save Version'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default Editor