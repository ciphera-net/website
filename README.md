# Ciphera Website

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-green.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-blue.svg?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Hosted in Switzerland](https://img.shields.io/badge/Hosted%20in-Switzerland-red.svg)](https://en.wikipedia.org/wiki/Switzerland)

The official marketing website for **Ciphera**, a privacy-first platform providing infrastructure and applications built on zero-knowledge principles.

**Where Privacy Still Exists**

## Overview

This website showcases the Ciphera ecosystem, including:

- **Drop**: Privacy-first file sharing with end-to-end encryption
- **Ciphera Auth**: Centralized identity provider with secure authentication
- **Ciphera Captcha**: Bot protection service with visual and PoW challenges
- **Ciphera Relay**: Transactional email infrastructure

## Design System

The website follows the Ciphera design language, matching the Drop frontend:

- **Brand Color**: Orange (#FD5E0F) - used as accent only
- **Neutral Colors**: Full scale (50-900) for UI elements
- **Dark Mode**: Full support with class-based switching
- **Font**: Plus Jakarta Sans
- **Design Patterns**: 
  - Rounded corners (rounded-xl, rounded-3xl)
  - Smooth transitions (duration-200, duration-300)
  - Shadow effects with brand-orange accents
  - Backdrop blur effects
  - Button styles (btn-primary, btn-secondary)

## Technology Stack

- **Framework**: Next.js 16+ (App Router)
- **Styling**: Tailwind CSS with custom design tokens
- **Dark Mode**: `next-themes` with class-based switching
- **Animations**: Framer Motion for smooth interactions
- **Icons**: Radix UI Icons for consistency
- **Type Safety**: Full TypeScript implementation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
website/
├── app/
│   ├── layout.tsx          # Root layout with theme providers
│   ├── page.tsx            # Home/landing page
│   ├── about/
│   │   └── page.tsx        # About Ciphera page
│   ├── products/
│   │   └── page.tsx        # Products showcase
│   └── contact/
│       └── page.tsx        # Contact page
├── components/
│   ├── Header.tsx          # Navigation header
│   ├── Footer.tsx          # Footer component
│   ├── Hero.tsx            # Hero section
│   ├── Features.tsx        # Features section
│   ├── Products.tsx        # Products showcase section
│   ├── ThemeProviders.tsx  # Theme context provider
│   └── ThemeToggle.tsx     # Dark mode toggle
├── styles/
│   └── globals.css         # Global styles matching Drop
├── public/
│   ├── ciphera_icon_no_margins.png
│   └── ciphera_logo_no_margins.png
├── LICENSE
└── README.md
└── docs/
    └── CONTRIBUTING.md     # Contribution guidelines
```

## Development Commands

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run type-check`: Perform TypeScript type checking

## Development Guidelines

### Code Style

- Follow the same code style and patterns as Drop frontend
- Use TypeScript for all new code
- Use functional components with hooks
- Keep components focused and small
- Add comments for complex logic

### Styling

- Use Tailwind CSS for styling
- Follow the brand guidelines (Orange #FD5E0F as accent only)
- Ensure dark mode support on all components
- Use semantic HTML and proper accessibility attributes

### Components

- All components should support dark mode
- Use the design system classes (btn-primary, btn-secondary)
- Maintain consistency with Drop frontend patterns
- Ensure responsive design (mobile-first)

## Deployment

The website can be deployed to:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **Any static hosting service** (after `next build`)

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

## Privacy

This website follows privacy-first principles:
- No tracking or analytics by default
- Minimal data collection
- Respects user privacy preferences

## License

AGPL-3.0
