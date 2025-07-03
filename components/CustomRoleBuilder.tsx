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

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="role-name">Role Name</Label>
        <Input
          id="role-name"
          value={role.name}
          onChange={(e) => updateName(e.target.value)}
          placeholder="Enter role name..."
        />
      </div>

      {dimensions.map((dimension) => {
        const Icon = dimension.icon
        const currentLevel = role.levels[dimension.id]
        const levelInfo = dimension.levels[currentLevel - 1]

        return (
          <div key={dimension.id} className="space-y-3">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-gray-600" />
              <Label className="text-sm font-medium">{dimension.name}</Label>
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
