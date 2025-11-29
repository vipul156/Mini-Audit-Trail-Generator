'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Clock, Plus, Minus, FileText, Save, TrendingUp, TrendingDown } from 'lucide-react'

export default function AuditTrailPage() {
  const [content, setContent] = useState('')
  const [versions, setVersions] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  // Fetch versions on mount
  useEffect(() => {
    fetchVersions()
  }, [])

  const fetchVersions = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api?limit=50&sort=desc')
      
      if (!res.ok) {
        throw new Error('Failed to fetch versions')
      }
      
      const data = await res.json()
      setVersions(data.versions || [])
      
      // Load the latest version content into the editor
      if (data.versions && data.versions.length > 0) {
        setContent(data.versions[0].content)
      }
    } catch (error) {
      console.error('Error fetching versions:', error)
      setError('Failed to load versions')
    } finally {
      setLoading(false)
    }
  }

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

  const getWordCount = (text) => {
    return text.trim().split(/\s+/).filter(Boolean).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">
            Mini Audit Trail Generator
          </h1>
          <p className="text-muted-foreground text-lg">
            Track changes to your content with automatic version history and word-level diff analysis
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Editor Section */}
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

          {/* Version History Section */}
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
                      {version.summary && (
                        <div className="mb-3 p-2 bg-muted/50 rounded text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Word Count:</span>
                            <span className="font-medium">
                              {version.summary.previousWordCount} → {version.summary.currentWordCount}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Net Change:</span>
                            <span className={`font-medium flex items-center gap-1 ${
                              version.summary.netWordChange > 0 ? 'text-green-600 dark:text-green-400' : 
                              version.summary.netWordChange < 0 ? 'text-red-600 dark:text-red-400' : ''
                            }`}>
                              {version.summary.netWordChange > 0 && <TrendingUp className="h-3 w-3" />}
                              {version.summary.netWordChange < 0 && <TrendingDown className="h-3 w-3" />}
                              {version.summary.netWordChange > 0 ? '+' : ''}{version.summary.netWordChange} words
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Word Changes */}
                      <div className="space-y-2">
                        {version.addedWords && version.addedWords.length > 0 && (
                          <div className="flex items-start gap-2 text-sm">
                            <Plus className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <span className="text-muted-foreground">Added ({version.addedWords.length}):</span>{' '}
                              <span className="text-green-700 dark:text-green-300 font-medium">
                                {version.addedWords.slice(0, 10).join(', ')}
                                {version.addedWords.length > 10 && ` ... +${version.addedWords.length - 10} more`}
                              </span>
                            </div>
                          </div>
                        )}

                        {version.removedWords && version.removedWords.length > 0 && (
                          <div className="flex items-start gap-2 text-sm">
                            <Minus className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <span className="text-muted-foreground">Removed ({version.removedWords.length}):</span>{' '}
                              <span className="text-red-700 dark:text-red-300 font-medium">
                                {version.removedWords.slice(0, 10).join(', ')}
                                {version.removedWords.length > 10 && ` ... +${version.removedWords.length - 10} more`}
                              </span>
                            </div>
                          </div>
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
        </div>
      </div>
    </div>
  )
}