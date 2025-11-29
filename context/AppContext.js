'use client'
import { useContext, createContext } from "react";
import { useState, useEffect } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const [content, setContent] = useState('')
    const [versions, setVersions] = useState([])
    const [loading, setLoading] = useState(false)
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

    return <AppContext.Provider value={{
        content,
        setContent,
        versions,
        setVersions,
        loading,
        setLoading,
        error,
        setError,
        fetchVersions
    }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);