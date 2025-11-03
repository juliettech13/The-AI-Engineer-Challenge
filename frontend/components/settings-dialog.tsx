"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ModelSelect } from "@/components/ui/select"
import { checkHealth } from "@/lib/api"
import { fetchHeliconeModels, type HeliconeModel } from "@/lib/helicone"

interface Settings {
  apiKey: string
  developerMessage: string
  model: string
}

interface SettingsDialogProps {
  isOpen: boolean
  onClose: () => void
  settings: Settings
  onSettingsChange: (settings: Settings) => void
}

export function SettingsDialog({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
}: SettingsDialogProps) {
  const [localSettings, setLocalSettings] = useState<Settings>(settings)
  const [healthStatus, setHealthStatus] = useState<{
    checking: boolean
    status: "ok" | "error" | null
    message: string
  }>({ checking: false, status: null, message: "" })
  const [models, setModels] = useState<HeliconeModel[]>([])
  const [modelsLoading, setModelsLoading] = useState(false)
  const [modelsError, setModelsError] = useState<string | null>(null)
  const [hasFetched, setHasFetched] = useState(false)

  useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  // Fetch models when dialog opens for the first time
  useEffect(() => {
    if (isOpen && !hasFetched && !modelsLoading) {
      setModelsLoading(true)
      setModelsError(null)
      setHasFetched(true)
      fetchHeliconeModels()
        .then((data) => {
          console.log("Fetched models:", data.models?.length || 0)
          setModels(data.models || [])
          setModelsLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching models:", error)
          setModelsError(error instanceof Error ? error.message : "Failed to load models")
          setModelsLoading(false)
        })
    }
  }, [isOpen, hasFetched, modelsLoading])

  // Reset fetch flag when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setHasFetched(false)
    }
  }, [isOpen])

  // Transform models into select options
  const modelOptions = (models || []).map((model) => ({
    value: model.id,
    label: model.name,
    description: model.description || `By ${model.author} • ${(model.contextLength / 1000).toFixed(0)}k context`,
  }))

  const handleSave = () => {
    onSettingsChange(localSettings)
    onClose()
  }

  const handleCheckHealth = async () => {
    setHealthStatus({ checking: true, status: null, message: "" })
    try {
      const response = await checkHealth()
      setHealthStatus({
        checking: false,
        status: "ok",
        message: "API is healthy!",
      })
    } catch (error) {
      setHealthStatus({
        checking: false,
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to connect to API",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your API connection and chat preferences
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">Helicone API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={localSettings.apiKey}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, apiKey: e.target.value })
              }
              placeholder="Enter your Helicone API key"
            />
            <p className="text-xs text-muted-foreground">
              Your API key is stored locally and never sent to our servers. Get your key from{" "}
              <a
                href="https://www.helicone.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Helicone.ai
              </a>
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            {modelsLoading ? (
              <div className="text-sm text-muted-foreground py-2">
                Loading models...
              </div>
            ) : modelsError ? (
              <div className="space-y-2">
                <Input
                  id="model"
                  value={localSettings.model}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, model: e.target.value })
                  }
                  placeholder="Enter model ID manually"
                />
                <p className="text-xs text-red-600">
                  {modelsError}. You can enter a model ID manually.
                </p>
              </div>
            ) : (
              <ModelSelect
                value={localSettings.model}
                onValueChange={(value) =>
                  setLocalSettings({ ...localSettings, model: value })
                }
                options={modelOptions}
                placeholder="Select a model..."
                searchPlaceholder="Search models..."
              />
            )}
            <p className="text-xs text-muted-foreground">
              Select a model from the Helicone registry or enter a model ID manually
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="developerMessage">Developer Message (Optional)</Label>
            <Textarea
              id="developerMessage"
              value={localSettings.developerMessage}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  developerMessage: e.target.value,
                })
              }
              placeholder="System instructions for the AI..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Optional system message to guide AI behavior
            </p>
          </div>
          <div className="space-y-2">
            <Button
              variant="outline"
              onClick={handleCheckHealth}
              disabled={healthStatus.checking}
              className="w-full"
            >
              {healthStatus.checking ? "Checking..." : "Check API Health"}
            </Button>
            {healthStatus.status && (
              <p
                className={`text-xs ${
                  healthStatus.status === "ok"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {healthStatus.message}
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

