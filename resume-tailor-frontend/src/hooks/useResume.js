"use client"

import { useState, useEffect } from "react"

// Custom hook for resume state management
export default function useResume() {
  // State for resume data
  const [resumeData, setResumeData] = useState({
    content: "",
    format: "latex", // 'latex', 'markdown', 'plain'
    lastUpdated: null,
  })

  // State for resume history (for undo/redo)
  const [resumeHistory, setResumeHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // Load resume data from localStorage on initial render
  useEffect(() => {
    const savedResume = localStorage.getItem("resumeData")
    if (savedResume) {
      try {
        const parsedData = JSON.parse(savedResume)
        setResumeData(parsedData)

        // Initialize history with the loaded resume
        setResumeHistory([parsedData])
        setHistoryIndex(0)
      } catch (error) {
        console.error("Error parsing saved resume data:", error)
      }
    }
  }, [])

  // Save resume data to localStorage whenever it changes
  useEffect(() => {
    if (resumeData.content) {
      localStorage.setItem("resumeData", JSON.stringify(resumeData))
    }
  }, [resumeData])

  // Update resume content
  const updateResumeContent = (content) => {
    const newResumeData = {
      ...resumeData,
      content,
      lastUpdated: new Date().toISOString(),
    }

    setResumeData(newResumeData)

    // Add to history, removing any future history if we're not at the end
    const newHistory = resumeHistory.slice(0, historyIndex + 1)
    newHistory.push(newResumeData)

    // Limit history size to prevent memory issues
    if (newHistory.length > 50) {
      newHistory.shift()
    }

    setResumeHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  // Change resume format
  const changeResumeFormat = (format) => {
    const newResumeData = {
      ...resumeData,
      format,
      lastUpdated: new Date().toISOString(),
    }

    setResumeData(newResumeData)
  }

  // Undo last change
  const undoChange = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setResumeData(resumeHistory[newIndex])
    }
  }

  // Redo last undone change
  const redoChange = () => {
    if (historyIndex < resumeHistory.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setResumeData(resumeHistory[newIndex])
    }
  }

  // Clear resume data
  const clearResume = () => {
    const newResumeData = {
      content: "",
      format: resumeData.format,
      lastUpdated: new Date().toISOString(),
    }

    setResumeData(newResumeData)
    setResumeHistory([newResumeData])
    setHistoryIndex(0)
    localStorage.removeItem("resumeData")
  }

  return {
    resumeData,
    updateResumeContent,
    changeResumeFormat,
    undoChange,
    redoChange,
    clearResume,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < resumeHistory.length - 1,
  }
}
