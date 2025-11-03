import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface SelectOption {
  value: string
  label: string
  description?: string
}

interface ModelSelectProps {
  value: string
  onValueChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  searchPlaceholder?: string
}

export function ModelSelect({
  value,
  onValueChange,
  options,
  placeholder = "Select model...",
  searchPlaceholder = "Search models...",
}: ModelSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const filteredOptions = !search
    ? options
    : (() => {
        const searchLower = search.toLowerCase()
        return options.filter(
          (opt) =>
            opt.label.toLowerCase().includes(searchLower) ||
            opt.value.toLowerCase().includes(searchLower) ||
            opt.description?.toLowerCase().includes(searchLower)
        )
      })()

  const selectedOption = options.find((opt) => opt.value === value)

  return (
    <div className="w-full">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Select Model</DialogTitle>
          <DialogDescription>
            Choose an AI model from the Helicone registry
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="max-h-[400px] overflow-y-auto space-y-1">
            {filteredOptions.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No models found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onValueChange(option.value)
                    setOpen(false)
                    setSearch("")
                  }}
                  className={cn(
                    "w-full text-left p-3 rounded-md border hover:bg-accent hover:text-accent-foreground transition-colors",
                    value === option.value && "bg-accent border-primary"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{option.label}</div>
                      {option.description && (
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {option.description}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground mt-1 font-mono">
                        {option.value}
                      </div>
                    </div>
                    {value === option.value && (
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </DialogContent>
      </Dialog>
    </div>
  )
}

