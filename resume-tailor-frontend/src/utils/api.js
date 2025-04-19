/**
 * API helper functions for the resume tailoring application
 */

// Function to compile LaTeX to PDF
export async function compileLatexToPdf(latexCode, apiKey = null) {
  try {
    // In a real application, this would call a LaTeX compilation service
    // For demo purposes, we're just simulating the API call
    console.log("Compiling LaTeX to PDF...")

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Return a mock response
    return {
      success: true,
      pdfUrl: "https://example.com/resume.pdf",
      message: "PDF compiled successfully",
    }
  } catch (error) {
    console.error("Error compiling LaTeX to PDF:", error)
    return {
      success: false,
      message: error.message || "Failed to compile LaTeX to PDF",
    }
  }
}

// Function to analyze resume against job description using AI
export async function analyzeResume(resumeText, jobDescription, apiKey) {
  try {
    // In a real application, this would call an AI service like OpenAI
    // For demo purposes, we're just simulating the API call
    console.log("Analyzing resume against job description...")

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Return a mock response
    return {
      success: true,
      score: 72,
      keywordMatch: 68,
      missingKeywords: ["Next.js", "Jest", "React Testing Library", "Accessibility"],
      suggestions: [
        {
          original:
            "Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies.",
          improved:
            "Experienced frontend developer with 5+ years of expertise in React development, specializing in responsive web applications, modern JavaScript frameworks, and performance optimization.",
          reason: "Aligns better with the frontend focus of the job description.",
        },
      ],
      skillsToHighlight: ["React", "Redux", "JavaScript (ES6+)", "HTML5", "CSS3", "Responsive Design"],
      skillsToAdd: ["Next.js", "Jest", "React Testing Library", "Accessibility Standards"],
    }
  } catch (error) {
    console.error("Error analyzing resume:", error)
    return {
      success: false,
      message: error.message || "Failed to analyze resume",
    }
  }
}

// Function to generate a cover letter using AI
export async function generateCoverLetter(resumeText, jobDescription, additionalInfo, apiKey) {
  try {
    // In a real application, this would call an AI service like OpenAI
    // For demo purposes, we're just simulating the API call
    console.log("Generating cover letter...")

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Return a mock response
    return {
      success: true,
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
    }
  } catch (error) {
    console.error("Error generating cover letter:", error)
    return {
      success: false,
      message: error.message || "Failed to generate cover letter",
    }
  }
}

// Function to fetch GitHub projects
export async function fetchGitHubProjects(username, apiKey = null) {
  try {
    // In a real application, this would call the GitHub API
    // For demo purposes, we're just simulating the API call
    console.log("Fetching GitHub projects for:", username)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Return mock projects
    return {
      success: true,
      projects: [
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
      ],
    }
  } catch (error) {
    console.error("Error fetching GitHub projects:", error)
    return {
      success: false,
      message: error.message || "Failed to fetch GitHub projects",
    }
  }
}
