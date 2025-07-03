"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface CustomRoleBuilderProps {
  role: {
    name: string
    levels: Record<string, number>
  }
  onChange: (role: any) => void
  dimensions: Array<{
    id: string
    name: string
    icon: any
    color: string
    levels: Array<{
      label: string
      description: string
    }>
  }>
}

export function CustomRoleBuilder({ role, onChange, dimensions }: CustomRoleBuilderProps) {
  const updateLevel = (dimensionId: string, value: number) => {
    onChange({
      ...role,
      levels: {
        ...role.levels,
        [dimensionId]: value,
      },
    })
  }

  const updateName = (name: string) => {
    onChange({
      ...role,
      name,
    })
  }

  // Color mapping for dimensions (same as radar chart)
  const colorMap: Record<string, { text: string; bg: string; border: string }> = {
    blue: { text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
    green: { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
    purple: { text: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200" },
    orange: { text: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
    cyan: { text: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-200" }
  }

  return (
    <div className="space-y-4">
      {dimensions.map((dimension) => {
        const Icon = dimension.icon
        const currentLevel = role.levels[dimension.id]
        const levelInfo = dimension.levels[currentLevel - 1]
        const colors = colorMap[dimension.color] || { text: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200" }

        return (
          <div key={dimension.id} className="space-y-3">
            <div className="flex items-center gap-2">
              <Icon className={`h-4 w-4 ${colors.text}`} />
              <Label className={`text-sm font-medium ${colors.text}`}>{dimension.name}</Label>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Level {currentLevel}</span>
                <span>{levelInfo?.label}</span>
              </div>

              <Slider
                value={[currentLevel]}
                onValueChange={([value]) => updateLevel(dimension.id, value)}
                min={1}
                max={4}
                step={1}
                className="w-full"
              />

              {levelInfo && <p className="text-xs text-gray-500 leading-relaxed">{levelInfo.description}</p>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
