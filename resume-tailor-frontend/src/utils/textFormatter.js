/**
 * Helper functions for text processing in the resume tailoring application
 */

// Function to extract skills from resume text
export function extractSkills(resumeText) {
  // In a real application, this would use NLP or regex patterns to extract skills
  // For demo purposes, we're using a simple approach

  // Common tech skills to look for
  const commonSkills = [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C#",
    "C++",
    "Ruby",
    "PHP",
    "Swift",
    "Kotlin",
    "React",
    "Angular",
    "Vue",
    "Next.js",
    "Node.js",
    "Express",
    "Django",
    "Flask",
    "Spring Boot",
    "HTML",
    "CSS",
    "Sass",
    "Tailwind CSS",
    "Bootstrap",
    "Material UI",
    "Chakra UI",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "SQLite",
    "Redis",
    "Firebase",
    "Supabase",
    "AWS",
    "Azure",
    "Google Cloud",
    "Heroku",
    "Vercel",
    "Netlify",
    "Docker",
    "Kubernetes",
    "Jenkins",
    "GitHub Actions",
    "CircleCI",
    "Travis CI",
    "Git",
    "REST API",
    "GraphQL",
    "WebSockets",
    "Microservices",
    "Serverless",
    "Agile",
    "Scrum",
    "Kanban",
    "TDD",
    "BDD",
    "CI/CD",
    "DevOps",
  ]

  // Extract skills that appear in the resume text
  const foundSkills = commonSkills.filter((skill) => new RegExp(`\\b${skill}\\b`, "i").test(resumeText))

  return foundSkills
}

// Function to extract work experience from resume text
export function extractWorkExperience(resumeText) {
  // In a real application, this would use more sophisticated parsing
  // For demo purposes, we're using a simple approach

  // Look for common section headers
  const experienceSectionRegex = /(?:experience|work experience|employment|professional experience)/i
  const sections = resumeText.split(/\n\s*\n/)

  // Find the experience section
  let experienceSection = null
  let experienceSectionIndex = -1

  for (let i = 0; i < sections.length; i++) {
    if (experienceSectionRegex.test(sections[i])) {
      experienceSection = sections[i]
      experienceSectionIndex = i
      break
    }
  }

  // If we found an experience section, include the next section as well (likely part of experience)
  if (experienceSectionIndex !== -1 && experienceSectionIndex < sections.length - 1) {
    experienceSection += "\n\n" + sections[experienceSectionIndex + 1]
  }

  return experienceSection || ""
}

// Function to extract education from resume text
export function extractEducation(resumeText) {
  // In a real application, this would use more sophisticated parsing
  // For demo purposes, we're using a simple approach

  // Look for common section headers
  const educationSectionRegex = /(?:education|academic background|qualifications|degrees)/i
  const sections = resumeText.split(/\n\s*\n/)

  // Find the education section
  let educationSection = null

  for (const section of sections) {
    if (educationSectionRegex.test(section)) {
      educationSection = section
      break
    }
  }

  return educationSection || ""
}

// Function to format LaTeX content
export function formatLatex(content) {
  // Replace special characters with LaTeX escape sequences
  return content
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}")
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/>/g, "\\textgreater{}")
    .replace(/</g, "\\textless{}")
}

// Function to extract keywords from job description
export function extractKeywords(jobDescription) {
  // In a real application, this would use NLP or TF-IDF to extract important keywords
  // For demo purposes, we're using a simple approach with common job requirement terms

  const commonKeywords = [
    "experience",
    "years",
    "degree",
    "bachelor",
    "master",
    "phd",
    "certification",
    "proficient",
    "expert",
    "familiar",
    "knowledge",
    "understanding",
    "skills",
    "develop",
    "design",
    "implement",
    "maintain",
    "test",
    "debug",
    "deploy",
    "collaborate",
    "communicate",
    "lead",
    "manage",
    "mentor",
    "train",
    "problem-solving",
    "analytical",
    "creative",
    "detail-oriented",
    "team player",
    "self-motivated",
    "independent",
    "deadline",
    "pressure",
    "multitask",
  ]

  // Add tech skills to the keywords list
  const techSkills = [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C#",
    "C++",
    "Ruby",
    "PHP",
    "Swift",
    "Kotlin",
    "React",
    "Angular",
    "Vue",
    "Next.js",
    "Node.js",
    "Express",
    "Django",
    "Flask",
    "Spring Boot",
    "HTML",
    "CSS",
    "Sass",
    "Tailwind CSS",
    "Bootstrap",
    "Material UI",
    "Chakra UI",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "SQLite",
    "Redis",
    "Firebase",
    "Supabase",
    "AWS",
    "Azure",
    "Google Cloud",
    "Heroku",
    "Vercel",
    "Netlify",
    "Docker",
    "Kubernetes",
    "Jenkins",
    "GitHub Actions",
    "CircleCI",
    "Travis CI",
    "Git",
    "REST API",
    "GraphQL",
    "WebSockets",
    "Microservices",
    "Serverless",
    "Agile",
    "Scrum",
    "Kanban",
    "TDD",
    "BDD",
    "CI/CD",
    "DevOps",
  ]

  const allKeywords = [...commonKeywords, ...techSkills]

  // Extract keywords that appear in the job description
  const foundKeywords = allKeywords.filter((keyword) => new RegExp(`\\b${keyword}\\b`, "i").test(jobDescription))

  return foundKeywords
}

// Function to compare resume skills with job description keywords
export function compareSkillsToKeywords(resumeSkills, jobKeywords) {
  // Convert to lowercase for case-insensitive comparison
  const normalizedResumeSkills = resumeSkills.map((skill) => skill.toLowerCase())
  const normalizedJobKeywords = jobKeywords.map((keyword) => keyword.toLowerCase())

  // Find matching skills
  const matchingSkills = normalizedResumeSkills.filter((skill) => normalizedJobKeywords.includes(skill))

  // Find missing skills
  const missingSkills = normalizedJobKeywords.filter((keyword) => !normalizedResumeSkills.includes(keyword))

  return {
    matching: matchingSkills,
    missing: missingSkills,
    matchPercentage: Math.round((matchingSkills.length / normalizedJobKeywords.length) * 100),
  }
}
