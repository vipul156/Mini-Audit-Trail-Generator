'use client'
import React from 'react'
import { useAppContext } from '@/context/AppContext'

const Error = () => {
    const { error } = useAppContext()
    return (
        <>
            {error && (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                    {error}
                </div>
            )}
        </>
    )
}

export default Error