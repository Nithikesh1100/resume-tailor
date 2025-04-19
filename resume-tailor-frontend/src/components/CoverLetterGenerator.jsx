"use client"

import { useState } from "react"
import { Sparkles, Copy, Download, RefreshCw, Save } from "lucide-react"

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

  // Sample cover letter for demo purposes
  const sampleCoverLetter = `John Doe
123 Main Street
San Francisco, CA 94105
john.doe@email.com
(123) 456-7890

April 13, 2025

Hiring Manager
TechCorp Inc.
San Francisco, CA

Dear Hiring Manager,

I am writing to express my interest in the Senior Frontend Developer position at TechCorp Inc. As an experienced software engineer with over 5 years of expertise in frontend development, I am excited about the opportunity to contribute to your team's success in building exceptional user experiences.

Throughout my career at Tech Innovations Inc. and Digital Solutions LLC, I have developed a strong foundation in React, Redux, and modern JavaScript (ES6+), which aligns perfectly with your requirements. At Tech Innovations, I led frontend development initiatives that improved application performance by 40% through optimized rendering and state management techniques. I also have extensive experience with Next.js for server-side rendering, having implemented it in multiple projects to enhance SEO and initial load performance.

Your job description mentions the importance of collaboration and mentorship, which resonates with my experience mentoring junior developers and conducting code reviews to ensure code quality. I believe that knowledge sharing is essential for team growth, and I am passionate about helping others improve their skills while maintaining high standards for our codebase.

Some of my relevant accomplishments include:

- Developing responsive web applications using React and Redux that served thousands of daily users
- Implementing automated testing with Jest and React Testing Library, reducing bugs by 60%
- Optimizing frontend performance through code splitting, lazy loading, and efficient state management
- Collaborating with UX/UI designers to create intuitive and accessible user interfaces

I am particularly drawn to TechCorp's mission to create innovative digital solutions and your commitment to user-centered design. I am confident that my technical expertise, problem-solving abilities, and collaborative approach would make me a valuable addition to your team.

I would welcome the opportunity to discuss how my background, skills, and experiences would benefit TechCorp Inc. Thank you for considering my application.

Sincerely,

John Doe`

  // Mock function to generate cover letter
  const generateCoverLetter = () => {
    setIsGenerating(true)

    // Simulate API call delay
    setTimeout(() => {
      setCoverLetter(sampleCoverLetter)
      setIsGenerating(false)
    }, 3000)
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
              onClick={generateCoverLetter}
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
              onClick={() => setIsGenerating(true) || setTimeout(() => setIsGenerating(false), 2000)}
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
