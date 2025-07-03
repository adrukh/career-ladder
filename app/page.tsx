"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Users,
  Code,
  Settings,
  Share2,
  RotateCcw,
  Eye,
  GitBranch,
  Target,
  Zap,
  CheckCircle,
  Info,
  ChevronRight,
} from "lucide-react"
import { RadarChart } from "../components/RadarChart"
import { RoleComparison } from "../components/RoleComparison"
import { CustomRoleBuilder } from "../components/CustomRoleBuilder"

// Career dimensions and their descriptions
const DIMENSIONS = [
  {
    id: "people",
    name: "People",
    icon: Users,
    color: "blue",
    levels: [
      { label: "learns", description: "Learns quickly from others and consistently steps up when required" },
      { label: "supports", description: "Supports other team members proactively and helps them to be successful" },
      { label: "mentors", description: "Mentors others to accelerate their growth and encourages them to participate" },
      {
        label: "manages",
        description: "Manages team members' career, expectations, performance and belonging through empowerment",
      },
    ],
  },
  {
    id: "scope",
    name: "Work Scope",
    icon: Target,
    color: "green",
    levels: [
      { label: "task", description: "Works on individual tasks and brings them to a successful conclusion" },
      { label: "feature", description: "Breaks down features/epics, plans, owns and ensures their delivery" },
      {
        label: "function",
        description: "Owns a functional aspect of the product; identifies, plans and ensures execution of work",
      },
      {
        label: "product",
        description:
          "Maintains and evangelises a coherent view of the/an entire product; owns business impacting outcomes",
      },
    ],
  },
  {
    id: "org_scope",
    name: "Organizational Scope",
    icon: GitBranch,
    color: "purple",
    levels: [
      {
        label: "individual",
        description: "Acts as a manager of one, organises their own work aligned with the team's goals",
      },
      {
        label: "team",
        description: "Directly impacts the team's success, owns and coordinates work with others in the team",
      },
      { label: "organization", description: "Acts, owns and effects outcomes across teams within product engineering" },
      { label: "company", description: "Has impact across the company; owns and effects outcomes across functions" },
    ],
  },
  {
    id: "process",
    name: "Process",
    icon: Settings,
    color: "orange",
    levels: [
      {
        label: "follows",
        description: "Follows the team processes, delivering a consistent flow of value to production",
      },
      {
        label: "enforces",
        description: "Enforces the team processes, making sure everybody understands the benefits/tradeoffs",
      },
      {
        label: "adjusts",
        description: "Adjusts the team processes, listening to feedback and guiding the team through the changes",
      },
      {
        label: "defines",
        description: "Defines the right processes for the org's maturity level, balancing agility and discipline",
      },
    ],
  },
  {
    id: "technology",
    name: "Technology",
    icon: Code,
    color: "cyan",
    levels: [
      { label: "adopts", description: "Adopts and actively learns the technology and tools defined by the team" },
      {
        label: "specializes",
        description: "Specializes in one or more technologies, is the go-to person, takes initiative to learn new ones",
      },
      {
        label: "evangelizes",
        description: "Researches, creates proofs of concept and introduces new technologies to the team",
      },
      {
        label: "masters",
        description:
          "Has very deep knowledge about the whole technology stack of the system; designs and creates new technologies",
      },
    ],
  },
]

// Predefined roles
const ROLES = [
  {
    id: "junior-engineer",
    name: "Junior Software Engineer",
    track: "Individual Contributor",
    levels: { people: 1, scope: 1, org_scope: 1, process: 1, technology: 1 },
    salary: "$70k - $90k",
    experience: "0-2 years",
    responsibilities: [
      "Write clean, maintainable code",
      "Participate in code reviews",
      "Fix bugs and implement small features",
      "Learn team processes and tools",
    ],
    skills: ["Programming fundamentals", "Version control", "Testing basics", "Communication"],
    nextRoles: ["software-engineer"],
  },
  {
    id: "software-engineer",
    name: "Software Engineer",
    track: "Individual Contributor",
    levels: { people: 2, scope: 2, org_scope: 2, process: 2, technology: 2 },
    salary: "$90k - $120k",
    experience: "2-4 years",
    responsibilities: [
      "Design and implement features independently",
      "Mentor junior developers",
      "Participate in architectural discussions",
      "Lead small projects",
    ],
    skills: ["System design basics", "Code review", "Mentoring", "Project planning"],
    nextRoles: ["senior-engineer", "tech-lead"],
  },
  {
    id: "senior-engineer",
    name: "Senior Software Engineer",
    track: "Individual Contributor",
    levels: { people: 2, scope: 3, org_scope: 2, process: 2, technology: 3 },
    salary: "$120k - $160k",
    experience: "4-7 years",
    responsibilities: [
      "Lead technical design and architecture",
      "Mentor team members",
      "Drive technical excellence",
      "Collaborate across teams",
    ],
    skills: ["Advanced system design", "Leadership", "Cross-team collaboration", "Technical strategy"],
    nextRoles: ["staff-engineer", "tech-lead", "engineering-manager"],
  },
  {
    id: "staff-engineer",
    name: "Staff Engineer",
    track: "Individual Contributor",
    levels: { people: 3, scope: 3, org_scope: 3, process: 3, technology: 4 },
    salary: "$160k - $220k",
    experience: "7+ years",
    responsibilities: [
      "Define technical strategy",
      "Lead cross-team initiatives",
      "Mentor senior engineers",
      "Drive architectural decisions",
    ],
    skills: ["Technical leadership", "Strategic thinking", "Influence without authority", "System architecture"],
    nextRoles: ["principal-engineer", "engineering-manager"],
  },
  {
    id: "tech-lead",
    name: "Tech Lead",
    track: "Technical Leadership",
    levels: { people: 3, scope: 3, org_scope: 2, process: 3, technology: 3 },
    salary: "$130k - $170k",
    experience: "4-6 years",
    responsibilities: [
      "Guide team technical decisions",
      "Coordinate with product and design",
      "Ensure code quality and delivery",
      "Develop team members",
    ],
    skills: ["Technical leadership", "Project management", "Stakeholder communication", "Team coordination"],
    nextRoles: ["senior-engineer", "engineering-manager", "staff-engineer"],
  },
  {
    id: "engineering-manager",
    name: "Engineering Manager",
    track: "Management",
    levels: { people: 4, scope: 3, org_scope: 3, process: 3, technology: 2 },
    salary: "$140k - $180k",
    experience: "5-8 years",
    responsibilities: [
      "Manage and develop team members",
      "Set team goals and priorities",
      "Coordinate with stakeholders",
      "Drive team performance",
    ],
    skills: ["People management", "Performance management", "Strategic planning", "Communication"],
    nextRoles: ["senior-engineering-manager", "director-engineering"],
  },
]

const TRACK_COLORS = {
  "Individual Contributor": "blue",
  "Technical Leadership": "purple",
  Management: "green",
}

export default function CareerLadderApp() {
  const [selectedRole, setSelectedRole] = useState(null)
  const [customRole, setCustomRole] = useState({
    name: "Custom Role",
    levels: { people: 1, scope: 1, org_scope: 1, process: 1, technology: 1 },
  })
  const [showCustom, setShowCustom] = useState(true)
  const [showNearest, setShowNearest] = useState(true)
  const [compareMode, setCompareMode] = useState(false)
  const [compareRoles, setCompareRoles] = useState([null, null])
  const [activeTab, setActiveTab] = useState("explore")

  // Find nearest matching role based on custom levels
  const findNearestRole = (levels) => {
    let minDistance = Number.POSITIVE_INFINITY
    let nearestRole = null

    ROLES.forEach((role) => {
      const distance = DIMENSIONS.reduce((sum, dim) => {
        return sum + Math.pow(levels[dim.id] - role.levels[dim.id], 2)
      }, 0)

      if (distance < minDistance) {
        minDistance = distance
        nearestRole = role
      }
    })

    return nearestRole
  }

  const nearestRole = findNearestRole(customRole.levels)

  // Prepare data for radar chart
  const chartLayers = []

  if (showCustom) {
    chartLayers.push({
      id: "custom",
      label: customRole.name,
      data: DIMENSIONS.map((dim) => ({
        dimension: dim.name,
        value: customRole.levels[dim.id],
        max: 4,
      })),
      color: "hsl(var(--primary))",
      visible: true,
    })
  }

  if (showNearest && nearestRole) {
    chartLayers.push({
      id: "nearest",
      label: `Nearest: ${nearestRole.name}`,
      data: DIMENSIONS.map((dim) => ({
        dimension: dim.name,
        value: nearestRole.levels[dim.id],
        max: 4,
      })),
      color: "hsl(var(--muted-foreground))",
      visible: true,
    })
  }

  if (selectedRole) {
    chartLayers.push({
      id: "selected",
      label: selectedRole.name,
      data: DIMENSIONS.map((dim) => ({
        dimension: dim.name,
        value: selectedRole.levels[dim.id],
        max: 4,
      })),
      color: "hsl(var(--destructive))",
      visible: true,
    })
  }

  const handleShare = async () => {
    const state = {
      customRole,
      selectedRole: selectedRole?.id,
      showCustom,
      showNearest,
      compareMode,
      compareRoles: compareRoles.map((r) => r?.id),
    }

    const url = `${window.location.origin}${window.location.pathname}#${encodeURIComponent(JSON.stringify(state))}`

    try {
      await navigator.clipboard.writeText(url)
      // Could add a toast notification here
    } catch (err) {
      console.error("Failed to copy URL:", err)
    }
  }

  const handleReset = () => {
    setSelectedRole(null)
    setCustomRole({
      name: "Custom Role",
      levels: { people: 1, scope: 1, org_scope: 1, process: 1, technology: 1 },
    })
    setShowCustom(true)
    setShowNearest(true)
    setCompareMode(false)
    setCompareRoles([null, null])
    setActiveTab("explore")
    window.location.hash = ""
  }

  // Load state from URL on mount
  useEffect(() => {
    if (window.location.hash) {
      try {
        const state = JSON.parse(decodeURIComponent(window.location.hash.slice(1)))
        if (state.customRole) setCustomRole(state.customRole)
        if (state.selectedRole) {
          const role = ROLES.find((r) => r.id === state.selectedRole)
          if (role) setSelectedRole(role)
        }
        if (typeof state.showCustom === "boolean") setShowCustom(state.showCustom)
        if (typeof state.showNearest === "boolean") setShowNearest(state.showNearest)
        if (typeof state.compareMode === "boolean") setCompareMode(state.compareMode)
        if (state.compareRoles) {
          const roles = state.compareRoles.map((id) => ROLES.find((r) => r.id === id)).filter(Boolean)
          setCompareRoles(roles)
        }
      } catch (err) {
        console.error("Failed to parse URL state:", err)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Engineering Career Ladder</h1>
              <p className="text-lg text-gray-600">Explore career progression paths and role expectations</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleShare} className="flex items-center gap-2 bg-transparent">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" onClick={handleReset} className="flex items-center gap-2 bg-transparent">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              This tool helps guide career discussions - nothing here constitutes a final decision!
            </AlertDescription>
          </Alert>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Controls */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="explore">Explore</TabsTrigger>
                    <TabsTrigger value="compare">Compare</TabsTrigger>
                  </TabsList>

                  <TabsContent value="explore" className="space-y-4">
                    {/* Custom Role Builder */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-custom">Custom Role</Label>
                        <Switch id="show-custom" checked={showCustom} onCheckedChange={setShowCustom} />
                      </div>

                      {showCustom && (
                        <CustomRoleBuilder role={customRole} onChange={setCustomRole} dimensions={DIMENSIONS} />
                      )}
                    </div>

                    <Separator />

                    {/* Show Nearest Toggle */}
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-nearest">Show Nearest Role</Label>
                      <Switch id="show-nearest" checked={showNearest} onCheckedChange={setShowNearest} />
                    </div>

                    <Separator />

                    {/* Role Selection */}
                    <div className="space-y-3">
                      <Label>Select Role to Highlight</Label>
                      <Select
                        value={selectedRole?.id || ""}
                        onValueChange={(value) => {
                          const role = ROLES.find((r) => r.id === value)
                          setSelectedRole(role || null)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a role..." />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  <TabsContent value="compare" className="space-y-4">
                    <div className="space-y-3">
                      <Label>First Role</Label>
                      <Select
                        value={compareRoles[0]?.id || ""}
                        onValueChange={(value) => {
                          const role = ROLES.find((r) => r.id === value)
                          setCompareRoles([role || null, compareRoles[1]])
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose first role..." />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label>Second Role</Label>
                      <Select
                        value={compareRoles[1]?.id || ""}
                        onValueChange={(value) => {
                          const role = ROLES.find((r) => r.id === value)
                          setCompareRoles([compareRoles[0], role || null])
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose second role..." />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "compare" && compareRoles[0] && compareRoles[1] ? (
              <RoleComparison roles={compareRoles} dimensions={DIMENSIONS} trackColors={TRACK_COLORS} />
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Radar Chart */}
                <div className="xl:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Career Progression Radar</CardTitle>
                      <CardDescription>Visualize skills and responsibilities across key dimensions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RadarChart
                        layers={chartLayers}
                        dimensions={DIMENSIONS}
                        onLayerClick={(layer) => {
                          if (layer.id === "nearest" && nearestRole) {
                            setSelectedRole(nearestRole)
                          }
                        }}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Role Details */}
                <div className="xl:col-span-1">
                  {selectedRole ? (
                    <Card>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-xl">{selectedRole.name}</CardTitle>
                            <CardDescription className="mt-1">
                              {selectedRole.experience} • {selectedRole.salary}
                            </CardDescription>
                          </div>
                          <Badge
                            variant="secondary"
                            className={`bg-${TRACK_COLORS[selectedRole.track]}-100 text-${TRACK_COLORS[selectedRole.track]}-800`}
                          >
                            {selectedRole.track}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Key Responsibilities
                          </h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            {selectedRole.responsibilities.map((resp, index) => (
                              <li key={index} className="flex items-start gap-2">
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
                            {selectedRole.skills.map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {selectedRole.nextRoles && selectedRole.nextRoles.length > 0 && (
                          <>
                            <Separator />
                            <div>
                              <h4 className="font-medium mb-2 flex items-center gap-2">
                                <ChevronRight className="h-4 w-4 text-purple-600" />
                                Career Progression
                              </h4>
                              <div className="space-y-2">
                                {selectedRole.nextRoles.map((nextRoleId, index) => {
                                  const nextRole = ROLES.find((r) => r.id === nextRoleId)
                                  if (!nextRole) return null

                                  return (
                                    <Button
                                      key={index}
                                      variant="ghost"
                                      size="sm"
                                      className="w-full justify-start h-auto p-2"
                                      onClick={() => setSelectedRole(nextRole)}
                                    >
                                      <div className="text-left">
                                        <div className="font-medium text-sm">{nextRole.name}</div>
                                        <div className="text-xs text-muted-foreground">{nextRole.track}</div>
                                      </div>
                                    </Button>
                                  )
                                })}
                              </div>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="h-96 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <Eye className="h-16 w-16 text-gray-400 mx-auto" />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Select a Role</h3>
                          <p className="text-gray-500">Choose a role to explore career details</p>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
