# I Love Lamps - Directory Structure

This document outlines the directory structure for the I Love Lamps project. This structure will evolve as development progresses.

## Project Structure

i-love-lamps/
├── .github/ # GitHub workflows
├── public/ # Static assets
├── database/ # Database related
│ ├── migrations/ # Database update scripts
├── src/
│ ├── app/ # Next.js App Router
│ │ ├── api/ # API routes
│ │ ├── auth/ # Auth pages
│ │ ├── collection/ # Collection pages
│ │ └── stats/ # Statistics pages
│ ├── components/ # React components
│ │ ├── flashlights/ # Flashlight components
│ │ ├── layout/ # Layout components
│ │ └── ui/ # Reusable UI components
│ ├── lib/ # Utilities and services
│ │ ├── supabase/ # Supabase client
│ │ ├── hooks/ # Custom React hooks
│ │ └── utils/ # Utility functions
│ └── types/ # TypeScript types
├── .env.example # Example environment variables
├── CLAUDE.md # Project guide for Claude
├── PROJECT_PLAN.md # Project roadmap
├── DIRECTORY_STRUCTURE.md # This file
├── DEVELOPMENT_GUIDE.md # Development guidelines
├── README.md # Public-facing documentation
└── [configuration files] # Various config files

## Component Organization

- **Flashlight Components**: Components specific to flashlight functionality
- **Layout Components**: Navigation, headers, layout containers
- **UI Components**: Reusable UI elements like buttons, cards, forms

This structure will be updated as the project evolves.
