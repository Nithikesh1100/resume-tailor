/**
 * API service module for the Resume Tailor application
 * This module contains functions to interact with the backend API
 */

// Backend API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

/**
 * Get available AI providers
 * @returns {Promise<string[]>} - List of available AI provider names
 */
export async function getAIProviders() {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/providers`)

    if (!response.ok) {
      throw new Error("Failed to fetch AI providers")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching AI providers:", error)
    // Return default providers if API call fails
    return ["openai", "groq"]
  }
}

/**
 * Tailor a resume based on a job description
 * @param {string} resumeContent - The resume content
 * @param {string} jobDescription - The job description
 * @param {string} apiKey - The API key
 * @param {string} provider - The AI provider (e.g., "openai", "groq")
 * @returns {Promise<Object>} - Tailored resume suggestions
 */
export async function tailorResume(resumeContent, jobDescription, apiKey, provider = "openai") {
  try {
    console.log(`Calling tailorResume API with provider: ${provider}`)

    // Create request body
    const requestBody = {
      resumeContent,
      jobDescription,
      apiKey,
      provider,
    }

    console.log("Request body size:", JSON.stringify(requestBody).length, "bytes")

    // Make the API call
    const response = await fetch(`${API_BASE_URL}/ai/tailor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    // Log response status
    console.log("Response status:", response.status, response.statusText)

    // Check if response is OK
    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error response body:", errorText)

      try {
        const errorData = JSON.parse(errorText)
        throw new Error(errorData.message || `Failed to tailor resume: ${response.status} ${response.statusText}`)
      } catch (e) {
        throw new Error(
          `Failed to tailor resume: ${response.status} ${response.statusText}. Response: ${errorText.substring(0, 100)}...`,
        )
      }
    }

    // Parse response
    const data = await response.json()
    console.log("AI Tailor Response:", data)

    return data
  } catch (error) {
    console.error("Error tailoring resume:", error)

    // Only use mock data if there's a network error
    if (error.message.includes("Failed to fetch") || error.message.includes("Network Error")) {
      console.log("Network error, falling back to mock data")
      return mockData.tailorResponse
    }

    throw error
  }
}

/**
 * Generate a cover letter based on resume and job description
 * @param {string} resumeContent - The resume content
 * @param {string} jobDescription - The job description
 * @param {string} additionalInfo - Additional information
 * @param {string} apiKey - The API key
 * @param {string} provider - The AI provider (e.g., "openai", "groq")
 * @returns {Promise<Object>} - Generated cover letter
 */
export async function generateCoverLetter(resumeContent, jobDescription, additionalInfo, apiKey, provider = "openai") {
  try {
    console.log(`Calling generateCoverLetter API with provider: ${provider}`)

    // Create request body
    const requestBody = {
      resumeContent,
      jobDescription,
      additionalInfo,
      apiKey,
      provider,
    }

    console.log("Request body size:", JSON.stringify(requestBody).length, "bytes")

    // Make the API call
    const response = await fetch(`${API_BASE_URL}/ai/cover-letter`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    // Log response status
    console.log("Response status:", response.status, response.statusText)

    // Check if response is OK
    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error response body:", errorText)

      try {
        const errorData = JSON.parse(errorText)
        throw new Error(
          errorData.message || `Failed to generate cover letter: ${response.status} ${response.statusText}`,
        )
      } catch (e) {
        throw new Error(
          `Failed to generate cover letter: ${response.status} ${response.statusText}. Response: ${errorText.substring(0, 100)}...`,
        )
      }
    }

    // Parse response
    const data = await response.json()
    console.log("Cover Letter Response:", data)

    return data
  } catch (error) {
    console.error("Error generating cover letter:", error)

    // Only use mock data if there's a network error
    if (error.message.includes("Failed to fetch") || error.message.includes("Network Error")) {
      console.log("Network error, falling back to mock data")
      return mockData.coverLetterResponse
    }

    throw error
  }
}

/**
 * Fetch GitHub projects for a user
 * @param {string} username - GitHub username
 * @param {string} jobDescription - Optional job description for relevance filtering
 * @param {string} apiKey - Optional GitHub API token
 * @returns {Promise<Object>} - GitHub repositories
 */
export async function fetchGitHubProjects(username, jobDescription = "", apiKey = "") {
  try {
    const url = new URL(`${API_BASE_URL}/github/projects`)
    url.searchParams.append("username", username)

    if (jobDescription) {
      url.searchParams.append("jobDescription", jobDescription)
    }

    const headers = {
      "Content-Type": "application/json",
    }

    if (apiKey && apiKey.trim() !== "") {
      headers["X-GitHub-Token"] = apiKey
    }

    console.log("Fetching GitHub projects from:", url.toString())
    console.log("Using GitHub token:", apiKey && apiKey.trim() !== "" ? "Yes" : "No")

    const response = await fetch(url.toString(), {
      headers: headers,
    })

    // Log response status
    console.log("Response status:", response.status, response.statusText)

    // Check if response is OK
    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error response body:", errorText)

      try {
        const errorData = JSON.parse(errorText)
        throw new Error(
          errorData.message || `Failed to fetch GitHub projects: ${response.status} ${response.statusText}`,
        )
      } catch (e) {
        throw new Error(
          `Failed to fetch GitHub projects: ${response.status} ${response.statusText}. Response: ${errorText.substring(0, 100)}...`,
        )
      }
    }

    // Parse response
    const data = await response.json()
    console.log("GitHub Projects Response:", data)

    return data
  } catch (error) {
    console.error("Error fetching GitHub projects:", error)

    // Only use mock data if there's a network error
    if (error.message.includes("Failed to fetch") || error.message.includes("Network Error")) {
      console.log("Network error, falling back to mock data")
      return mockData.githubResponse
    }

    throw error
  }
}

/**
 * Compile LaTeX content to PDF
 * @param {string} latexContent - The LaTeX content
 * @returns {Promise<Blob>} - Compiled PDF as Blob
 */
export async function compileToPdf(latexContent) {
  try {
    console.log("Compiling LaTeX to PDF, content length:", latexContent.length, "characters")

    const response = await fetch(`${API_BASE_URL}/resume/compile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        latexContent,
      }),
    })

    // Log response status
    console.log("Response status:", response.status, response.statusText)

    // Check if response is OK
    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error response body:", errorText)

      try {
        const errorData = JSON.parse(errorText)
        throw new Error(errorData.message || `Failed to compile PDF: ${response.status} ${response.statusText}`)
      } catch (e) {
        throw new Error(`Failed to compile PDF: ${response.status} ${response.statusText}`)
      }
    }

    return await response.blob()
  } catch (error) {
    console.error("Error compiling PDF:", error)
    throw error
  }
}

/**
 * Mock data for testing when backend is not available
 */
export const mockData = {
  tailorResponse: {
    tailoredResume: "",
    suggestions: [
      {
        originalText:
          "Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies.",
        suggestedText:
          "Experienced frontend developer with 5+ years of expertise in React development, specializing in responsive web applications, modern JavaScript frameworks, and performance optimization.",
        reason: "Aligns better with the frontend focus of the job description.",
      },
      {
        originalText: "Led development of a microservices architecture that improved system reliability by 40%",
        suggestedText:
          "Led frontend development using React and Next.js that improved application performance by 40% and enhanced user experience",
        reason: "Highlights Next.js experience which is specifically mentioned in the job requirements.",
      },
      {
        originalText: "Implemented CI/CD pipelines reducing deployment time by 60%",
        suggestedText:
          "Implemented automated testing with Jest and React Testing Library, reducing bugs by 60% and improving code quality",
        reason: "Emphasizes testing experience which is mentioned in the job requirements.",
      },
    ],
    keywordsMatched: ["React", "Redux", "JavaScript (ES6+)", "HTML5", "CSS3", "Responsive Design"],
    keywordsMissing: ["Next.js", "Jest", "React Testing Library", "Accessibility"],
    matchScore: 72,
  },

  coverLetterResponse: {
    coverLetter: `John Doe
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

John Doe`,
  },

  githubResponse: {
    repositories: [
      {
        id: 1,
        name: "spring-boot-api",
        description: "RESTful API built with Spring Boot and PostgreSQL",
        htmlUrl: "https://github.com/johndoe/spring-boot-api",
        language: "Java",
        stars: 42,
        forks: 15,
        topics: ["spring-boot", "rest-api", "java", "postgresql"],
        createdAt: "2022-01-15T10:30:00Z",
        updatedAt: "2023-11-20T14:22:00Z",
        relevanceScore: 65.5,
      },
      {
        id: 2,
        name: "react-dashboard",
        description: "Admin dashboard built with React and Material UI",
        htmlUrl: "https://github.com/johndoe/react-dashboard",
        language: "JavaScript",
        stars: 28,
        forks: 8,
        topics: ["react", "javascript", "material-ui", "dashboard"],
        createdAt: "2022-03-10T09:15:00Z",
        updatedAt: "2023-10-05T11:45:00Z",
        relevanceScore: 85.2,
      },
      {
        id: 3,
        name: "python-data-analysis",
        description: "Data analysis scripts using Python, Pandas, and Matplotlib",
        htmlUrl: "https://github.com/johndoe/python-data-analysis",
        language: "Python",
        stars: 15,
        forks: 5,
        topics: ["python", "pandas", "data-analysis", "matplotlib"],
        createdAt: "2022-05-20T14:50:00Z",
        updatedAt: "2023-09-12T08:30:00Z",
        relevanceScore: 35.1,
      },
    ],
  },
}
