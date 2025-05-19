# I Love Lamps 🔦

A web application for tracking and managing flashlight collections, built with Next.js, TypeScript, and Supabase.

## Features

### Implemented ✅
- User authentication (sign up, sign in, sign out)
- Protected routes for authenticated users
- Responsive navigation with user status
- Database schema for flashlights, emitters, and user preferences
- TypeScript interfaces for all data models

### Coming Soon 🚧
- Full CRUD operations for flashlight management
- Emitter tracking with color temperature data
- Collection statistics and analytics
- CSV import/export functionality
- AI-powered flashlight recommendations
- Dark/light theme toggle

## Tech Stack

- **Frontend**: Next.js 14+ with App Router, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication)
- **Deployment**: Vercel (planned)
- **State Management**: React Hooks + Supabase Realtime (planned)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/NullCoderException/i-love-lamps.git
   cd i-love-lamps
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Database Setup

1. Run the migration scripts in your Supabase SQL editor:
   - `database/migrations/001_initial_schema.pgsql`
   - `database/migrations/002_sync_types_with_typescript.pgsql`

2. Enable Row Level Security (RLS) policies as defined in the migration files

## Project Structure

```
i-love-lamps/
├── src/
│   ├── app/           # Next.js App Router pages
│   ├── components/    # React components
│   ├── lib/          # Utilities and services
│   ├── types/        # TypeScript type definitions
│   └── middleware.ts # Auth middleware
├── database/         # Migration scripts
├── public/          # Static assets
└── docs/           # Documentation
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

### Contributing

1. Create a feature branch from `main`
2. Make your changes following the coding standards
3. Write/update tests as needed
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with ❤️ for the flashlight enthusiast community
- Inspired by the need for better collection management tools
- Special thanks to the Supabase and Next.js teams for excellent documentation