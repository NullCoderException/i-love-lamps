# I Love Lamps - Development Guide

This document outlines development practices and workflows for the I Love Lamps project.

## Git Workflow

### Branching Strategy

- `main`: Production-ready code
- `develop`: Integration branch for features (optional)
- Feature branches: `feature/description`
- Bug fix branches: `fix/description`
- Documentation branches: `docs/description`

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation changes
- `style:` - Formatting changes
- `refactor:` - Code restructuring without behavior change
- `test:` - Adding or fixing tests
- `chore:` - Maintenance tasks

Example: `feat: add flashlight detail page`

### Pull Request Process

1. Create a feature branch from `main` or `develop`
2. Make changes and commit with descriptive messages
3. Push branch and create PR
4. Ensure tests pass
5. Request review
6. Merge after approval

## Coding Standards

### TypeScript

- Use explicit types (avoid `any`)
- Create interfaces for component props
- Use type guards for runtime type checking
- Leverage generics for reusable components

### React

- Use functional components with hooks
- Break complex components into smaller ones
- Use React Context for state that spans multiple components
- Add meaningful component and prop names

### CSS/Tailwind

- Use Tailwind utility classes
- Create component abstractions for repeated patterns
- Use consistent spacing and sizing scales

## Testing

- Write unit tests for utility functions
- Create component tests for UI components
- Test key user flows with integration tests

## Development Environment

### VS Code Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- GitLens

### Environment Variables

Required variables for local development:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Common Tasks

### Starting Development Server

```bash
npm run dev
```
