import CoverLetterGenerator from "../../components/CoverLetterGenerator"

export const metadata = {
  title: "Cover Letter Generator - ResumeTailor",
  description: "Generate custom cover letters based on your resume and job descriptions",
}

export default function CoverLetterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Cover Letter Generator</h1>
        <p className="text-muted-foreground">
          Generate custom cover letters based on your resume and job descriptions.
        </p>
      </div>
      <CoverLetterGenerator />
    </div>
  )
}
