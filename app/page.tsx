"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
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
import { RoleCard } from "@/components/RoleCard"
import { TrackHeader } from "@/components/TrackHeader"

// Career dimensions and their descriptions
const DIMENSIONS = [
  {
    id: "people",
    name: "People",
    icon: Users,
    color: "blue",
    levels: [
      { label: "develop", description: "Focuses on personal growth, learns from others, and consistently steps up when required" },
      { label: "support", description: "Supports other team members proactively and helps them to be successful" },
      { label: "manage", description: "Manages individual contributors, setting expectations and developing their careers" },
      {
        label: "lead",
        description: "Leads managers and drives organizational outcomes through empowerment and strategy",
      },
    ],
  },
  {
    id: "work_scope",
    name: "Work Scope",
    icon: Target,
    color: "green",
    levels: [
      { label: "implement", description: "Completes prescribed tasks with clear success criteria defined by others" },
      { label: "design", description: "Creates solutions to achieve defined results, determining how to reach specified outcomes" },
      {
        label: "solve",
        description: "Optimizes problems within constraints, defining optimal results balancing time vs value",
      },
      {
        label: "decide",
        description:
          "Identifies and prioritizes problems worth solving based on business context and strategic impact",
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
        description: "Manages own work effectively, aligning personal contributions with team goals",
      },
      {
        label: "team",
        description: "Coordinates and impacts team success, collaborating effectively with team members",
      },
      { label: "cross-team", description: "Drives outcomes across multiple teams, facilitating cross-team collaboration" },
      { label: "organization", description: "Creates organizational impact, driving outcomes across functions and departments" },
    ],
  },
  {
    id: "process",
    name: "Process",
    icon: Settings,
    color: "orange",
    levels: [
      {
        label: "learn",
        description: "Learns and consistently follows team processes, delivering reliable results",
      },
      {
        label: "teach",
        description: "Helps others understand and succeed with processes, ensuring team-wide adoption",
      },
      {
        label: "adjust",
        description: "Adjusts team processes based on feedback, guiding the team through changes",
      },
      {
        label: "define",
        description: "Defines processes for the organization's maturity level, balancing agility and discipline",
      },
    ],
  },
  {
    id: "technology",
    name: "Technology",
    icon: Code,
    color: "cyan",
    levels: [
      { label: "adopt", description: "Adopts and actively learns the technology and tools defined by the team" },
      {
        label: "promote",
        description: "Helps others succeed with technologies, sharing knowledge and best practices",
      },
      {
        label: "decide",
        description: "Evaluates and selects technologies for the team, creating proofs of concept and technical solutions",
      },
      {
        label: "lead",
        description:
          "Sets technology strategy and direction, guiding organizational technology decisions",
      },
    ],
  },
]

// Predefined roles
const ROLES = [
  {
    id: "software-engineer",
    name: "Software Engineer",
    track: "Individual Contributor",
    levels: { people: 1, work_scope: 1, org_scope: 1, process: 1, technology: 1 },
    responsibilities: [
      "Complete assigned tasks with defined success criteria",
      "Learn and follow team processes consistently",
      "Contribute to team goals and objectives",
      "Seek feedback and guidance when needed",
    ],
    skills: ["Programming fundamentals", "Code review participation", "Learning agility", "Team collaboration"],
    nextRoles: ["senior-engineer"],
  },
  {
    id: "senior-engineer",
    name: "Senior Software Engineer",
    track: "Individual Contributor",
    levels: { people: 2, work_scope: 2, org_scope: 2, process: 2, technology: 2 },
    responsibilities: [
      "Design solutions to achieve defined technical outcomes",
      "Support and mentor team members proactively",
      "Help others succeed with team processes and technologies",
      "Coordinate effectively within the team for successful delivery",
    ],
    skills: ["System design", "Technical mentoring", "Team collaboration", "Process guidance"],
    nextRoles: ["staff-engineer", "engineering-manager"],
  },
  {
    id: "staff-engineer",
    name: "Staff Engineer",
    track: "Individual Contributor",
    levels: { people: 2, work_scope: 3, org_scope: 3, process: 3, technology: 3 },
    responsibilities: [
      "Solve complex problems across teams, balancing time vs value",
      "Lead cross-team initiatives and facilitate collaboration",
      "Support senior engineers and help them succeed",
      "Evaluate and select technologies for teams",
    ],
    skills: ["Technical leadership", "Cross-team collaboration", "Influence without authority", "Technology evaluation"],
    nextRoles: ["principal-engineer", "engineering-manager"],
  },
  {
    id: "engineering-manager",
    name: "Engineering Manager",
    track: "Management",
    levels: { people: 3, work_scope: 3, org_scope: 3, process: 3, technology: 2 },
    responsibilities: [
      "Manage and develop team members",
      "Set team goals and priorities",
      "Coordinate with stakeholders",
      "Drive team performance",
    ],
    skills: ["People management", "Performance management", "Team accountability", "Communication"],
    nextRoles: ["staff-engineer", "director-engineering"],
  },
  {
    id: "principal-engineer",
    name: "Principal Engineer",
    track: "Individual Contributor",
    levels: { people: 2, work_scope: 4, org_scope: 4, process: 3, technology: 4 },
    responsibilities: [
      "Company-wide technical impact",
      "Technical vision",
      "Industry leadership",
      "Architect complex systems"
    ],
    skills: ["Advanced technical leadership", "Industry expertise", "Technical strategy", "System architecture"],
    nextRoles: ["director-engineering"],
  },
  {
    id: "director-engineering",
    name: "Director of Engineering",
    track: "Management",
    levels: { people: 4, work_scope: 4, org_scope: 4, process: 4, technology: 2 },
    responsibilities: [
      "Org-wide leadership",
      "Vision setting",
      "Executive collaboration",
      "Strategic planning"
    ],
    skills: ["Executive leadership", "Vision & strategy", "Business acumen", "Organizational design"],
    nextRoles: ["principal-engineer"],
  },
]

const TRACK_COLORS = {
  "Individual Contributor": "blue",
  "Technical Leadership": "purple",
  Management: "green",
}

export default function CareerLadderApp() {
  const [selectedRole, setSelectedRole] = useState(ROLES[0] || null)
  const [customRole, setCustomRole] = useState({
    name: "Selected Skills",
    levels: { people: 1, work_scope: 1, org_scope: 1, process: 1, technology: 1 },
  })
  const [compareRoles, setCompareRoles] = useState([
    ROLES[1] || ROLES[0], 
    ROLES[2] || ROLES[1] || ROLES[0]
  ])
  const [activeTab, setActiveTab] = useState("define")
  const [showNearestRole, setShowNearestRole] = useState(false)
  const [shareButtonText, setShareButtonText] = useState("Share")
  const [resetButtonText, setResetButtonText] = useState("Reset")

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

  if (activeTab === "explore") {
    // In explore mode, only show selected role
    if (selectedRole) {
      chartLayers.push({
        id: "selected",
        label: selectedRole.name,
        data: DIMENSIONS.map((dim) => ({
          dimension: dim.name,
          value: selectedRole.levels[dim.id],
          max: 4,
        })),
        color: "#3b82f6",
        visible: true,
      })
    }
  } else if (activeTab === "define") {
    // In define mode, show role definition and optionally nearest role
    chartLayers.push({
      id: "custom",
      label: customRole.name,
      data: DIMENSIONS.map((dim) => ({
        dimension: dim.name,
        value: customRole.levels[dim.id],
        max: 4,
      })),
      color: "#3b82f6",
      visible: true,
    })

    if (nearestRole && showNearestRole) {
      chartLayers.push({
        id: "nearest",
        label: `Nearest: ${nearestRole.name}`,
        data: DIMENSIONS.map((dim) => ({
          dimension: dim.name,
          value: nearestRole.levels[dim.id],
          max: 4,
        })),
        color: "#ef4444",
        visible: true,
      })
    }
  } else if (activeTab === "compare") {
    // In compare mode, show the comparison roles (handled elsewhere)
  }

  const handleShare = async () => {
    const state = {
      customRole,
      selectedRole: selectedRole?.id,
      activeTab,
      compareRoles: compareRoles.map((r) => r?.id),
      showNearestRole,
    }

    const url = `${window.location.origin}${window.location.pathname}#${encodeURIComponent(JSON.stringify(state))}`

    try {
      await navigator.clipboard.writeText(url)
      setShareButtonText("Copied!")
      setTimeout(() => setShareButtonText("Share"), 2000)
    } catch (err) {
      console.error("Failed to copy URL:", err)
      setShareButtonText("Failed")
      setTimeout(() => setShareButtonText("Share"), 2000)
    }
  }

  const handleReset = () => {
    setSelectedRole(ROLES[0] || null)
    setCustomRole({
      name: "Selected Skills",
      levels: { people: 1, work_scope: 1, org_scope: 1, process: 1, technology: 1 },
    })
    setCompareRoles([
      ROLES[1] || ROLES[0], 
      ROLES[2] || ROLES[1] || ROLES[0]
    ])
    setActiveTab("define")
    setShowNearestRole(false)
    window.location.hash = ""
    setResetButtonText("Reset!")
    setTimeout(() => setResetButtonText("Reset"), 1500)
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
        if (typeof state.activeTab === "string") setActiveTab(state.activeTab)
        if (state.compareRoles) {
          const roles = state.compareRoles.map((id) => ROLES.find((r) => r.id === id)).filter(Boolean)
          setCompareRoles(roles)
        }
        if (typeof state.showNearestRole === "boolean") setShowNearestRole(state.showNearestRole)
      } catch (err) {
        console.error("Failed to parse URL state:", err)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-3">
                Engineering Career Ladder
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                Explore career progression paths, define custom roles, and understand expectations for engineering positions
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleShare} className="flex items-center gap-2 bg-white border-slate-200 hover:bg-slate-50 shadow-sm">
                <Share2 className="h-4 w-4" />
                {shareButtonText}
              </Button>
              <Button variant="outline" onClick={handleReset} className="flex items-center gap-2 bg-white border-slate-200 hover:bg-slate-50 shadow-sm">
                <RotateCcw className="h-4 w-4" />
                {resetButtonText}
              </Button>
            </div>
          </div>

        </div>

        {/* Tabs Control - Moved outside of left panel */}
        <div className="mb-8">
          <Card className="bg-white border-slate-200 shadow-lg">
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
                  <TabsTrigger value="define">Inspect</TabsTrigger>
                  <TabsTrigger value="explore">Explore</TabsTrigger>
                  <TabsTrigger value="compare">Compare</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {activeTab === "compare" ? (
          /* Compare Mode - Full Width Layout */
          <div className="space-y-8">
            {/* Comparison Results */}
            {compareRoles[0] && compareRoles[1] ? (
              <RoleComparison 
                roles={compareRoles} 
                dimensions={DIMENSIONS} 
                trackColors={TRACK_COLORS}
                onRoleChange={(index, roleId) => {
                  const role = ROLES.find((r) => r.id === roleId)
                  if (index === 0) {
                    setCompareRoles([role || null, compareRoles[1]])
                  } else {
                    setCompareRoles([compareRoles[0], role || null])
                  }
                }}
                allRoles={ROLES}
              />
            ) : (
              <Card className="bg-white border-slate-200 shadow-lg">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                      <CardTitle className="text-xl font-semibold text-gray-900">Skill Level Comparison</CardTitle>
                      <CardDescription className="text-base text-gray-600">
                        Select two roles to compare their requirements and progression
                      </CardDescription>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:min-w-[400px]">
                      <div className="space-y-2">
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

                      <div className="space-y-2">
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
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )}
          </div>
        ) : (
          /* Standard Two-Column Layout for Explore and Define */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar Controls - Expanded */}
            <div className={activeTab === "define" ? "lg:col-span-1" : "lg:col-span-2"}>
              <Card className="sticky top-6 bg-white border-slate-200 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-gray-900">{activeTab === "define" ? "Skills" : "Roles"}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {activeTab === "explore" && (
                    <div className="space-y-6">
                      {/* Career Progression Tree */}
                      <div className="space-y-6">
                        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                          {/* Dynamic Career Tree */}
                          {(() => {
                            // Find entry-level role (role with no predecessors)
                            const entryRole = ROLES.find(role => 
                              !ROLES.some(r => r.nextRoles?.includes(role.id))
                            ) || ROLES[0]
                            
                            // Find roles that are part of the main progression (before branching)
                            const getMainProgression = () => {
                              const progression = []
                              let currentRole = entryRole
                              
                              while (currentRole) {
                                progression.push(currentRole)
                                const nextRoles = currentRole.nextRoles?.map(id => 
                                  ROLES.find(r => r.id === id)
                                ).filter(Boolean) || []
                                
                                // If there's exactly one next role, it's part of main progression
                                // If there are multiple next roles, this is where branching starts
                                if (nextRoles.length === 1) {
                                  currentRole = nextRoles[0]
                                } else {
                                  break
                                }
                              }
                              
                              return progression
                            }
                            
                            const mainProgression = getMainProgression()
                            const branchingRole = mainProgression[mainProgression.length - 1]
                            
                            // Group branching roles by track
                            const branchingRoles = branchingRole?.nextRoles?.map(id => 
                              ROLES.find(r => r.id === id)
                            ).filter(Boolean) || []
                            
                            const rolesByTrack = branchingRoles.reduce((acc, role) => {
                              const track = role.track || 'Other'
                              if (!acc[track]) acc[track] = []
                              acc[track].push(role)
                              return acc
                            }, {})
                            
                            // Get subsequent roles for each track
                            const getTrackProgression = (startRole) => {
                              const progression = [startRole]
                              let currentRole = startRole
                              
                              while (currentRole?.nextRoles?.length > 0) {
                                const nextRole = currentRole.nextRoles
                                  .map(id => ROLES.find(r => r.id === id))
                                  .filter(Boolean)
                                  .find(r => r.track === startRole.track)
                                
                                if (nextRole && !progression.includes(nextRole)) {
                                  progression.push(nextRole)
                                  currentRole = nextRole
                                } else {
                                  break
                                }
                              }
                              
                              return progression
                            }
                            
                            return (
                              <div className="space-y-8">
                                {/* Main Progression */}
                                {mainProgression.map((role, index) => (
                                  <div key={role.id}>
                                    <div className="flex justify-center">
                                      <RoleCard
                                        role={role}
                                        isSelected={selectedRole?.id === role.id}
                                        onClick={() => setSelectedRole(role)}
                                        allRoles={ROLES}
                                        className="w-80"
                                        showModal={false}
                                      />
                                    </div>
                                    {index < mainProgression.length - 1 && (
                                      <>
                                        <div className="hidden sm:flex justify-center my-8">
                                          <div className="w-0.5 h-8 bg-gradient-to-b from-slate-400 to-slate-300"></div>
                                        </div>
                                        <div className="sm:hidden mb-6"></div>
                                      </>
                                    )}
                                  </div>
                                ))}
                                
                                {/* Connecting Line to Branches */}
                                {Object.keys(rolesByTrack).length > 0 && (
                                  <>
                                    <div className="hidden sm:flex justify-center">
                                      <div className="w-0.5 h-8 bg-gradient-to-b from-slate-400 to-slate-300"></div>
                                    </div>
                                    <div className="sm:hidden mb-6"></div>
                                  </>
                                )}
                                
                                {/* Career Tracks */}
                                {Object.keys(rolesByTrack).length > 0 && (
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {Object.entries(rolesByTrack).map(([track, roles]) => {
                                      return (
                                        <div key={track} className="space-y-4">
                                          <TrackHeader 
                                            title={track === 'Individual Contributor' ? 'Tech Leadership Track' : `${track} Track`}
                                            trackType={track === 'Management' ? 'management' : 'technical'}
                                          />
                                          <div className="space-y-4">
                                            {roles.map(role => getTrackProgression(role)).flat().map((role, index, allRoles) => (
                                              <div key={role.id}>
                                                <RoleCard
                                                  role={role}
                                                  isSelected={selectedRole?.id === role.id}
                                                  onClick={() => setSelectedRole(role)}
                                                  allRoles={ROLES}
                                                  showModal={false}
                                                />
                                                {index < allRoles.length - 1 && (
                                                  <div className="flex justify-center py-2">
                                                    <div className="w-0.5 h-6 bg-gradient-to-b from-slate-300 to-slate-200"></div>
                                                  </div>
                                                )}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                )}
                              </div>
                            )
                          })()}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "define" && (
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <CustomRoleBuilder role={customRole} onChange={setCustomRole} dimensions={DIMENSIONS} />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Main Content - Radar Chart and Role Details */}
            <div className={activeTab === "define" ? "lg:col-span-2" : "lg:col-span-1"}>
              <div className="space-y-6">
                <Card className="bg-white border-slate-200 shadow-lg h-fit">
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-gray-900">Career Progression Radar</CardTitle>
                    <CardDescription className="text-base text-gray-600">
                      Visualize skills and responsibilities across key dimensions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <RadarChart
                      layers={chartLayers}
                      dimensions={DIMENSIONS}
                      onLayerClick={(layer) => {
                        if (layer.id === "nearest" && nearestRole) {
                          setSelectedRole(nearestRole)
                        }
                      }}
                      onDimensionClick={activeTab === "define" ? (dimensionId, level) => {
                        setCustomRole(prev => ({
                          ...prev,
                          levels: {
                            ...prev.levels,
                            [dimensionId]: level
                          }
                        }))
                      } : undefined}
                    />
                    
                    
                    {/* Role Labels */}
                    {chartLayers.length > 0 && (
                      <div className="flex justify-between items-start mt-4 pt-4 border-t border-gray-100">
                        <div className="flex flex-col gap-2">
                          {activeTab === "define" && (
                            <>
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span className="text-sm font-medium text-gray-700">{customRole.name}</span>
                              </div>
                              {nearestRole && showNearestRole && (
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                  <span className="text-sm font-medium text-gray-700">Nearest: {nearestRole.name}</span>
                                </div>
                              )}
                            </>
                          )}
                          {activeTab === "explore" && selectedRole && (
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                              <span className="text-sm font-medium text-gray-700">{selectedRole.name}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Toggle for nearest role in inspect view */}
                        {activeTab === "define" && nearestRole && (
                          <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2">
                            <Label htmlFor="nearest-role-toggle" className="text-xs font-medium text-gray-700">
                              Show nearest role
                            </Label>
                            <Switch
                              id="nearest-role-toggle"
                              checked={showNearestRole}
                              onCheckedChange={setShowNearestRole}
                              className="scale-75"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Show selected role details in explore mode */}
                {activeTab === "explore" && selectedRole && (
                  <Card className="bg-white border-slate-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-900">{selectedRole.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Badge 
                          variant="secondary" 
                          className="bg-gray-100 text-gray-800 border-gray-200"
                        >
                          {selectedRole.track}
                        </Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">
                          Key Responsibilities
                        </h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          {selectedRole.responsibilities.map((resp, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 shrink-0" />
                              {resp}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-medium mb-2">
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
                            <h4 className="font-medium mb-2">
                              Career Progression
                            </h4>
                            <div className="space-y-2">
                              {selectedRole.nextRoles.map((nextRoleId, index) => {
                                const nextRole = ROLES.find((r) => r.id === nextRoleId)
                                if (!nextRole) return null

                                return (
                                  <div
                                    key={index}
                                    className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                                    onClick={() => setSelectedRole(nextRole)}
                                  >
                                    <div className="p-1.5 rounded bg-gray-100 text-gray-700">
                                      <div className="w-3 h-3 bg-gray-400 rounded-full" />
                                    </div>
                                    <div className="text-left">
                                      <div className="font-medium text-sm">{nextRole.name}</div>
                                      <div className="text-xs text-gray-500">{nextRole.track}</div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Show nearest role in define mode */}
                {activeTab === "define" && nearestRole && showNearestRole && (
                  <Card className="bg-white border-slate-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-900">Nearest Role Match</CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        Based on your current dimension levels
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RoleCard
                        role={nearestRole}
                        isSelected={false}
                        onClick={() => setSelectedRole(nearestRole)}
                        allRoles={ROLES}
                      />
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer className="mt-12 border-t border-slate-100 bg-slate-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col items-center text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <span>Original version by</span>
                <a 
                  href="https://github.com/csweichel" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Chris Weichel
                </a>
              </div>
              <div className="hidden sm:block text-gray-400">•</div>
              <div className="flex items-center gap-2">
                <span>Source code on</span>
                <a 
                  href="https://github.com/adrukh/career-ladder" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  GitHub
                </a>
              </div>
              <div className="hidden sm:block text-gray-400">•</div>
              <div className="flex items-center gap-2">
                <span>Licensed under</span>
                <span className="font-medium text-gray-800">MIT</span>
                <span>to</span>
                <a 
                  href="https://bsky.app/profile/adrukh.bsky.social" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Anton Drukh
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
