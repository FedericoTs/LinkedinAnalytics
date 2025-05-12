# Tempo Lab Guide for LinkedIn Analytics Platform

## Table of Contents

1. [Project Structure](#project-structure)
2. [Component Hierarchy](#component-hierarchy)
3. [State Management](#state-management)
4. [Styling Guidelines](#styling-guidelines)
5. [API Integration](#api-integration)
6. [Function Organization](#function-organization)
7. [Tempo Lab Features](#tempo-lab-features)
8. [Best Practices](#best-practices)
9. [Common Pitfalls to Avoid](#common-pitfalls-to-avoid)
10. [AI-Assisted Development Tips](#ai-assisted-development-tips)

## Project Structure

```
/
├── public/                  # Static assets
├── src/
│   ├── components/          # React components
│   │   ├── auth/            # Authentication components
│   │   ├── dashboard/       # Dashboard components
│   │   ├── editor/          # Content editor components
│   │   ├── pages/           # Page components
│   │   └── ui/              # UI components (shadcn/ui)
│   ├── lib/                 # Utility functions
│   ├── types/               # TypeScript type definitions
│   ├── tempobook/           # Tempo storyboards
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── supabase/
│   ├── functions/           # Supabase Edge Functions
│   ├── migrations/          # Database migrations
│   ├── auth.tsx             # Authentication context
│   └── supabase.ts          # Supabase client
├── tailwind.config.js       # Tailwind CSS configuration
└── vite.config.ts           # Vite configuration
```

### Key Files

- **App.tsx**: Main application component with routing
- **main.tsx**: Application entry point with providers
- **supabase/auth.tsx**: Authentication context provider
- **supabase/supabase.ts**: Supabase client configuration

## Component Hierarchy

```
App
├── AuthProvider
│   ├── Home (Landing Page)
│   ├── LoginForm
│   ├── SignUpForm
│   ├── AuthCallback
│   ├── Dashboard (Protected)
│   │   ├── Sidebar
│   │   ├── TopNavigation
│   │   └── LinkedInAnalyticsDashboard
│   │       ├── ContentCreationHub
│   │       ├── PerformanceMetrics
│   │       ├── NetworkVisualization
│   │       └── RelationshipInsights
│   ├── ContentCreation (Protected)
│   │   ├── Sidebar
│   │   ├── TopNavigation
│   │   └── ContentCreationHub
│   │       ├── ContentTypeSelector
│   │       ├── ContentSettings
│   │       ├── ContentEditor
│   │       ├── ContentPreview
│   │       ├── HashtagRecommendations
│   │       └── PublishOptions
│   └── NetworkAnalysis (Protected)
│       ├── Sidebar
│       ├── TopNavigation
│       ├── NetworkVisualization
│       └── RelationshipInsights
└── Toaster
```

## State Management

### Authentication State

Use the `useAuth` hook from `supabase/auth.tsx` to access authentication state:

```tsx
const { user, loading, signIn, signUp, signOut, signInWithLinkedIn } = useAuth();
```

### Component State

- Use React's `useState` for simple component state
- Use `useEffect` for side effects and data fetching
- Store draft content in `localStorage` for persistence
- Use context for shared state when needed

### Form State

- Use controlled components for form inputs
- Consider React Hook Form for complex forms

## Styling Guidelines

### Tailwind CSS

- Use Tailwind utility classes for styling
- Follow the project's color scheme and design system
- Use the `cn()` utility from `src/lib/utils.ts` to conditionally apply classes

### UI Components

- Use shadcn/ui components from `src/components/ui/`
- Maintain consistent spacing, typography, and colors
- Follow the component API patterns established in the project

## API Integration

### Supabase

- **Authentication**: Use the `useAuth` hook for all auth operations
- **Database**: Use the `supabase` client from `supabase/supabase.ts`
- **Edge Functions**: Call using `supabase.functions.invoke()`

```tsx
// Example: Calling an edge function
const { data, error } = await supabase.functions.invoke(
  "supabase-functions-function-name",
  {
    body: { /* parameters */ },
  }
);
```

### Stripe

- Payment processing is handled through Supabase Edge Functions
- Use the `create-checkout` function for initiating payments
- Use the `get-plans` function to fetch subscription plans

### LinkedIn API

- LinkedIn authentication is handled through Supabase Auth
- Use `signInWithLinkedIn()` from the `useAuth` hook

## Function Organization

### Utility Functions

- Place reusable utility functions in `src/lib/utils.ts`
- Create domain-specific utility files when needed (e.g., `src/lib/content-utils.ts`)

### Component Functions

- Keep component-specific functions within the component file
- Extract complex logic to custom hooks in a `src/hooks/` directory
- Follow the pattern of defining handlers at the top of the component

### Edge Functions

- Organize Supabase Edge Functions in `supabase/functions/`
- Each function should have its own directory with an `index.ts` file
- Share code between functions using the `_shared` directory

## Tempo Lab Features

### Storyboards

- Use storyboards to visualize and test components in isolation
- Create a storyboard for each major component
- Storyboards are stored in `src/tempobook/storyboards/`

### Creating a Storyboard

```tsx
// Example storyboard for a component
export default function ComponentNameStoryboard() {
  return (
    <div className="bg-white p-4">
      <ComponentName {...sampleProps} />
    </div>
  );
}
```

### Design System Builder

- Use the Design System Builder to create and manage reusable components
- Right-click on a component and select "Add to Design System Builder"

### AI Chat

- Use AI Chat for code generation, refactoring, and problem-solving
- Provide clear, specific instructions for best results
- Review and test AI-generated code before integrating

## Best Practices

### Component Design

1. **Single Responsibility**: Each component should do one thing well
2. **Props Interface**: Define TypeScript interfaces for all component props
3. **Default Props**: Provide sensible defaults for optional props
4. **Error Handling**: Handle loading and error states gracefully
5. **Accessibility**: Ensure components are accessible (ARIA attributes, keyboard navigation)

### Performance

1. **Memoization**: Use `useMemo` and `useCallback` for expensive operations
2. **Lazy Loading**: Use React.lazy for code splitting
3. **Virtualization**: Use virtualized lists for large data sets
4. **Image Optimization**: Optimize images with appropriate sizes and formats

### Code Quality

1. **Consistent Naming**: Follow a consistent naming convention
2. **Comments**: Add comments for complex logic
3. **TypeScript**: Use proper TypeScript types for better type safety
4. **Testing**: Write tests for critical functionality

## Common Pitfalls to Avoid

1. **Direct DOM Manipulation**: Avoid direct DOM manipulation; use React's declarative approach
2. **Prop Drilling**: Avoid excessive prop drilling; use context or composition
3. **Huge Components**: Break down large components into smaller, focused ones
4. **Inline Styles**: Prefer Tailwind classes over inline styles
5. **Inconsistent Error Handling**: Handle errors consistently across the application
6. **Ignoring TypeScript Errors**: Address TypeScript errors rather than using `any` or ignoring them
7. **Hardcoded Values**: Avoid hardcoding values that should be configurable
8. **Neglecting Mobile Responsiveness**: Ensure all components work well on mobile devices

## AI-Assisted Development Tips

### Effective Prompting

1. **Be Specific**: Clearly describe what you want to achieve
2. **Provide Context**: Include relevant information about your project
3. **Specify Requirements**: List specific requirements or constraints
4. **Include Examples**: Provide examples of similar code when possible

### Working with Generated Code

1. **Review Thoroughly**: Always review AI-generated code before integrating
2. **Test Functionality**: Test the generated code to ensure it works as expected
3. **Understand the Code**: Make sure you understand how the generated code works
4. **Refactor if Needed**: Don't hesitate to refactor generated code to match your project's style

### Iterative Development

1. **Start Simple**: Begin with a simple implementation and iterate
2. **Break Down Tasks**: Divide complex tasks into smaller, manageable chunks
3. **Feedback Loop**: Use AI to refine and improve your code iteratively

### Using Tempo Lab with AI

1. **Storyboard First**: Create storyboards to visualize components before implementing
2. **Design Mode**: Use Design mode to adjust layout and styling
3. **Code Mode**: Switch to Code mode for detailed implementation
4. **AI Chat**: Use AI Chat for guidance, code generation, and problem-solving
5. **Version Control**: Commit changes regularly using the Git tab

---

## Project-Specific Guidelines

### Content Creation Hub

- Keep the ContentCreationHub component focused on orchestrating the content creation flow
- Extract specific functionality into dedicated components (e.g., ContentEditor, ContentSettings)
- Use the tabs interface to organize different aspects of content creation
- Store draft content in localStorage for persistence

### Authentication Flow

- Use the PrivateRoute component to protect authenticated routes
- Handle authentication callbacks properly in AuthCallback and RedirectHandler
- Use the LinkedIn authentication flow for social login

### Dashboard Components

- Maintain consistent card-based layout for dashboard components
- Use appropriate visualizations for different types of data
- Ensure all dashboard components are responsive

### Edge Functions

- Follow the pattern established in existing edge functions
- Include proper CORS headers in all edge functions
- Handle errors gracefully and return appropriate status codes
- Use the shared code pattern for common functionality

---

By following these guidelines, you'll be able to effectively use Tempo Lab and AI assistance to develop and maintain the LinkedIn Analytics Platform project.
