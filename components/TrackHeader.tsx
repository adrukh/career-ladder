"use client"

import { Badge } from "@/components/ui/badge"
import { Users, Code, LucideIcon } from "lucide-react"

interface TrackHeaderProps {
  title: string
  trackType: "management" | "technical"
  className?: string
}

const TRACK_CONFIG = {
  management: {
    icon: Users,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200", 
    textColor: "text-blue-800",
    iconColor: "text-blue-600"
  },
  technical: {
    icon: Code,
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-800", 
    iconColor: "text-purple-600"
  }
}

export function TrackHeader({ title, trackType, className = "" }: TrackHeaderProps) {
  const config = TRACK_CONFIG[trackType]
  const IconComponent = config.icon

  return (
    <div className={`text-center mb-6 ${className}`}>
      <Badge 
        variant="secondary" 
        className={`
          ${config.bgColor} ${config.textColor} ${config.borderColor}
          px-4 py-3 text-sm font-medium border-2
          inline-flex items-center gap-2
          hover:shadow-sm transition-shadow
        `}
      >
        <IconComponent className={`w-4 h-4 ${config.iconColor}`} />
        {title}
      </Badge>
    </div>
  )
}