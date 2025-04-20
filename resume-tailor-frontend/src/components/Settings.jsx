"use client"

import { useState, useEffect } from "react"
import { Save, Key, AlertTriangle, Check, X, Eye, EyeOff } from "lucide-react"

export default function Settings() {
  const [apiKeys, setApiKeys] = useState({
    openai: "",
    github: "",
    latex: "",
  })
  const [showKeys, setShowKeys] = useState({
    openai: false,
    github: false,
    latex: false,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null) // null, 'success', 'error'

  // Load saved API keys on component mount
  useEffect(() => {
    const openaiKey = localStorage.getItem("openai_api_key") || ""
    const githubKey = localStorage.getItem("github_api_key") || ""
    const latexKey = localStorage.getItem("latex_api_key") || ""

    setApiKeys({
      openai: openaiKey,
      github: githubKey,
      latex: latexKey,
    })
  }, [])

  // Handle input change
  const handleInputChange = (key, value) => {
    setApiKeys({
      ...apiKeys,
      [key]: value,
    })
  }

  // Toggle visibility of API keys
  const toggleKeyVisibility = (key) => {
    setShowKeys({
      ...showKeys,
      [key]: !showKeys[key],
    })
  }

  // Save settings to localStorage
  const saveSettings = () => {
    setIsSaving(true)
    setSaveStatus(null)

    try {
      // Save API keys to localStorage
      localStorage.setItem("openai_api_key", apiKeys.openai)
      localStorage.setItem("github_api_key", apiKeys.github)
      localStorage.setItem("latex_api_key", apiKeys.latex)

      // Simulate API call delay
      setTimeout(() => {
        setIsSaving(false)
        setSaveStatus("success")

        // Reset status after 3 seconds
        setTimeout(() => {
          setSaveStatus(null)
        }, 3000)
      }, 1500)
    } catch (error) {
      console.error("Error saving settings:", error)
      setSaveStatus("error")
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* API Keys Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">API Keys</h2>
          <div className="text-sm text-muted-foreground">
            <span className="inline-flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
              Your API keys are stored locally and never sent to our servers
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {/* OpenAI API Key */}
          <div className="space-y-2">
            <label htmlFor="openai-api-key" className="text-sm font-medium flex items-center">
              <Key className="h-4 w-4 mr-2" />
              OpenAI API Key
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">Required</span>
            </label>
            <div className="relative">
              <input
                id="openai-api-key"
                type={showKeys.openai ? "text" : "password"}
                value={apiKeys.openai}
                onChange={(e) => handleInputChange("openai", e.target.value)}
                placeholder="sk-..."
                className="w-full pr-10 py-2 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                type="button"
                onClick={() => toggleKeyVisibility("openai")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
              >
                {showKeys.openai ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Used for AI-powered resume tailoring and cover letter generation.
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 text-primary hover:underline"
              >
                Get your API key
              </a>
            </p>
          </div>

          {/* GitHub API Key */}
          <div className="space-y-2">
            <label htmlFor="github-api-key" className="text-sm font-medium flex items-center">
              <Key className="h-4 w-4 mr-2" />
              GitHub Personal Access Token
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                Optional
              </span>
            </label>
            <div className="relative">
              <input
                id="github-api-key"
                type={showKeys.github ? "text" : "password"}
                value={apiKeys.github}
                onChange={(e) => handleInputChange("github", e.target.value)}
                placeholder="ghp_..."
                className="w-full pr-10 py-2 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                type="button"
                onClick={() => toggleKeyVisibility("github")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
              >
                {showKeys.github ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Used to access private repositories and increase API rate limits.
              <a
                href="https://github.com/settings/tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 text-primary hover:underline"
              >
                Create a token
              </a>
            </p>
          </div>

          {/* LaTeX Compiler API Key */}
          <div className="space-y-2">
            <label htmlFor="latex-api-key" className="text-sm font-medium flex items-center">
              <Key className="h-4 w-4 mr-2" />
              LaTeX Compiler API Key
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                Optional
              </span>
            </label>
            <div className="relative">
              <input
                id="latex-api-key"
                type={showKeys.latex ? "text" : "password"}
                value={apiKeys.latex}
                onChange={(e) => handleInputChange("latex", e.target.value)}
                placeholder="ltx_..."
                className="w-full pr-10 py-2 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                type="button"
                onClick={() => toggleKeyVisibility("latex")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
              >
                {showKeys.latex ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Used for compiling LaTeX to PDF. Without this key, a limited free tier will be used.
            </p>
          </div>
        </div>
      </div>

      {/* Application Settings */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Application Settings</h2>

        <div className="space-y-4">
          {/* Default Resume Format */}
          <div className="space-y-2">
            <label htmlFor="default-format" className="text-sm font-medium">
              Default Resume Format
            </label>
            <select
              id="default-format"
              className="w-full py-2 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
            >
              <option value="latex">LaTeX</option>
              <option value="markdown">Markdown</option>
              <option value="plain">Plain Text</option>
            </select>
          </div>

          {/* AI Model */}
          <div className="space-y-2">
            <label htmlFor="ai-model" className="text-sm font-medium">
              AI Model
            </label>
            <select
              id="ai-model"
              className="w-full py-2 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
            >
              <option value="gpt-4">GPT-4 (Recommended)</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster)</option>
            </select>
            <p className="text-xs text-muted-foreground">
              GPT-4 provides better quality suggestions but may be slower and more expensive.
            </p>
          </div>

          {/* Data Privacy */}
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                id="data-privacy"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="data-privacy" className="ml-2 text-sm font-medium">
                Store resume data locally only
              </label>
            </div>
            <p className="text-xs text-muted-foreground pl-6">
              When enabled, your resume data will only be stored in your browser and not synced to the cloud.
            </p>
          </div>

          {/* Usage Analytics */}
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                id="usage-analytics"
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="usage-analytics" className="ml-2 text-sm font-medium">
                Allow anonymous usage analytics
              </label>
            </div>
            <p className="text-xs text-muted-foreground pl-6">
              Help us improve by allowing anonymous usage data collection. No personal information is collected.
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div>
          {saveStatus === "success" && (
            <span className="flex items-center text-green-600">
              <Check className="h-4 w-4 mr-1" />
              Settings saved successfully
            </span>
          )}
          {saveStatus === "error" && (
            <span className="flex items-center text-destructive">
              <X className="h-4 w-4 mr-1" />
              Failed to save settings
            </span>
          )}
        </div>
        <button
          onClick={saveSettings}
          disabled={isSaving}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <Save className="h-5 w-5 animate-pulse" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              <span>Save Settings</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
