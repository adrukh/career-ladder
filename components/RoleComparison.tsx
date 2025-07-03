"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { CheckCircle, Zap, TrendingUp } from "lucide-react"
import { RadarChart } from "./RadarChart"

interface RoleComparisonProps {
  roles: [any, any]
  dimensions: any[]
  trackColors: Record<string, string>
  onRoleChange?: (index: number, roleId: string) => void
  allRoles?: any[]
}

export function RoleComparison({ roles, dimensions, trackColors, onRoleChange, allRoles = [] }: RoleComparisonProps) {
  const [role1, role2] = roles

  // Color mapping for dimensions (same as radar chart)
  const colorMap: Record<string, { text: string; bg: string; border: string; progress: string }> = {
    blue: { text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", progress: "bg-blue-500" },
    green: { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", progress: "bg-emerald-500" },
    purple: { text: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200", progress: "bg-violet-500" },
    orange: { text: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", progress: "bg-orange-500" },
    cyan: { text: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-200", progress: "bg-cyan-500" }
  }

  if (!role1 || !role2) {
    return (
      <Card className="h-96 flex items-center justify-center">
        <div className="text-center space-y-4">
          <TrendingUp className="h-16 w-16 text-gray-400 mx-auto" />
          <div>
            <h3 className="text-lg font-medium text-gray-900">Select Two Roles</h3>
            <p className="text-gray-500">Choose two roles to compare their requirements and progression</p>
          </div>
        </div>
      </Card>
    )
  }

  // Prepare radar chart data
  const chartLayers = [
    {
      id: "role1",
      label: role1.name,
      data: dimensions.map((dim) => ({
        dimension: dim.name,
        value: role1.levels[dim.id],
        max: 4,
      })),
      color: "#3b82f6",
      visible: true,
    },
    {
      id: "role2", 
      label: role2.name,
      data: dimensions.map((dim) => ({
        dimension: dim.name,
        value: role2.levels[dim.id],
        max: 4,
      })),
      color: "#ef4444",
      visible: true,
    }
  ]

  return (
    <div className="space-y-6">
      {/* Main Comparison Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skill Level Comparison - 2/3 width */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <CardTitle>Skill Level Comparison</CardTitle>
                  <CardDescription>Compare the required skill levels across key dimensions</CardDescription>
                </div>
                {onRoleChange && allRoles.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:min-w-[400px]">
                    <div className="space-y-2">
                      <Label className="text-blue-600 font-medium">First Role</Label>
                      <Select
                        value={role1?.id || ""}
                        onValueChange={(value) => onRoleChange(0, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose first role..." />
                        </SelectTrigger>
                        <SelectContent>
                          {allRoles.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-red-600 font-medium">Second Role</Label>
                      <Select
                        value={role2?.id || ""}
                        onValueChange={(value) => onRoleChange(1, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose second role..." />
                        </SelectTrigger>
                        <SelectContent>
                          {allRoles.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {dimensions.map((dimension) => {
                  const level1 = role1.levels[dimension.id]
                  const level2 = role2.levels[dimension.id]
                  const Icon = dimension.icon
                  const colors = colorMap[dimension.color] || { text: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200", progress: "bg-gray-500" }

                  return (
                    <div key={dimension.id} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-5 w-5 ${colors.text}`} />
                        <h4 className={`font-medium ${colors.text}`}>{dimension.name}</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{role1.name}</span>
                            <span className="font-medium">Level {level1}</span>
                          </div>
                          <Progress 
                            value={(level1 / 4) * 100} 
                            className={`h-3 [&>div]:${colors.progress}`}
                          />
                          <p className="text-xs text-gray-600">{dimension.levels[level1 - 1]?.description}</p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{role2.name}</span>
                            <span className="font-medium">Level {level2}</span>
                          </div>
                          <Progress 
                            value={(level2 / 4) * 100} 
                            className={`h-3 [&>div]:${colors.progress}`}
                          />
                          <p className="text-xs text-gray-600">{dimension.levels[level2 - 1]?.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Radar Chart - 1/3 width */}
        <div className="lg:col-span-1">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-lg">Role Comparison Radar</CardTitle>
              <CardDescription>Visual comparison of skill levels</CardDescription>
            </CardHeader>
            <CardContent>
              <RadarChart
                layers={chartLayers}
                dimensions={dimensions}
              />
              
              {/* Role Labels */}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-medium text-gray-700">{role1.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm font-medium text-gray-700">{role2.name}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[role1, role2].map((role, index) => (
          <Card key={role.id}>
            <CardHeader>
              <CardTitle className="text-lg">{role.name} Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Key Responsibilities
                </h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {role.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  Core Skills
                </h4>
                <div className="flex flex-wrap gap-1">
                  {role.skills.map((skill, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
