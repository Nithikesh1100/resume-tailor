import AITailor from "../../components/AITailor"

export const metadata = {
  title: "AI Resume Tailoring - ResumeTailor",
  description: "Get AI-powered suggestions to tailor your resume to specific job descriptions",
}

export default function AITailorPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Resume Tailoring</h1>
        <p className="text-muted-foreground">
          Get AI-powered suggestions to tailor your resume to specific job descriptions.
        </p>
      </div>
      <AITailor />
    </div>
  )
}
