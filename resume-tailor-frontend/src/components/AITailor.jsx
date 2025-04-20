"use client"

import { useState } from "react"
import { Sparkles, FileText, ArrowRight, Check, X, AlertTriangle } from "lucide-react"
import { tailorResume, mockData } from "../services/api"

export default function AITailor() {
  const [resumeText, setResumeText] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState(null)
  const [activeTab, setActiveTab] = useState("suggestions")
  const [error, setError] = useState(null)
  const [apiKey, setApiKey] = useState("")

  // Sample resume for demo purposes
  const sampleResume = `John Doe
Software Engineer

SUMMARY
Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable applications and optimizing performance.

SKILLS
Programming Languages: JavaScript, TypeScript, Python, Java
Frontend: React, Redux, HTML5, CSS3, Tailwind CSS
Backend: Node.js, Express, Django, Spring Boot
Databases: MongoDB, PostgreSQL, MySQL, Redis
DevOps: Docker, Kubernetes, AWS, CI/CD, Git
Other: RESTful APIs, GraphQL, Microservices, Agile/Scrum

EXPERIENCE
Senior Software Engineer | Tech Innovations Inc., San Francisco, CA | Jan 2021 - Present
- Led development of a microservices architecture that improved system reliability by 40%
- Implemented CI/CD pipelines reducing deployment time by 60%
- Mentored junior developers and conducted code reviews to ensure code quality
- Optimized database queries resulting in 30% faster application response time

Software Engineer | Digital Solutions LLC, Boston, MA | Mar 2018 - Dec 2020
- Developed responsive web applications using React and Redux
- Created RESTful APIs with Node.js and Express
- Collaborated with UX/UI designers to implement user-friendly interfaces
- Participated in Agile development cycles and sprint planning`

  // Sample job description for demo purposes
  const sampleJobDescription = `Senior Frontend Developer

We are looking for a Senior Frontend Developer to join our growing team. The ideal candidate will have strong experience with modern JavaScript frameworks, particularly React, and a passion for building exceptional user experiences.

Responsibilities:
- Develop and maintain responsive web applications using React and Next.js
- Collaborate with designers to implement UI/UX designs
- Write clean, maintainable, and efficient code
- Optimize applications for maximum speed and scalability
- Participate in code reviews and mentor junior developers

Requirements:
- 5+ years of experience in frontend development
- Expert knowledge of React, Redux, and modern JavaScript (ES6+)
- Experience with Next.js and server-side rendering
- Proficiency in HTML5, CSS3, and responsive design
- Experience with testing frameworks like Jest and React Testing Library
- Knowledge of performance optimization techniques
- Familiarity with CI/CD pipelines and Git workflow
- Strong problem-solving skills and attention to detail
- Excellent communication and teamwork abilities

Nice to have:
- Experience with TypeScript
- Knowledge of GraphQL
- Experience with UI component libraries
- Understanding of accessibility standards
- Experience with Agile development methodologies`

  // Function to analyze resume against job description
  const analyzeResume = async () => {
    setIsAnalyzing(true)
    setError(null)

    try {
      // First, check if API key is available from localStorage
      const storedApiKey = localStorage.getItem("openai_api_key") || apiKey

      if (!storedApiKey) {
        throw new Error("OpenAI API key is required. Please add it in the Settings page.")
      }

      // Call the backend API
      const response = await tailorResume(resumeText, jobDescription, storedApiKey)
      setResults(response)
    } catch (err) {
      console.error("Error analyzing resume:", err)
      setError(err.message || "Failed to analyze resume. Please try again.")

      // For demo purposes, use mock data if backend is not available
      if (err.message.includes("Failed to fetch") || err.message.includes("Network Error")) {
        console.log("Using mock data for demo")
        setResults(mockData.tailorResponse)
        setError("Using sample data (backend not available)")
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Load sample data
  const loadSampleData = () => {
    setResumeText(sampleResume)
    setJobDescription(sampleJobDescription)
  }

  return (
    <div className="space-y-8">
      {!results ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resume Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Your Resume</h2>
                <button onClick={loadSampleData} className="text-sm text-primary hover:underline">
                  Load Sample Data
                </button>
              </div>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume text here..."
                className="w-full h-[400px] p-4 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Job Description Input */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Job Description</h2>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full h-[400px] p-4 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* API Key input (shown only if not available in settings) */}
          {!localStorage.getItem("openai_api_key") && (
            <div className="space-y-2">
              <label htmlFor="api-key" className="text-sm font-medium">
                OpenAI API Key <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col">
                <input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your API key is used only for this request and not stored on our server. You can also set this in the
                  Settings page.
                </p>
              </div>
            </div>
          )}

          {/* Analyze Button */}
          <div className="flex justify-center">
            <button
              onClick={analyzeResume}
              disabled={!resumeText || !jobDescription || isAnalyzing}
              className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="h-5 w-5 animate-pulse" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Analyze Resume</span>
                </>
              )}
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          {/* Results Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Analysis Results</h2>
            <button onClick={() => setResults(null)} className="text-sm text-primary hover:underline">
              Start New Analysis
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-md bg-yellow-50 border border-yellow-200 flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-yellow-700">{error}</p>
                <p className="text-xs text-yellow-600 mt-1">Results shown are sample data for demonstration.</p>
              </div>
            </div>
          )}

          {/* Match Score */}
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <svg className="w-24 h-24">
                    <circle
                      className="text-muted"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="40"
                      cx="48"
                      cy="48"
                    />
                    <circle
                      className="text-primary"
                      strokeWidth="8"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 * (1 - results.matchScore / 100)}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="40"
                      cx="48"
                      cy="48"
                    />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">
                    {results.matchScore}%
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Resume Match Score</h3>
                  <p className="text-muted-foreground">
                    Your resume matches {results.matchScore}% of the job requirements
                  </p>
                </div>
              </div>
              <div className="mt-4 md:mt-0 text-center md:text-right">
                <div className="text-sm font-medium">
                  Keyword Match: {results.keywordsMatched?.length || 0} keywords matched
                </div>
                <div className="text-xs text-muted-foreground">
                  {results.keywordsMissing?.length || 0} missing keywords
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b">
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveTab("suggestions")}
                className={`pb-2 font-medium ${
                  activeTab === "suggestions"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Improvement Suggestions
              </button>
              <button
                onClick={() => setActiveTab("keywords")}
                className={`pb-2 font-medium ${
                  activeTab === "keywords"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Keywords Analysis
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "suggestions" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Suggested Improvements</h3>
              <div className="space-y-4">
                {results.suggestions.map((suggestion, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div className="bg-muted p-4">
                      <div className="flex items-start space-x-2">
                        <X className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium">Original Text:</div>
                          <p className="text-muted-foreground">{suggestion.originalText}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-t">
                      <div className="flex items-start space-x-2">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium">Improved Version:</div>
                          <p>{suggestion.suggestedText}</p>
                          <p className="mt-2 text-sm text-muted-foreground">
                            <span className="font-medium">Why:</span> {suggestion.reason}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "keywords" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Skills to Highlight */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Skills to Highlight</h3>
                  <div className="bg-card border rounded-lg p-4">
                    <ul className="space-y-2">
                      {results.keywordsMatched?.map((skill, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>{skill}</span>
                        </li>
                      ))}
                      {results.keywordsMatched?.length === 0 && (
                        <li className="text-muted-foreground">No matched skills found</li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Skills to Add */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Skills to Add</h3>
                  <div className="bg-card border rounded-lg p-4">
                    <ul className="space-y-2">
                      {results.keywordsMissing?.map((skill, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <ArrowRight className="h-4 w-4 text-primary" />
                          <span>{skill}</span>
                        </li>
                      ))}
                      {results.keywordsMissing?.length === 0 && (
                        <li className="text-muted-foreground">No missing skills detected</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Missing Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {results.keywordsMissing?.map((keyword, index) => (
                    <span key={index} className="px-3 py-1 bg-muted rounded-full text-sm font-medium">
                      {keyword}
                    </span>
                  ))}
                  {results.keywordsMissing?.length === 0 && (
                    <span className="text-muted-foreground">No missing keywords detected</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <FileText className="h-5 w-5" />
              <span>Apply Suggestions to Resume</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
              <Sparkles className="h-5 w-5" />
              <span>Generate Optimized Resume</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
