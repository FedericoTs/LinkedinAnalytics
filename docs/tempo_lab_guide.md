# Tempo Lab Guide for LinkedIn Analytics Platform

## Table of Contents

1. [Project Structure](#project-structure)
2. [Component Hierarchy](#component-hierarchy)
3. [State Management](#state-management)
4. [Styling Guidelines](#styling-guidelines)
5. [API Integration](#api-integration)
6. [Database Structure](#database-structure)
7. [Function Organization](#function-organization)
8. [Tempo Lab Features](#tempo-lab-features)
9. [Best Practices](#best-practices)
10. [Common Pitfalls to Avoid](#common-pitfalls-to-avoid)
11. [AI-Assisted Development Tips](#ai-assisted-development-tips)

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

### Neo4j

- **Connection**: Use the Neo4j driver from `src/lib/neo4j.ts`
- **Queries**: Use the `runQuery` function to execute Cypher queries
- **Visualization**: Use D3.js for network visualization

```tsx
// Example: Initializing Neo4j driver
import { initNeo4j, runQuery } from '@/lib/neo4j';

// Initialize the driver
initNeo4j();

// Execute a Cypher query
const result = await runQuery(
  'MATCH (n:User) RETURN n LIMIT 10',
  {} // Parameters
);
```

#### Environment Variables

The Neo4j integration requires the following environment variables:

- `VITE_NEO4J_URI`: The URI of your Neo4j Aura instance
- `VITE_NEO4J_USER`: The username for your Neo4j Aura instance
- `VITE_NEO4J_PASSWORD`: The password for your Neo4j Aura instance

## Database Structure

The LinkedIn Analytics Platform uses Supabase as its primary database and Neo4j for network visualization. Here's the recommended database structure:

### Supabase Tables

#### 1. `users` (extends Supabase Auth)

```sql
create table public.users (
  id uuid references auth.users not null primary key,
  email text not null,
  full_name text,
  avatar_url text,
  linkedin_id text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  subscription_tier text default 'free' not null,
  subscription_status text default 'active' not null,
  subscription_end_date timestamp with time zone
);

-- Enable RLS
alter table public.users enable row level security;

-- Create policies
create policy "Users can view their own data"
  on users for select
  using (auth.uid() = id);

create policy "Users can update their own data"
  on users for update
  using (auth.uid() = id);
```

#### 2. `content_drafts`

```sql
create table public.content_drafts (
  id uuid default uuid_generate_v4() not null primary key,
  user_id uuid references public.users not null,
  title text,
  content text not null,
  content_type text not null,
  template text,
  topic text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  metadata jsonb default '{}'::jsonb
);

-- Enable RLS
alter table public.content_drafts enable row level security;

-- Create policies
create policy "Users can CRUD their own drafts"
  on content_drafts for all
  using (auth.uid() = user_id);
```

#### 3. `published_content`

```sql
create table public.published_content (
  id uuid default uuid_generate_v4() not null primary key,
  user_id uuid references public.users not null,
  draft_id uuid references public.content_drafts,
  title text,
  content text not null,
  content_type text not null,
  published_at timestamp with time zone default now() not null,
  linkedin_post_id text,
  linkedin_share_url text,
  metadata jsonb default '{}'::jsonb
);

-- Enable RLS
alter table public.published_content enable row level security;

-- Create policies
create policy "Users can view and create their own published content"
  on published_content for all
  using (auth.uid() = user_id);
```

#### 4. `content_templates`

```sql
create table public.content_templates (
  id uuid default uuid_generate_v4() not null primary key,
  user_id uuid references public.users,
  name text not null,
  content text not null,
  content_type text not null,
  is_system boolean default false not null,
  created_at timestamp with time zone default now() not null
);

-- Enable RLS
alter table public.content_templates enable row level security;

-- Create policies
create policy "Users can view all templates"
  on content_templates for select
  using (true);

create policy "Users can CRUD their own templates"
  on content_templates for all
  using (auth.uid() = user_id);
```

#### 5. `content_analytics`

```sql
create table public.content_analytics (
  id uuid default uuid_generate_v4() not null primary key,
  content_id uuid references public.published_content not null,
  user_id uuid references public.users not null,
  views integer default 0,
  likes integer default 0,
  comments integer default 0,
  shares integer default 0,
  clicks integer default 0,
  recorded_at timestamp with time zone default now() not null
);

-- Enable RLS
alter table public.content_analytics enable row level security;

-- Create policies
create policy "Users can view their own analytics"
  on content_analytics for select
  using (auth.uid() = user_id);
```

#### 6. `subscriptions`

```sql
create table public.subscriptions (
  id uuid default uuid_generate_v4() not null primary key,
  user_id uuid references public.users not null,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan_id text not null,
  status text not null,
  current_period_start timestamp with time zone not null,
  current_period_end timestamp with time zone not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Enable RLS
alter table public.subscriptions enable row level security;

-- Create policies
create policy "Users can view their own subscriptions"
  on subscriptions for select
  using (auth.uid() = user_id);
```

#### 7. `scheduled_posts`

```sql
create table public.scheduled_posts (
  id uuid default uuid_generate_v4() not null primary key,
  user_id uuid references public.users not null,
  content_id uuid references public.content_drafts not null,
  scheduled_date timestamp with time zone not null,
  status text default 'pending' not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Enable RLS
alter table public.scheduled_posts enable row level security;

-- Create policies
create policy "Users can CRUD their own scheduled posts"
  on scheduled_posts for all
  using (auth.uid() = user_id);
```

### Neo4j Graph Structure

The Neo4j database is used for network visualization and analysis. Here's the recommended graph structure:

#### Nodes

1. **User**: Represents a LinkedIn user
   - Properties: `id`, `name`, `title`, `company`, `industry`

2. **Company**: Represents a company on LinkedIn
   - Properties: `id`, `name`, `industry`, `size`

3. **Post**: Represents a LinkedIn post
   - Properties: `id`, `content`, `published_at`, `type`

#### Relationships

1. **CONNECTED_TO**: Connects two User nodes (LinkedIn connection)
   - Properties: `connection_date`, `strength` (interaction frequency)

2. **WORKS_AT**: Connects a User to a Company
   - Properties: `role`, `start_date`, `end_date`

3. **PUBLISHED**: Connects a User to a Post
   - Properties: `published_at`

4. **ENGAGED_WITH**: Connects a User to a Post (like, comment, share)
   - Properties: `engagement_type`, `engagement_date`

#### Example Cypher Queries

```cypher
// Create a user node
CREATE (u:User {id: $userId, name: $name, title: $title})

// Create a connection between users
MATCH (u1:User {id: $user1Id}), (u2:User {id: $user2Id})
CREATE (u1)-[:CONNECTED_TO {connection_date: datetime(), strength: 1}]->(u2)

// Find all first-degree connections
MATCH (u:User {id: $userId})-[:CONNECTED_TO]-(connection:User)
RETURN connection

// Find all second-degree connections
MATCH (u:User {id: $userId})-[:CONNECTED_TO]-(firstDegree:User)-[:CONNECTED_TO]-(secondDegree:User)
WHERE NOT (u)-[:CONNECTED_TO]-(secondDegree) AND u <> secondDegree
RETURN DISTINCT secondDegree
```

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

### Network Visualization

- Use the Neo4j driver from `src/lib/neo4j.ts` to fetch network data
- Use D3.js force simulation for interactive network graphs
- Implement filtering options to focus on specific connection types
- Handle loading and error states appropriately
- Provide meaningful tooltips and interaction for network nodes

### Edge Functions

- Follow the pattern established in existing edge functions
- Include proper CORS headers in all edge functions
- Handle errors gracefully and return appropriate status codes
- Use the shared code pattern for common functionality

---

By following these guidelines, you'll be able to effectively use Tempo Lab and AI assistance to develop and maintain the LinkedIn Analytics Platform project.
