# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run Next.js linting
- `npm install` - Install dependencies (uses pnpm-lock.yaml)

## Project Overview

This is an Engineering Career Ladder web application built with Next.js 14, TypeScript, and Tailwind CSS. It helps visualize engineering career progression through interactive radar charts and role comparisons.

## Core Architecture

### Main Data Models (app/page.tsx)

**DIMENSIONS Array**: Defines the 5 skill dimensions used across all roles:
- `people` - Team collaboration and leadership (Users icon, blue)
- `work_scope` - Size/complexity of work ownership (Target icon, green) 
- `org_scope` - Organizational impact scope (GitBranch icon, purple)
- `process` - Process improvement capabilities (Settings icon, orange)
- `technology` - Technical depth and innovation (Code icon, cyan)

Each dimension has 4 progressive levels with labels and descriptions.

**ROLES Array**: Defines all career roles with:
- Skill levels (1-4) for each dimension
- Career track ("Individual Contributor" or "Management")  
- Responsibilities and skills arrays
- Next role progression paths (`nextRoles`)

### Key Components

- `RadarChart.tsx` - D3.js visualization of skill levels across dimensions
- `RoleComparison.tsx` - Side-by-side role comparison with dual radar charts
- `CustomRoleBuilder.tsx` - Interactive sliders for adjusting skill levels
- `RoleCard.tsx` - Display component for individual roles
- `TrackHeader.tsx` - Career track section headers

### State Management

- URL hash serialization for shareable role configurations
- React hooks for local state (no external state management)
- Theme provider for dark/light mode

## UI Framework

- **shadcn/ui components** - Comprehensive component library in `components/ui/`
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library

## Adding New Roles

To add a new role to the career ladder:

### 1. Create the Role Object

Add a new role object to the ROLES array in `app/page.tsx`:

```typescript
{
  id: "unique-role-id",              // Must be unique across all roles
  name: "Role Display Name",         // Shown in UI
  track: "Individual Contributor",   // or "Management"
  levels: {                          // Must include ALL 5 dimensions (1-4)
    people: 2,
    work_scope: 3,
    org_scope: 1,
    process: 2,
    technology: 4
  },
  responsibilities: [                // 3-4 key responsibilities
    "Primary responsibility description",
    "Secondary responsibility description",
    "Additional key responsibility"
  ],
  skills: [                          // Required technical/soft skills
    "Technical Skill 1",
    "Technical Skill 2", 
    "Soft Skill 1"
  ],
  nextRoles: ["next-role-id"]        // Optional: career progression paths
}
```

### 2. Update Career Progression

- Add the new role's `id` to the `nextRoles` array of any preceding roles
- If this role leads to other roles, include their IDs in this role's `nextRoles`

### 3. Validation

The role will automatically appear in:
- Explore view dropdown menus
- Compare view role selectors  
- Career progression tree
- Radar chart visualizations

### 4. Testing

- Verify role displays correctly in all three main views (Inspect, Explore, Compare)
- Test radar chart renders properly with the skill levels
- Confirm career progression links work as expected

## Adding New Dimensions

To add a new skill dimension to the career ladder:

### 1. Create the Dimension Object

Add a new dimension object to the DIMENSIONS array in `app/page.tsx`:

```typescript
{
  id: "unique_dimension_id",         // Must be unique, use snake_case
  name: "Dimension Display Name",    // Shown in UI
  icon: IconComponent,               // Import from lucide-react
  color: "blue",                     // Available: blue, green, purple, orange, cyan
  levels: [                          // Exactly 4 progression levels
    { 
      label: "level1-name", 
      description: "What this level means for this dimension" 
    },
    { 
      label: "level2-name", 
      description: "Higher level description" 
    },
    { 
      label: "level3-name", 
      description: "Advanced level description" 
    },
    { 
      label: "level4-name", 
      description: "Expert level description" 
    }
  ]
}
```

### 2. Update All Existing Roles

**CRITICAL**: Every role in the ROLES array must be updated to include the new dimension:

```typescript
// Example: Adding "customer_focus" dimension
{
  id: "software-engineer",
  name: "Software Engineer",
  // ... other properties
  levels: {
    people: 1,
    work_scope: 1,
    org_scope: 1,
    process: 1,
    technology: 2,
    customer_focus: 1  // Add this line to EVERY role
  },
  // ... rest of role
}
```

### 3. Import Required Icon

Add the icon import at the top of `app/page.tsx`:

```typescript
import {
  // ... existing imports
  Heart,  // Example: if using Heart icon for new dimension
} from "lucide-react"
```

### 4. Validation

The new dimension will automatically appear in:
- Radar charts with the new axis
- Custom role builder sliders
- Role comparison charts
- All dimension-based UI components

### 5. Testing

- Verify radar charts render correctly with the new dimension
- Test that all roles display the new dimension level
- Confirm sliders work in custom role builder
- Check that role comparisons show the new dimension

## Important Files

- `app/page.tsx` - Main application logic, DIMENSIONS and ROLES data
- `components/RadarChart.tsx` - D3.js chart rendering logic
- `tailwind.config.ts` - Theme configuration and custom colors
- `components.json` - shadcn/ui component configuration

## Development Notes

- Uses Next.js App Router (not Pages Router)
- TypeScript strict mode enabled
- All components use client-side rendering ("use client" directive)
- Responsive design with mobile-first approach
- D3.js integrated for data visualization (not chart libraries like Recharts)