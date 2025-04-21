"use client"

import { useState } from "react"
import { Github, Search, Star, GitFork, Code, ExternalLink, Plus, Check, AlertTriangle } from "lucide-react"
import { fetchGitHubProjects, mockData } from "../services/api"

export default function GitHubProjects() {
  const [username, setUsername] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [projects, setProjects] = useState([])
  const [selectedProjects, setSelectedProjects] = useState([])
  const [error, setError] = useState("")

  // Function to fetch GitHub projects
  const fetchProjects = async () => {
    setIsLoading(true)
    setError("")

    try {
      if (username.trim() === "") {
        throw new Error("Please enter a GitHub username")
      }

      // Call the backend API
      const response = await fetchGitHubProjects(username, jobDescription)
      setProjects(response.repositories || [])
    } catch (err) {
      console.error("Error fetching GitHub projects:", err)
      setError(err.message || "Failed to fetch GitHub projects. Please try again.")

      // For demo purposes, use mock data if backend is not available
      if (err.message.includes("Failed to fetch") || err.message.includes("Network Error")) {
        console.log("Using mock data for demo")
        setProjects(mockData.githubResponse.repositories || [])
        setError("Using sample data (backend not available)")
      } else if (username.toLowerCase() === "error") {
        setError("User not found or API rate limit exceeded")
        setProjects([])
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle project selection
  const toggleProjectSelection = (projectId) => {
    if (selectedProjects.includes(projectId)) {
      setSelectedProjects(selectedProjects.filter((id) => id !== projectId))
    } else {
      setSelectedProjects([...selectedProjects, projectId])
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  // Add selected projects to resume
  const addProjectsToResume = () => {
    if (selectedProjects.length === 0) return

    // Get selected project details
    const projectsToAdd = projects.filter((project) => selectedProjects.includes(project.id))

    // Store in localStorage to be used in resume editor
    try {
      const existingProjects = JSON.parse(localStorage.getItem("githubProjects") || "[]")
      const combinedProjects = [...existingProjects, ...projectsToAdd]
      localStorage.setItem("githubProjects", JSON.stringify(combinedProjects))

      alert(`${selectedProjects.length} projects added to your resume! You can now include them in your resume editor.`)
      setSelectedProjects([])
    } catch (err) {
      console.error("Error saving projects:", err)
      alert("Failed to save projects. Please try again.")
    }
  }

  return (
    <div className="space-y-8">
      {/* GitHub Username Input */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-grow space-y-2">
            <label htmlFor="github-username" className="text-sm font-medium">
              GitHub Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Github className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                id="github-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter GitHub username"
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          <div className="flex-grow space-y-2">
            <label htmlFor="job-description" className="text-sm font-medium">
              Job Description (Optional)
            </label>
            <input
              id="job-description"
              type="text"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Optional job description for relevance filtering"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button
            onClick={fetchProjects}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Search className="h-5 w-5 animate-pulse" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                <span>Search Projects</span>
              </>
            )}
          </button>
        </div>

        {/* For demo purposes */}
        <p className="text-sm text-muted-foreground">
          Try "johndoe" for sample projects or "error" to simulate an error.
        </p>

        {/* Error message */}
        {error && (
          <div className="p-4 rounded-md bg-yellow-50 border border-yellow-200 flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-yellow-700">{error}</p>
              {error.includes("sample data") && (
                <p className="text-xs text-yellow-600 mt-1">Results shown are sample data for demonstration.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Projects List */}
      {projects.length > 0 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Found {projects.length} repositories</h2>
            <button
              onClick={addProjectsToResume}
              disabled={selectedProjects.length === 0}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-5 w-5" />
              <span>Add to Resume ({selectedProjects.length})</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`border rounded-lg p-5 transition-colors ${
                  selectedProjects.includes(project.id) ? "border-primary bg-primary/5" : "hover:border-primary/50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold">{project.name}</h3>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground">
                        {project.language}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{project.description}</p>
                  </div>
                  <button
                    onClick={() => toggleProjectSelection(project.id)}
                    className={`p-2 rounded-full ${
                      selectedProjects.includes(project.id)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {selectedProjects.includes(project.id) ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Plus className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.topics?.map((topic, index) => (
                    <span key={index} className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                      {topic}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4" />
                      <span>{project.stars}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GitFork className="h-4 w-4" />
                      <span>{project.forks}</span>
                    </div>
                    <div>Updated {formatDate(project.updatedAt)}</div>
                  </div>
                  <div className="flex space-x-2">
                    <a
                      href={project.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded-md hover:bg-muted transition-colors"
                      title="View on GitHub"
                    >
                      <Code className="h-4 w-4" />
                    </a>
                    {project.homepage && (
                      <a
                        href={project.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded-md hover:bg-muted transition-colors"
                        title="View live demo"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>

                {project.relevanceScore > 0 && (
                  <div className="mt-2 pt-2 border-t border-border">
                    <div className="flex items-center">
                      <span className="text-xs text-muted-foreground mr-2">Relevance:</span>
                      <div className="flex-1 bg-muted h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${Math.min(100, Math.floor(project.relevanceScore))}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && projects.length === 0 && !error && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Github className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No GitHub projects found</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Enter your GitHub username to fetch your repositories and add them to your resume.
          </p>
        </div>
      )}
    </div>
  )
}
