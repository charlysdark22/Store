"use client"

import { Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage, type Language } from "@/contexts/language-context"

const languages = [
  { code: "es" as Language, name: "Español", flag: "🇪🇸" },
  { code: "en" as Language, name: "English", flag: "🇺🇸" },
  { code: "fr" as Language, name: "Français", flag: "🇫🇷" },
  { code: "pt" as Language, name: "Português", flag: "🇵🇹" },
  { code: "it" as Language, name: "Italiano", flag: "🇮🇹" },
]

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  const currentLanguage = languages.find((lang) => lang.code === language)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 px-2">
          <Languages className="h-4 w-4 mr-1" />
          <span className="text-sm">{currentLanguage?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={language === lang.code ? "bg-accent" : ""}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
