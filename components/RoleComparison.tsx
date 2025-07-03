"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Zap, TrendingUp } from "lucide-react"

interface RoleComparisonProps {
  roles: [any, any]
  dimensions: any[]
  trackColors: Record<string, string>
}

export function RoleComparison({ roles, dimensions, trackColors }: RoleComparisonProps) {
  const [role1, role2] = roles

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

  return (
    <div className="space-y-6">
      {/* Role Headers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[role1, role2].map((role, index) => (
          <Card key={role.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{role.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {role.experience} • {role.salary}
                  </CardDescription>
                </div>
                <Badge
                  variant="secondary"
                  className={`bg-${trackColors[role.track]}-100 text-${trackColors[role.track]}-800`}
                >
                  {role.track}
                </Badge>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Dimension Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Skill Level Comparison</CardTitle>
          <CardDescription>Compare the required skill levels across key dimensions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {dimensions.map((dimension) => {
              const level1 = role1.levels[dimension.id]
              const level2 = role2.levels[dimension.id]
              const Icon = dimension.icon

              return (
                <div key={dimension.id} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-gray-600" />
                    <h4 className="font-medium">{dimension.name}</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{role1.name}</span>
                        <span className="font-medium">Level {level1}</span>
                      </div>
                      <Progress value={(level1 / 4) * 100} className="h-2" />
                      <p className="text-xs text-gray-600">{dimension.levels[level1 - 1]?.description}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{role2.name}</span>
                        <span className="font-medium">Level {level2}</span>
                      </div>
                      <Progress value={(level2 / 4) * 100} className="h-2" />
                      <p className="text-xs text-gray-600">{dimension.levels[level2 - 1]?.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

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
