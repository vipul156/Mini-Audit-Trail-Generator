// app/api/route.js
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import connectDB from '@/db/connectDB'
import Version from '@/model/Version'



function extractWords(text) {
  if (!text) return []
  const matches = text.match(/\b[\w]+\b/g) || []
  return matches
}

function createFrequencyMap(words) {
  const map = new Map()
  words.forEach(word => {
    const lowerWord = word.toLowerCase()
    map.set(lowerWord, (map.get(lowerWord) || 0) + 1)
  })
  return map
}

function calculateDiff(previousContent, newContent) {
  const previousWords = extractWords(previousContent)
  const newWords = extractWords(newContent)

  const previousFreq = createFrequencyMap(previousWords)
  const newFreq = createFrequencyMap(newWords)

  // Find added words (in new but not in previous, or increased frequency)
  const addedWords = []
  newFreq.forEach((count, word) => {
    const previousCount = previousFreq.get(word) || 0
    const timesToAdd = count - previousCount
    for (let i = 0; i < timesToAdd; i++) {
      addedWords.push(word)
    }
  })

  // Find removed words (in previous but not in new, or decreased frequency)
  const removedWords = []
  previousFreq.forEach((count, word) => {
    const newCount = newFreq.get(word) || 0
    const timesToRemove = count - newCount
    for (let i = 0; i < timesToRemove; i++) {
      removedWords.push(word)
    }
  })

  return {
    addedWords,
    removedWords,
    oldLength: previousWords.length,
    newLength: newWords.length
  }
}

function generateSummary(diff) {
  const { addedWords, removedWords, oldLength, newLength } = diff

  return {
    totalWordsAdded: addedWords.length,
    totalWordsRemoved: removedWords.length,
    netWordChange: addedWords.length - removedWords.length,
    previousWordCount: oldLength,
    currentWordCount: newLength,
    changePercentage: oldLength > 0 
      ? Math.round(((newLength - oldLength) / oldLength) * 100) 
      : 100,
    uniqueWordsAdded: [...new Set(addedWords)].length,
    uniqueWordsRemoved: [...new Set(removedWords)].length
  }
}


export async function POST(request) {
  try {
    // Connect to database
    await connectDB()

    // Parse request body
    const body = await request.json()
    const { content } = body

    // Validate input
    if (content === undefined || content === null) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    // Get the most recent version to compare
    const previousVersion = await Version
      .findOne()
      .sort({ timestamp: -1 })
      .lean()
      .exec()

    const previousContent = previousVersion?.content || ''
    
    // Calculate diff using custom algorithm
    const diff = calculateDiff(previousContent, content)
    
    // Generate summary
    const summary = generateSummary(diff)

    // Create new version document
    const versionData = {
      id: uuidv4(),
      content: content,
      timestamp: Date.now(),
      addedWords: diff.addedWords,
      removedWords: diff.removedWords,
      oldLength: diff.oldLength,
      newLength: diff.newLength,
      summary: summary
    }

    // Save to database
    const savedVersion = await Version.create(versionData)

    // Return response
    return NextResponse.json({
      id: savedVersion.id,
      content: savedVersion.content,
      timestamp: savedVersion.timestamp,
      addedWords: savedVersion.addedWords,
      removedWords: savedVersion.removedWords,
      oldLength: savedVersion.oldLength,
      newLength: savedVersion.newLength,
      summary: savedVersion.summary
    }, { status: 201 })

  } catch (error) {
    console.error('❌ POST Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to save version', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}


export async function GET(request) {
  try {
    // Connect to database
    await connectDB()

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit')) || 50
    const skip = parseInt(searchParams.get('skip')) || 0
    const sortOrder = searchParams.get('sort') === 'asc' ? 1 : -1

    // Fetch versions from database
    const versions = await Version
      .find()
      .sort({ timestamp: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec()

    // Get total count for pagination
    const totalCount = await Version.countDocuments()

    // Format response
    const formattedVersions = versions.map(version => ({
      id: version.id,
      content: version.content,
      timestamp: version.timestamp,
      addedWords: version.addedWords || [],
      removedWords: version.removedWords || [],
      oldLength: version.oldLength || 0,
      newLength: version.newLength || 0,
      summary: version.summary || {
        totalWordsAdded: version.addedWords?.length || 0,
        totalWordsRemoved: version.removedWords?.length || 0,
        netWordChange: (version.addedWords?.length || 0) - (version.removedWords?.length || 0),
        previousWordCount: version.oldLength || 0,
        currentWordCount: version.newLength || 0
      }
    }))

    return NextResponse.json({
      versions: formattedVersions,
      pagination: {
        total: totalCount,
        limit,
        skip,
        hasMore: skip + limit < totalCount
      }
    })

  } catch (error) {
    console.error('❌ GET Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch versions', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}