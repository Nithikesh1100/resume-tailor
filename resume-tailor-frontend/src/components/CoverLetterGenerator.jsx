"use client"

import { useState } from "react"
import { Sparkles, Copy, Download, RefreshCw, Save, AlertTriangle } from "lucide-react"
import { generateCoverLetter, mockData } from "../services/api"

export default function CoverLetterGenerator() {
  const [resumeText, setResumeText] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [coverLetter, setCoverLetter] = useState("")
  const [savedTemplates, setSavedTemplates] = useState([
    { name: "Professional", id: "professional" },
    { name: "Creative", id: "creative" },
    { name: "Academic", id: "academic" },
  ])
  const [selectedTemplate, setSelectedTemplate] = useState("professional")
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

Company: TechCorp Inc.
Location: San Francisco, CA (Remote Available)

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
- Excellent communication and teamwork abilities`

  // Function to generate cover letter
  const generateCoverLetterHandler = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      // First, check if API key is available from localStorage
      const storedApiKey = localStorage.getItem("openai_api_key") || apiKey

      if (!storedApiKey) {
        throw new Error("OpenAI API key is required. Please add it in the Settings page.")
      }

      // Call the backend API
      const response = await generateCoverLetter(resumeText, jobDescription, additionalInfo, storedApiKey)
      setCoverLetter(response.coverLetter)
    } catch (err) {
      console.error("Error generating cover letter:", err)
      setError(err.message || "Failed to generate cover letter. Please try again.")

      // For demo purposes, use mock data if backend is not available
      if (err.message.includes("Failed to fetch") || err.message.includes("Network Error")) {
        console.log("Using mock data for demo")
        setCoverLetter(mockData.coverLetterResponse.coverLetter)
        setError("Using sample data (backend not available)")
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Load sample data
  const loadSampleData = () => {
    setResumeText(sampleResume)
    setJobDescription(sampleJobDescription)
    setAdditionalInfo(
      "I'm particularly interested in this role because I've been using TechCorp's products for years and admire the company's innovation. I'm excited about the opportunity to work remotely while occasionally visiting the San Francisco office.",
    )
  }

  // Save the current cover letter as a template
  const saveTemplate = () => {
    const templateName = prompt("Enter a name for this template:")
    if (templateName) {
      const newId = templateName.toLowerCase().replace(/\s+/g, "-")
      setSavedTemplates([...savedTemplates, { name: templateName, id: newId }])

      // Save to localStorage
      try {
        const existingTemplates = JSON.parse(localStorage.getItem("coverLetterTemplates") || "[]")
        existingTemplates.push({ name: templateName, id: newId, content: coverLetter })
        localStorage.setItem("coverLetterTemplates", JSON.stringify(existingTemplates))
      } catch (err) {
        console.error("Error saving template:", err)
      }
    }
  }

  // Download cover letter as a text file
  const downloadCoverLetter = () => {
    const element = document.createElement("a")
    const file = new Blob([coverLetter], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "cover-letter.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="space-y-8">
      {!coverLetter ? (
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
                className="w-full h-[250px] p-4 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Job Description Input */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Job Description</h2>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full h-[250px] p-4 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Additional Information (Optional)</h2>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Add any additional information you'd like to include in your cover letter (e.g., why you're interested in this role, specific achievements you want to highlight, etc.)"
              className="w-full h-[150px] p-4 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* API Key input (shown only if not available in settings) */}
          {!localStorage.getItem("openai_api_key") && (
            <div className="space-y-2">
              <label htmlFor="cover-letter-api-key" className="text-sm font-medium">
                OpenAI API Key <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col">
                <input
                  id="cover-letter-api-key"
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

          {/* Template Selection */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Cover Letter Template</h2>
            <div className="flex flex-wrap gap-3">
              {savedTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    selectedTemplate === template.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex justify-center">
            <button
              onClick={generateCoverLetterHandler}
              disabled={!resumeText || !jobDescription || isGenerating}
              className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="h-5 w-5 animate-pulse" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Generate Cover Letter</span>
                </>
              )}
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          {/* Results Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Your Cover Letter</h2>
            <button onClick={() => setCoverLetter("")} className="text-sm text-primary hover:underline">
              Create New Cover Letter
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

          {/* Cover Letter Preview */}
          <div className="border rounded-lg p-6 bg-white text-black whitespace-pre-wrap font-serif">{coverLetter}</div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigator.clipboard.writeText(coverLetter)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Copy className="h-5 w-5" />
              <span>Copy to Clipboard</span>
            </button>
            <button
              onClick={downloadCoverLetter}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Download className="h-5 w-5" />
              <span>Download as Text</span>
            </button>
            <button
              onClick={saveTemplate}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Save className="h-5 w-5" />
              <span>Save as Template</span>
            </button>
            <button
              onClick={() => {
                setIsGenerating(true)
                setTimeout(() => {
                  setIsGenerating(false)
                  // Regenerate with slight variations
                  const variations = [
                    "I am excited about the opportunity",
                    "I am enthusiastic about the possibility",
                    "I am thrilled about the chance",
                  ]
                  const randomVariation = variations[Math.floor(Math.random() * variations.length)]
                  setCoverLetter(coverLetter.replace("I am excited about the opportunity", randomVariation))
                }, 2000)
              }}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <RefreshCw className={`h-5 w-5 ${isGenerating ? "animate-spin" : ""}`} />
              <span>Regenerate</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
