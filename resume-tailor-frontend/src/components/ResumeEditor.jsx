"use client"

import { useState, useEffect } from "react"
import { Download, Copy, Save, RefreshCw, AlertTriangle, Github } from "lucide-react"
import { compileToPdf } from "../services/api"

// Sample LaTeX template
const sampleLatexTemplate = `\\documentclass[11pt,a4paper]{article}

\\usepackage{geometry}
\\usepackage{hyperref}
\\usepackage{fontawesome5}
\\usepackage{titlesec}
\\usepackage{enumitem}

\\geometry{left=0.75in, right=0.75in, top=0.75in, bottom=0.75in}

\\titleformat{\\section}{\\Large\\bfseries}{}{0em}{}[\\titlerule]
\\titlespacing{\\section}{0pt}{12pt}{8pt}

\\begin{document}

\\begin{center}
   {\\LARGE \\textbf{John Doe}}\\\\
   123 Main Street, City, State 12345\\\\
   (123) 456-7890 | \\href{mailto:john.doe@email.com}{john.doe@email.com} | 
   \\href{https://linkedin.com/in/johndoe}{linkedin.com/in/johndoe} | 
   \\href{https://github.com/johndoe}{github.com/johndoe}
\\end{center}

\\section{Summary}
Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable applications and optimizing performance.

\\section{Skills}
\\begin{itemize}[leftmargin=*, noitemsep]
   \\item \\textbf{Programming Languages:} JavaScript, TypeScript, Python, Java
   \\item \\textbf{Frontend:} React, Redux, HTML5, CSS3, Tailwind CSS
   \\item \\textbf{Backend:} Node.js, Express, Django, Spring Boot
   \\item \\textbf{Databases:} MongoDB, PostgreSQL, MySQL, Redis
   \\item \\textbf{DevOps:} Docker, Kubernetes, AWS, CI/CD, Git
   \\item \\textbf{Other:} RESTful APIs, GraphQL, Microservices, Agile/Scrum
\\end{itemize}

\\section{Experience}
\\textbf{Senior Software Engineer} \\hfill Jan 2021 - Present\\\\
\\textit{Tech Innovations Inc., San Francisco, CA}
\\begin{itemize}[leftmargin=*, noitemsep]
   \\item Led development of a microservices architecture that improved system reliability by 40\\%
   \\item Implemented CI/CD pipelines reducing deployment time by 60\\%
   \\item Mentored junior developers and conducted code reviews to ensure code quality
   \\item Optimized database queries resulting in 30\\% faster application response time
\\end{itemize}

\\textbf{Software Engineer} \\hfill Mar 2018 - Dec 2020\\\\
\\textit{Digital Solutions LLC, Boston, MA}
\\begin{itemize}[leftmargin=*, noitemsep]
   \\item Developed responsive web applications using React and Redux
   \\item Created RESTful APIs with Node.js and Express
   \\item Collaborated with UX/UI designers to implement user-friendly interfaces
   \\item Participated in Agile development cycles and sprint planning
\\end{itemize}

\\section{Education}
\\textbf{Master of Science in Computer Science} \\hfill 2016 - 2018\\\\
\\textit{Massachusetts Institute of Technology, Cambridge, MA}

\\textbf{Bachelor of Science in Computer Engineering} \\hfill 2012 - 2016\\\\
\\textit{University of California, Berkeley, CA}

\\section{Projects}
\\textbf{E-commerce Platform} \\hfill \\href{https://github.com/johndoe/ecommerce}{github.com/johndoe/ecommerce}
\\begin{itemize}[leftmargin=*, noitemsep]
   \\item Built a full-stack e-commerce platform with React, Node.js, and MongoDB
   \\item Implemented secure payment processing with Stripe API
   \\item Deployed on AWS using Docker containers and Kubernetes
\\end{itemize}

\\textbf{Task Management Application} \\hfill \\href{https://github.com/johndoe/taskmanager}{github.com/johndoe/taskmanager}
\\begin{itemize}[leftmargin=*, noitemsep]
   \\item Developed a task management app with drag-and-drop functionality
   \\item Integrated real-time updates using WebSockets
   \\item Implemented user authentication and authorization
\\end{itemize}

\\section{Certifications}
\\begin{itemize}[leftmargin=*, noitemsep]
   \\item AWS Certified Solutions Architect
   \\item Google Cloud Professional Developer
   \\item MongoDB Certified Developer
\\end{itemize}

\\end{document}`

export default function ResumeEditor() {
  const [latexCode, setLatexCode] = useState(sampleLatexTemplate)
  const [previewHtml, setPreviewHtml] = useState("")
  const [isCompiling, setIsCompiling] = useState(false)
  const [error, setError] = useState(null)
  const [savedTemplates, setSavedTemplates] = useState([
    { name: "Software Engineer", content: sampleLatexTemplate },
    { name: "Data Scientist", content: "% Data Scientist LaTeX Template" },
    { name: "Product Manager", content: "% Product Manager LaTeX Template" },
  ])

  // Check for GitHub projects from localStorage
  useEffect(() => {
    try {
      const githubProjects = JSON.parse(localStorage.getItem("githubProjects") || "[]")
      if (githubProjects.length > 0) {
        // Show notification or handle the integration into the resume
        console.log(`Found ${githubProjects.length} GitHub projects to integrate`)
      }
    } catch (err) {
      console.error("Error loading GitHub projects:", err)
    }
  }, [])

  // Function to integrate GitHub projects into the resume
  const integrateGitHubProjects = () => {
    try {
      const githubProjects = JSON.parse(localStorage.getItem("githubProjects") || "[]")
      if (githubProjects.length === 0) {
        alert("No GitHub projects found. Please add projects from the GitHub Integration page first.")
        return
      }

      // Create LaTeX content for GitHub projects
      let projectsLatex = "\\section{GitHub Projects}\n"

      githubProjects.forEach((project) => {
        projectsLatex += `\\textbf{${project.name}} \\hfill \\href{${project.url}}{${project.url.replace("https://github.com/", "github.com/")}}\n`
        projectsLatex += "\\begin{itemize}[leftmargin=*, noitemsep]\n"

        // Add description if available
        if (project.description) {
          projectsLatex += `\\item ${project.description}\n`
        }

        // Add technologies if available
        if (project.technologies && project.technologies.length > 0) {
          projectsLatex += `\\item \\textbf{Technologies:} ${project.technologies.join(", ")}\n`
        }

        projectsLatex += "\\end{itemize}\n\n"
      })

      // Check if Projects section already exists
      if (latexCode.includes("\\section{Projects}") || latexCode.includes("\\section{GitHub Projects}")) {
        // Replace existing Projects section
        const updatedLatex = latexCode.replace(
          /\\section\{(?:GitHub )?Projects\}[\s\S]*?(\\section\{|\\end\{document\})/,
          `${projectsLatex}$1`,
        )
        setLatexCode(updatedLatex)
      } else {
        // Add new Projects section before end of document
        const updatedLatex = latexCode.replace("\\end{document}", `${projectsLatex}\n\\end{document}`)
        setLatexCode(updatedLatex)
      }

      alert(`Successfully integrated ${githubProjects.length} GitHub projects into your resume!`)
    } catch (err) {
      console.error("Error integrating GitHub projects:", err)
      alert("Failed to integrate GitHub projects. Please try again.")
    }
  }

  // Improved LaTeX to HTML conversion
  useEffect(() => {
    // This is a more comprehensive simulation of LaTeX to HTML conversion
    const simulateCompilation = () => {
      setIsCompiling(true)

      // Enhanced conversion for preview purposes
      const html = latexCode
        // Handle document structure
        .replace(
          /\\begin{document}|\\end{document}|\\documentclass.*?}|\\usepackage.*?}|\\geometry.*?}|\\titleformat.*?}|\\titlespacing.*?}/gs,
          "",
        )

        // Handle center environment
        .replace(/\\begin{center}([\s\S]*?)\\end{center}/g, '<div class="text-center">$1</div>')

        // Handle sections
        .replace(/\\section{(.*?)}/g, '<h2 class="text-xl font-bold mt-6 mb-3 pb-1 border-b">$1</h2>')

        // Handle itemize environments with better regex
        .replace(/\\begin{itemize}[\s\S]*?\\end{itemize}/gs, (match) => {
          // Extract items
          const items = match.match(/\\item\s+([\s\S]*?)(?=\\item|\\end{itemize})/g) || []

          // Format items
          const formattedItems = items
            .map((item) => {
              // Remove \item and trim
              const content = item.replace(/\\item\s+/, "").trim()
              return `<li class="mb-1">${content}</li>`
            })
            .join("")

          return `<ul class="list-disc pl-5 space-y-1">${formattedItems}</ul>`
        })

        // Handle text formatting
        .replace(/\\textbf{(.*?)}/g, "<strong>$1</strong>")
        .replace(/\\textit{(.*?)}/g, "<em>$1</em>")
        .replace(/\\LARGE\s*\\textbf{(.*?)}/g, '<h1 class="text-2xl font-bold">$1</h1>')
        .replace(/\\LARGE\s*{(.*?)}/g, '<span class="text-2xl">$1</span>')

        // Handle hyperlinks
        .replace(/\\href{(.*?)}{(.*?)}/g, '<a href="$1" class="text-blue-600 hover:underline">$2</a>')

        // Handle horizontal alignment with hfill
        .replace(/(.*?)\\hfill(.*?)\\\\/, '<div class="flex justify-between"><div>$1</div><div>$2</div></div>')

        // Handle newlines
        .replace(/\\\\/g, "<br>")

        // Handle percentage signs (escaped in LaTeX)
        .replace(/(\d+)\\%/g, "$1%")

        // Clean up any remaining LaTeX commands
        .replace(/\\[a-zA-Z]+(\[.*?\])?(\{.*?\})?/g, "")

        // Fix spacing issues
        .replace(/\n\s*\n/g, '<div class="my-4"></div>')

      setTimeout(() => {
        setPreviewHtml(html)
        setIsCompiling(false)
      }, 1000)
    }

    simulateCompilation()
  }, [latexCode])

  // Handle saving the current template
  const saveTemplate = () => {
    const templateName = prompt("Enter a name for this template:")
    if (templateName) {
      const newTemplate = { name: templateName, content: latexCode }
      setSavedTemplates([...savedTemplates, newTemplate])

      // Save to localStorage
      try {
        localStorage.setItem(`resume_template_${templateName.toLowerCase().replace(/\s+/g, "_")}`, latexCode)
      } catch (err) {
        console.error("Error saving template:", err)
      }
    }
  }

  // Handle loading a template
  const loadTemplate = (content) => {
    if (confirm("This will replace your current work. Continue?")) {
      setLatexCode(content)
    }
  }

  // Handle downloading as PDF
  const downloadPdf = async () => {
    setIsCompiling(true)
    setError(null)

    try {
      // Call backend API to compile LaTeX to PDF
      const pdfBlob = await compileToPdf(latexCode)

      // Create download link
      const url = URL.createObjectURL(pdfBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = "resume.pdf"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Error compiling PDF:", err)
      setError("Failed to compile PDF. Please check your LaTeX syntax or try again later.")

      // For demo purposes, simulate successful PDF generation
      setTimeout(() => {
        alert(
          "For demonstration: PDF would be downloaded in a production environment. The backend service for PDF compilation is not available in this demo.",
        )
      }, 500)
    } finally {
      setIsCompiling(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Template selector */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium">Templates:</span>
        {savedTemplates.map((template, index) => (
          <button
            key={index}
            onClick={() => loadTemplate(template.content)}
            className="px-3 py-1 text-sm rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
          >
            {template.name}
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={integrateGitHubProjects}
          className="flex items-center space-x-1 px-3 py-1 rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
        >
          <Github className="h-4 w-4" />
          <span>Integrate GitHub Projects</span>
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 rounded-md bg-yellow-50 border border-yellow-200 flex items-start space-x-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-yellow-700">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LaTeX Editor */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">LaTeX Editor</h2>
            <div className="flex space-x-2">
              <button
                onClick={saveTemplate}
                className="p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                title="Save Template"
              >
                <Save className="h-4 w-4" />
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(latexCode)}
                className="p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                title="Copy LaTeX"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="border rounded-md overflow-hidden">
            <textarea
              value={latexCode}
              onChange={(e) => setLatexCode(e.target.value)}
              className="w-full h-[600px] p-4 font-mono text-sm resize-none focus:outline-none latex-editor bg-card"
              spellCheck="false"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Preview</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsCompiling(true) || setTimeout(() => setIsCompiling(false), 1000)}
                className="p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                title="Refresh Preview"
              >
                <RefreshCw className={`h-4 w-4 ${isCompiling ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={downloadPdf}
                className="flex items-center space-x-1 px-3 py-1 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                disabled={isCompiling}
              >
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
          <div className="border rounded-md p-6 h-[600px] overflow-auto bg-white text-black resume-preview">
            {isCompiling ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center space-y-4">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-muted-foreground">Compiling LaTeX...</p>
                </div>
              </div>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
