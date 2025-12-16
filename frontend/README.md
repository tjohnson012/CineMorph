# CineMorph Frontend

A premium web application for AI-powered cinematography DNA extraction and remixing.

## Features

- **Extract**: Analyze images to extract cinematographic DNA (lighting, camera, color, atmosphere)
- **Remix**: Fine-tune every aspect of the extracted DNA with intuitive controls
- **Blend**: Merge styles from two different films with adjustable ratios
- **Presets**: Apply signature styles from legendary directors (Kubrick, Tarantino, Wes Anderson, etc.)

## Tech Stack

- **React 18** with TypeScript
- **Vite** for blazing fast development
- **Tailwind CSS v4** for styling
- **Framer Motion** for smooth animations
- **Zustand** for state management
- **React Router v7** for navigation
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8000
```

## Project Structure

```
frontend/
├── src/
│   ├── api/              # API client and requests
│   ├── components/       # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── DNAControls.tsx
│   │   ├── Dropdown.tsx
│   │   ├── ImageUpload.tsx
│   │   ├── Layout.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── Slider.tsx
│   │   └── Toast.tsx
│   ├── pages/            # Page components
│   │   ├── Landing.tsx
│   │   ├── Studio.tsx
│   │   ├── Blend.tsx
│   │   └── Presets.tsx
│   ├── store/            # Zustand store
│   ├── types/            # TypeScript types
│   ├── App.tsx           # Main app component
│   ├── router.tsx        # Route configuration
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── index.html
├── vite.config.ts
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Keyboard Shortcuts

- `E` - Extract DNA (on Studio page)
- `R` - Remix image (on Studio page)
- `P` - Open Presets page

## Design System

### Colors

- Background: `#0a0a0a`
- Surface: `#1a1a1a`
- Primary (Purple): `#7c3aed`
- Accent (Cyan): `#06b6d4`
- Gold: `#f59e0b`
- Text Primary: `#ffffff`
- Text Secondary: `#a1a1aa`
- Border: `#27272a`

### Typography

- Font Family: Inter
- Hero: 72px / 4.5rem, bold
- H2: 48px / 3rem, semibold
- H3: 24px / 1.5rem, medium
- Body: 16px / 1rem, normal

## API Integration

The frontend connects to the FastAPI backend running on `http://localhost:8000` by default.

### Endpoints Used

- `POST /extract` - Extract DNA from image
- `POST /remix` - Remix image with modified DNA
- `POST /blend` - Blend two cinematographic styles
- `GET /presets` - Get available director presets
- `POST /preset` - Apply preset to image
- `POST /export` - Export image in various formats

## License

© 2024 CineMorph. All rights reserved.