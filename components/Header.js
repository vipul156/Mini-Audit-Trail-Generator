import React from 'react'

const Header = () => {
    return (
        <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">
                Mini Audit Trail Generator
            </h1>
            <p className="text-muted-foreground text-lg">
                Track changes to your content with automatic version history and word-level diff analysis
            </p>
        </div>
    )
}

export default Header