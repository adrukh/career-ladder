# Engineering Career Ladder

An interactive web application for visualizing engineering career progression, defining custom roles, and comparing skill requirements across different positions. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Inspect View**: Define custom roles by adjusting skill levels across five key dimensions
- **Explore View**: Browse predefined career paths and role requirements
- **Compare View**: Side-by-side comparison of two roles with visual radar charts
- **Interactive Radar Charts**: Visual representation of skill levels using D3.js
- **Shareable URLs**: Generate links to share specific role configurations
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd career-ladder
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Customization for Your Organization

The application is designed to be easily customized for different engineering organizations. The core configuration is defined in two main objects in `app/page.tsx`:

### DIMENSIONS Object

Defines the skill dimensions used to evaluate roles. Each dimension has:

```typescript
{
  id: "unique-identifier",           // Used internally
  name: "Display Name",              // Shown in UI
  icon: IconComponent,               // Lucide React icon
  color: "blue",                     // Color theme (blue, green, purple, orange, cyan)
  levels: [                          // 4 progression levels
    { 
      label: "level-name", 
      description: "What this level means" 
    },
    // ... 3 more levels
  ]
}
```

**Default Dimensions:**
- **People**: Team collaboration and leadership skills
- **Work Scope**: Size and complexity of work ownership
- **Organizational Scope**: Impact across teams and functions
- **Process**: Process improvement and implementation
- **Technology**: Technical depth and innovation

**To customize:** Modify the `DIMENSIONS` array to reflect your organization's values and competency model.

**Important:** When adding or removing dimensions, ensure all existing roles in the `ROLES` array are updated with corresponding level values for the new dimensions.

### ROLES Object

Defines the career progression paths and specific roles. Each role has:

```typescript
{
  id: "unique-identifier",
  name: "Role Title",
  track: "Individual Contributor" | "Management", // Career track
  levels: {                          // Skill levels for each dimension (1-4)
    people: 2,
    work_scope: 3,
    org_scope: 1,
    process: 2,
    technology: 4
  },
  responsibilities: [                // Key responsibilities (array)
    "Responsibility 1",
    "Responsibility 2",
    // ... up to 4 recommended
  ],
  skills: [                          // Core skills (array)
    "Skill 1",
    "Skill 2",
    // ... as many as needed
  ],
  nextRoles: ["role-id-1", "role-id-2"] // Optional: progression paths
}
```

**Default Career Paths:**
- Software Engineer → Senior Software Engineer → Staff Engineer/Engineering Manager
- Staff Engineer → Principal Engineer
- Engineering Manager → Director of Engineering

**To customize:** 
1. Update role titles and descriptions to match your organization
2. Adjust skill level requirements for each role
3. Modify career progression paths in `nextRoles`
4. Add or remove roles as needed

**Adding a New Role:**
1. **Create the role object** with all required fields:
   ```typescript
   {
     id: "unique-role-id",              // Must be unique across all roles
     name: "Role Display Name",         // Shown in UI
     track: "Individual Contributor",   // Or "Management" 
     levels: {                          // Must include ALL dimensions
       people: 2,                       // Level 1-4 for each dimension
       work_scope: 3,
       org_scope: 1,
       process: 2,
       technology: 4
     },
     responsibilities: [                // 3-4 key responsibilities
       "Primary responsibility",
       "Secondary responsibility"
     ],
     skills: [                          // Required skills
       "Skill 1", "Skill 2"
     ],
     nextRoles: ["next-role-id"]        // Optional: career progression
   }
   ```
2. **Add to ROLES array** - The role will automatically appear in dropdowns, charts, and career tree
3. **Update career progression** - Add the role ID to `nextRoles` of preceding roles
4. **Test thoroughly** - Verify the role displays correctly in all views

**Removing a Role:**
1. **Remove from ROLES array** - This will remove it from all UI components
2. **Update `nextRoles`** - Remove references from other roles' progression paths
3. **Check shared URLs** - Existing shared URLs may break if they reference the removed role

**Creating Multiple Career Branches:**

The career tree automatically creates branches based on the `track` field. Each unique `track` value becomes a separate branch in the career ladder. To create 3 branches instead of 2, simply use 3 different track names (e.g., "Individual Contributor", "Management", "Tech Leadership").

### Example Customization

To adapt for a different organization:

```typescript
// Add a new dimension for your org
const DIMENSIONS = [
  // ... existing dimensions
  {
    id: "customer_focus",
    name: "Customer Focus",
    icon: Heart,
    color: "pink",
    levels: [
      { label: "aware", description: "Understands customer needs" },
      { label: "considers", description: "Actively considers customer impact" },
      { label: "advocates", description: "Champions customer experience" },
      { label: "drives", description: "Drives customer-centric decisions" }
    ]
  }
];

// Customize role for your company culture
{
  id: "senior-fullstack-engineer",
  name: "Senior Full-Stack Engineer",
  track: "Individual Contributor",
  levels: { 
    people: 2, 
    work_scope: 2, 
    org_scope: 1, 
    process: 2, 
    technology: 3,
    customer_focus: 2 // New dimension
  },
  responsibilities: [
    "Lead end-to-end feature development",
    "Mentor junior developers",
    "Collaborate with product and design",
    "Ensure code quality and best practices"
  ],
  skills: ["React", "Node.js", "System Design", "Mentoring"],
  nextRoles: ["staff-engineer", "team-lead"]
}
```

## Technical Architecture

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom UI components
- **Charts**: D3.js for radar chart visualization
- **State Management**: React hooks (useState, useEffect)
- **URL Sharing**: State serialization in URL hash
- **Icons**: Lucide React icon library

## File Structure

```
├── app/
│   └── page.tsx              # Main application logic and data
├── components/
│   ├── ui/                   # Reusable UI components
│   ├── RadarChart.tsx        # D3.js radar chart component
│   ├── RoleCard.tsx          # Role display component
│   ├── RoleComparison.tsx    # Side-by-side role comparison
│   ├── CustomRoleBuilder.tsx # Skill level adjustment controls
│   └── TrackHeader.tsx       # Career track headers
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For questions about customization or implementation, please open an issue in the repository.