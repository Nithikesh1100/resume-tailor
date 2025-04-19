"use client"

import { useState } from "react"
import { Github, Search, Star, GitFork, Code, ExternalLink, Plus, Check } from "lucide-react"

export default function GitHubProjects() {
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [projects, setProjects] = useState([])
  const [selectedProjects, setSelectedProjects] = useState([])
  const [error, setError] = useState("")

  // Sample GitHub projects for demo purposes
  const sampleProjects = [
    {
      id: 1,
      name: "react-dashboard",
      description: "A responsive admin dashboard built with React, Tailwind CSS, and Chart.js",
      html_url: "https://github.com/johndoe/react-dashboard",
      homepage: "https://react-dashboard-demo.vercel.app",
      language: "JavaScript",
      stargazers_count: 156,
      forks_count: 42,
      topics: ["react", "tailwindcss", "dashboard", "chartjs"],
      created_at: "2022-03-15T10:30:00Z",
      updated_at: "2023-11-20T14:22:00Z",
    },
    {
      id: 2,
      name: "nextjs-blog-template",
      description: "A feature-rich blog template built with Next.js, MDX, and Tailwind CSS",
      html_url: "https://github.com/johndoe/nextjs-blog-template",
      homepage: "https://nextjs-blog-template-demo.vercel.app",
      language: "TypeScript",
      stargazers_count: 89,
      forks_count: 23,
      topics: ["nextjs", "blog", "mdx", "tailwindcss"],
      created_at: "2022-06-22T09:15:00Z",
      updated_at: "2023-10-05T11:45:00Z",
    },
    {
      id: 3,
      name: "react-native-fitness-app",
      description: "A cross-platform fitness tracking app built with React Native and Expo",
      html_url: "https://github.com/johndoe/react-native-fitness-app",
      homepage: null,
      language: "JavaScript",
      stargazers_count: 67,
      forks_count: 18,
      topics: ["react-native", "expo", "fitness", "mobile-app"],
      created_at: "2022-09-10T15:20:00Z",
      updated_at: "2023-12-01T08:30:00Z",
    },
    {
      id: 4,
      name: "node-express-api",
      description: "A RESTful API boilerplate built with Node.js, Express, and MongoDB",
      html_url: "https://github.com/johndoe/node-express-api",
      homepage: null,
      language: "JavaScript",
      stargazers_count: 112,
      forks_count: 34,
      topics: ["nodejs", "express", "mongodb", "rest-api"],
      created_at: "2021-11-05T12:10:00Z",
      updated_at: "2023-09-18T16:40:00Z",
    },
    {
      id: 5,
      name: "python-data-analysis",
      description: "A collection of Jupyter notebooks for data analysis using Python, Pandas, and Matplotlib",
      html_url: "https://github.com/johndoe/python-data-analysis",
      homepage: null,
      language: "Python",
      stargazers_count: 78,
      forks_count: 25,
      topics: ["python", "pandas", "matplotlib", "data-analysis", "jupyter"],
      created_at: "2022-01-20T14:50:00Z",
      updated_at: "2023-08-12T09:25:00Z",
    },
  ]

  // Mock function to fetch GitHub projects
  const fetchProjects = () => {
    setIsLoading(true)
    setError("")

    // Simulate API call delay
    setTimeout(() => {
      if (username.trim() === "") {
        setError("Please enter a GitHub username")
        setProjects([])
      } else if (username.toLowerCase() === "error") {
        setError("User not found or API rate limit exceeded")
        setProjects([])
      } else {
        setProjects(sampleProjects)
      }

      setIsLoading(false)
    }, 1500)
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

  return (
    <div className="space-y-8">
      {/* GitHub Username Input */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-grow space-y-2">
            <label htmlFor="github-username" className="text-sm font-medium">
              GitHub Username or API Key
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
        {error && <div className="p-4 rounded-md bg-destructive/10 text-destructive">{error}</div>}
      </div>

      {/* Projects List */}
      {projects.length > 0 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Found {projects.length} repositories</h2>
            <button
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
                  {project.topics.map((topic, index) => (
                    <span key={index} className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                      {topic}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4" />
                      <span>{project.stargazers_count}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GitFork className="h-4 w-4" />
                      <span>{project.forks_count}</span>
                    </div>
                    <div>Updated {formatDate(project.updated_at)}</div>
                  </div>
                  <div className="flex space-x-2">
                    <a
                      href={project.html_url}
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
