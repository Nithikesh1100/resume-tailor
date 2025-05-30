"use client"

import { useState, useEffect } from "react"
import {
  Github,
  Search,
  Star,
  GitFork,
  Code,
  ExternalLink,
  Plus,
  Check,
  AlertTriangle,
  Loader2,
  Award,
} from "lucide-react"
import { fetchGitHubProjects } from "../services/api"

export default function GitHubProjects() {
  const [username, setUsername] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [projects, setProjects] = useState([])
  const [selectedProjects, setSelectedProjects] = useState([])
  const [error, setError] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [usingMockData, setUsingMockData] = useState(false)
  const [addingToResume, setAddingToResume] = useState(false)
  const [showApiKeyInput, setShowApiKeyInput] = useState(false)
  const [addingProjectId, setAddingProjectId] = useState(null)
  const [recommendedProjects, setRecommendedProjects] = useState([])

  // Load GitHub token from localStorage on component mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem("github_api_key") || ""
    setApiKey(storedApiKey)
    setShowApiKeyInput(!storedApiKey)
  }, [])

  // Function to fetch GitHub projects
  const fetchProjects = async () => {
    setIsLoading(true)
    setError("")
    setUsingMockData(false)
    setProjects([])
    setRecommendedProjects([])

    try {
      if (username.trim() === "") {
        throw new Error("Please enter a GitHub username")
      }

      console.log(`Fetching GitHub projects for username: ${username}`)
      console.log(`Job description provided: ${jobDescription ? "Yes" : "No"}`)
      console.log(`GitHub token provided: ${apiKey ? "Yes" : "No"}`)

      // Call the backend API
      const response = await fetchGitHubProjects(username, jobDescription, apiKey)

      console.log("GitHub API Response:", response)

      if (!response || !response.repositories || response.repositories.length === 0) {
        setError("No repositories found for this username")
        setProjects([])
      } else {
        setProjects(response.repositories || [])

        // Identify recommended projects based on relevance score or other criteria
        if (jobDescription) {
          // If job description is provided, recommend projects with high relevance score
          const recommended = response.repositories
            .filter((project) => project.relevanceScore > 60) // Threshold for recommendation
            .map((project) => project.id)
          setRecommendedProjects(recommended)
        } else {
          // If no job description, recommend projects with most stars or recent activity
          const topProjects = [...response.repositories]
            .sort((a, b) => b.stars - a.stars)
            .slice(0, 3)
            .map((project) => project.id)
          setRecommendedProjects(topProjects)
        }
      }
    } catch (err) {
      console.error("Error fetching GitHub projects:", err)
      setError(err.message || "Failed to fetch GitHub projects. Please try again.")
      setProjects([])
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

  // Add a single project to resume
  const addProjectToResume = async (projectId) => {
    setAddingProjectId(projectId)

    try {
      // Get project details
      const project = projects.find((p) => p.id === projectId)
      if (!project) return

      // Format project for resume
      const formattedProject = {
        name: project.name,
        description: project.description,
        url: project.htmlUrl,
        technologies: project.topics || [],
        relevanceScore: project.relevanceScore || 0,
      }

      // Store in localStorage to be used in resume editor
      const existingProjects = JSON.parse(localStorage.getItem("githubProjects") || "[]")

      // Check if project already exists
      const projectExists = existingProjects.some((p) => p.url === formattedProject.url)

      if (!projectExists) {
        const updatedProjects = [...existingProjects, formattedProject]
        localStorage.setItem("githubProjects", JSON.stringify(updatedProjects))

        // Show success message
        alert(`Project "${project.name}" added to your resume!`)
      } else {
        alert(`Project "${project.name}" is already in your resume.`)
      }

      // Add to selected projects for UI state
      if (!selectedProjects.includes(projectId)) {
        setSelectedProjects([...selectedProjects, projectId])
      }
    } catch (err) {
      console.error("Error adding project to resume:", err)
      alert("Failed to add project to resume. Please try again.")
    } finally {
      setAddingProjectId(null)
    }
  }

  // Add selected projects to resume
  const addProjectsToResume = async () => {
    if (selectedProjects.length === 0) return

    setAddingToResume(true)

    try {
      // Get selected project details
      const projectsToAdd = projects.filter((project) => selectedProjects.includes(project.id))

      // Format projects for resume
      const formattedProjects = projectsToAdd.map((project) => ({
        name: project.name,
        description: project.description,
        url: project.htmlUrl,
        technologies: project.topics || [],
        relevanceScore: project.relevanceScore || 0,
      }))

      // Store in localStorage to be used in resume editor
      const existingProjects = JSON.parse(localStorage.getItem("githubProjects") || "[]")

      // Filter out duplicates
      const newProjects = formattedProjects.filter(
        (newProject) => !existingProjects.some((existingProject) => existingProject.url === newProject.url),
      )

      const combinedProjects = [...existingProjects, ...newProjects]
      localStorage.setItem("githubProjects", JSON.stringify(combinedProjects))

      alert(`${newProjects.length} projects added to your resume! You can now include them in your resume editor.`)
    } catch (err) {
      console.error("Error saving projects:", err)
      alert("Failed to save projects. Please try again.")
    } finally {
      setAddingToResume(false)
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
                <Loader2 className="h-5 w-5 animate-spin" />
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

        {/* GitHub API Key input (shown only if not available in settings) */}
        {showApiKeyInput && (
          <div className="space-y-2">
            <label htmlFor="github-api-key" className="text-sm font-medium">
              GitHub Personal Access Token (Optional)
            </label>
            <div className="flex flex-col">
              <input
                id="github-api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="ghp_..."
                className="w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <p className="text-xs text-muted-foreground mt-1">
                A token allows access to private repositories and increases API rate limits.
                <a
                  href="https://github.com/settings/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-primary hover:underline"
                >
                  Create a token
                </a>
              </p>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-4 rounded-md bg-yellow-50 border border-yellow-200 flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-yellow-700">{error}</p>
              {usingMockData && (
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
              disabled={selectedProjects.length === 0 || addingToResume}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addingToResume ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  <span>Add to Resume ({selectedProjects.length})</span>
                </>
              )}
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
                        {project.language || "Unknown"}
                      </span>

                      {/* Recommended badge */}
                      {recommendedProjects.includes(project.id) && (
                        <span className="flex items-center px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          <Award className="h-3 w-3 mr-1" />
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground">{project.description || "No description available"}</p>
                  </div>
                  <button
                    onClick={() => addProjectToResume(project.id)}
                    disabled={addingProjectId === project.id}
                    className={`p-2 rounded-full ${
                      selectedProjects.includes(project.id)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {addingProjectId === project.id ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : selectedProjects.includes(project.id) ? (
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
                  {(!project.topics || project.topics.length === 0) && (
                    <span className="text-xs text-muted-foreground">No topics available</span>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4" />
                      <span>{project.stars || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GitFork className="h-4 w-4" />
                      <span>{project.forks || 0}</span>
                    </div>
                    <div>Updated {formatDate(project.updatedAt || new Date())}</div>
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

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <h3 className="text-lg font-medium mt-4">Fetching repositories...</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            This may take a moment depending on the number of repositories.
          </p>
        </div>
      )}
    </div>
  )
}
