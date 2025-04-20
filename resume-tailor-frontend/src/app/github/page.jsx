import GitHubProjects from "../../components/GitHubProjects"

export const metadata = {
  title: "GitHub Integration - ResumeTailor",
  description: "Import relevant projects from your GitHub profile",
}

export default function GitHubPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">GitHub Integration</h1>
        <p className="text-muted-foreground">
          Import relevant projects from your GitHub profile to enhance your resume.
        </p>
      </div>
      <GitHubProjects />
    </div>
  )
}
