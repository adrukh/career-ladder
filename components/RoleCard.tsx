"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
  Users,
  Code,
  Crown,
  Settings,
  Target,
  CheckCircle,
  Zap,
  ChevronRight,
  Building,
  Star,
} from "lucide-react"


const TRACK_COLORS = {
  "Individual Contributor": "blue",
  "Technical Leadership": "purple", 
  "Management": "green",
}

interface Role {
  id: string
  name: string
  track: string
  levels: { [key: string]: number }
  salary?: string
  experience?: string
  responsibilities: string[]
  skills: string[]
  nextRoles?: string[]
}

interface RoleCardProps {
  role: Role
  isSelected?: boolean
  isDisabled?: boolean
  onClick?: () => void
  allRoles?: Role[]
  className?: string
  showModal?: boolean
}

export function RoleCard({ role, isSelected = false, isDisabled = false, onClick, allRoles = [], className = "", showModal = true }: RoleCardProps) {
  const cardClasses = `
    group cursor-pointer transition-all duration-200 hover:shadow-lg
    ${isSelected ? 'ring-2 ring-gray-500 shadow-lg' : ''}
    ${isDisabled ? 'opacity-60 cursor-not-allowed hover:shadow-sm' : ''}
    ${className}
  `

  const cardContent = (
    <Card 
      className={`${cardClasses} border-l-4 border-l-gray-400 hover:border-l-gray-600`}
      onClick={!isDisabled ? onClick : undefined}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-gray-900 text-sm leading-tight">
              {role.name}
            </h3>
          </div>
          
          <div className="space-y-2">
            <div className="text-xs text-gray-600">
              {role.responsibilities.map((resp, index) => (
                <div key={index} className="flex items-start gap-1.5">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mt-1.5 shrink-0" />
                  <span className="line-clamp-1">{resp}</span>
                </div>
              ))}
            </div>
            
            <div className="flex items-center">
              <Badge 
                variant="secondary" 
                className="bg-gray-100 text-gray-800 border-gray-200 text-xs"
              >
                {role.track}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (!showModal) {
    return cardContent
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {cardContent}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="space-y-2">
            <DialogTitle className="text-2xl font-semibold text-gray-900">
              {role.name}
            </DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className="bg-gray-100 text-gray-800 border-gray-200"
              >
                {role.track}
              </Badge>
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          <div>
            <h4 className="font-medium mb-3">
              Key Responsibilities
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {role.responsibilities.map((resp, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 shrink-0" />
                  {resp}
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-3">
              Core Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {role.skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {role.nextRoles && role.nextRoles.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium mb-3">
                  Career Progression
                </h4>
                <div className="grid gap-2">
                  {role.nextRoles.map((nextRoleId, index) => {
                    const nextRole = allRoles.find((r) => r.id === nextRoleId)
                    if (!nextRole) return null

                    return (
                      <Button
                        key={index}
                        variant="ghost"
                        className="justify-start h-auto p-3 hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded bg-gray-100 text-gray-700">
                            <div className="w-4 h-4 bg-gray-400 rounded-full" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-sm">{nextRole.name}</div>
                            <div className="text-xs text-gray-500">{nextRole.track}</div>
                          </div>
                        </div>
                      </Button>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}