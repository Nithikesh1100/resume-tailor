import ResumeEditor from "@/components/ResumeEditor"

export const metadata = {
  title: "LaTeX Resume Editor - ResumeTailor",
  description: "Edit your resume in LaTeX with live preview",
}

export default function ResumeEditorPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">LaTeX Resume Editor</h1>
        <p className="text-muted-foreground">Edit your resume in LaTeX format with live preview and download as PDF.</p>
      </div>
      <ResumeEditor />
    </div>
  )
}
