Skill Tracker

Skill Tracker is a comprehensive web application designed to help users track their learning progress across various skills. It provides a seamless interface for managing skills, logging study sessions, and monitoring overall development.

## Features

- **Skill Management**: Add, view, and manage skills with details like category and difficulty.
- **Progress Tracking**: Log study sessions with hours spent and completion percentages.
- **User Authentication**: Secure login and registration system.
- **User Authorization** : Use RBAC (Role Based Access Control) to manage user permissions.
- **Multi-Language Support**: Built-in support for multiple languages.
- **Responsive Design**: Modern, mobile-friendly interface.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **State Management**: [React Hook Form](https://react-hook-form.com/)
- **Validation** :[Zod](https://zod.dev/)
- **Internationalization**: [next-intl](https://next-intl.vercel.app/)
- **Database**: [Turso](https://turso.com/)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd skill-tracker
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:

   ```env
   COOKIE_NAME= cookie name
   TURSO_CONNECTION_URL= turso connection url
   TURSO_AUTH_TOKEN= turso auth token
   SECRET= secret key was used to hash token
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open the application:
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── [local]/          # Internationalized routes
│   │   ├── (main)/       # Main application layout
│   │   │   ├── dashboard/  # Dashboard section
│   │   │   │   ├── @skills/  # Skills related components
│   │   │   │   ├── @stats/   # Stats related components
│   │   │   │   └── page.tsx  # Dashboard page
│   │   │   ├── page.tsx    # Home page
│   │   │   └── layout.tsx  # Main layout
│   │   └── layout.tsx    # Root layout
│   ├── api/              # API routes
│   └── layout.tsx        # Root layout
├── components/           # Reusable UI components
│   ├── ui/               # Shadcn UI components
│   └── ...
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and libraries
│   ├── api/              # API client functions
│   ├── actions/          # Server actions
│   └── ...
├── proxy.ts         # Middleware for authentication and i18n
├── next.config.ts        # Next.js configuration
└── ...
```

## Development

### Running in Development Mode

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

### Starting Production Server

```bash
npm run start
```

## Scripts

| Script     | Description                           |
| ---------- | ------------------------------------- |
| `dev`      | Starts the development server         |
| `build`    | Builds the application for production |
| `start`    | Starts the production server          |
| `lint`     | Runs ESLint to check for code issues  |
| `lint:fix` | Fixes ESLint issues automatically     |
| `format`   | Formats the code using Prettier       |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the terms of the MIT license.
