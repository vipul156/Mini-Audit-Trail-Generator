import Header from '@/components/Header'
import Editor from '@/components/Editor'
import History from '@/components/History'
import Error from '@/components/Error'

export default function AuditTrailPage() {
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <Header />

        {/* Error Banner */}
        <Error />

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Editor Section */}
          <Editor />

          {/* Version History Section */}
          <History />
        </div>
      </div>
    </div>
  )
}