import Settings from "../../components/Settings"

export const metadata = {
  title: "Settings - ResumeTailor",
  description: "Manage your API keys and application settings",
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your API keys and application settings.</p>
      </div>
      <Settings />
    </div>
  )
}
