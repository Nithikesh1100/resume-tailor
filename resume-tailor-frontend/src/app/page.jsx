import Link from "next/link"
import { ArrowRight, FileText, Sparkles, FileEdit, Github, Settings } from "lucide-react"

export default function Home() {
  // Feature cards data
  const features = [
    {
      title: "LaTeX Resume Editor",
      description: "Edit your resume in LaTeX with live preview and download as PDF",
      icon: <FileText className="h-10 w-10 text-primary" />,
      link: "/resume-editor",
    },
    {
      title: "AI Resume Tailoring",
      description: "Get AI-powered suggestions to tailor your resume to specific job descriptions",
      icon: <Sparkles className="h-10 w-10 text-primary" />,
      link: "/ai-tailor",
    },
    {
      title: "Cover Letter Generator",
      description: "Generate custom cover letters based on your resume and job descriptions",
      icon: <FileEdit className="h-10 w-10 text-primary" />,
      link: "/cover-letter",
    },
    {
      title: "GitHub Integration",
      description: "Automatically import relevant projects from your GitHub profile",
      icon: <Github className="h-10 w-10 text-primary" />,
      link: "/github",
    },
    {
      title: "API Key Management",
      description: "Manage your AI API keys and application settings",
      icon: <Settings className="h-10 w-10 text-primary" />,
      link: "/settings",
    },
  ]

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          <span className="text-primary">AI-Powered</span> Resume Tailoring
        </h1>
        <p className="text-xl md:text-2xl max-w-3xl mx-auto text-muted-foreground">
          Customize your resume for each job application with AI assistance. Stand out from the crowd and increase your
          chances of landing interviews.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            href="/resume-editor"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link
            href="#features"
            className="inline-flex items-center px-6 py-3 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="space-y-8">
        <h2 className="text-3xl font-bold text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Link
              key={index}
              href={feature.link}
              className="group p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="p-2 w-fit rounded-lg bg-muted">{feature.icon}</div>
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
                <div className="flex items-center text-primary font-medium">
                  Explore <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center mx-auto font-bold text-xl">
              1
            </div>
            <h3 className="text-xl font-semibold">Create Your Resume</h3>
            <p className="text-muted-foreground">Use our LaTeX editor to create or upload your professional resume</p>
          </div>
          <div className="text-center space-y-4">
            <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center mx-auto font-bold text-xl">
              2
            </div>
            <h3 className="text-xl font-semibold">Add Job Description</h3>
            <p className="text-muted-foreground">Paste the job description you're applying for</p>
          </div>
          <div className="text-center space-y-4">
            <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center mx-auto font-bold text-xl">
              3
            </div>
            <h3 className="text-xl font-semibold">Get Tailored Results</h3>
            <p className="text-muted-foreground">
              Receive AI suggestions to optimize your resume and generate a cover letter
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 rounded-2xl p-8 text-center space-y-6">
        <h2 className="text-3xl font-bold">Ready to land your dream job?</h2>
        <p className="text-xl max-w-2xl mx-auto text-muted-foreground">
          Start tailoring your resume to job descriptions and stand out from other applicants
        </p>
        <Link
          href="/resume-editor"
          className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Create Your Resume <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </section>
    </div>
  )
}
