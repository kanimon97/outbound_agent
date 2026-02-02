# Voice Agent Frontend

React + TypeScript frontend for the Outbound Voice Agent application. Features an animated 3D orb visualization that responds to voice input/output and tracks conversation latency.

## Features

- **Voice Selection**: Choose from 14 custom voice options
- **3D Orb Visualization**: Animated orb using Three.js that responds to voice levels
- **Latency Tracking**: Real-time display of conversation latency metrics
- **Responsive UI**: Built with shadcn/ui components and Tailwind CSS

## Prerequisites

- Node.js 16+ and npm
- Backend server running (see `backend/README.md`)

## Setup Instructions

### 1. Install Dependencies

```bash
cd accent-orb-main
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `accent-orb-main` directory:

```bash
VITE_BACKEND_URL=http://localhost:8000
```

For production, update `VITE_BACKEND_URL` to your deployed backend URL.

### 3. Run the Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm test` - Run tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   ├── Orb.tsx                 # 3D orb visualization
│   ├── VoiceSelector.tsx       # Voice selection dropdown
│   ├── LatencyIndicator.tsx    # Latency metrics display
│   └── ui/                     # shadcn/ui components
├── hooks/
│   └── useVoiceAgent.ts        # Vapi integration hook
├── lib/
│   ├── voices.ts               # Voice definitions
│   └── utils.ts                # Utility functions
├── pages/
│   └── Index.tsx               # Main page
└── main.tsx                    # Application entry point
```

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Three.js** - 3D graphics (@react-three/fiber, @react-three/drei)
- **Vapi Web SDK** - Voice AI integration
- **shadcn/ui** - UI component library
- **Tailwind CSS** - Styling
- **Vitest** - Testing framework

## Voice Configuration

Custom voices are defined in `src/lib/voices.ts`. Each voice has:
- `id` - Voice identifier from your voice provider
- `name` - Display name in the UI
- `description` - Voice description

To add or modify voices, edit the `BRITISH_VOICES` array in `voices.ts`.

## Development

### Hot Reload

The development server supports hot module replacement (HMR) for instant updates during development.

### Type Checking

TypeScript is configured for strict type checking. Run type checks with:

```bash
npx tsc --noEmit
```

### Testing

Tests are written using Vitest and React Testing Library:

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Deployment

The `dist/` directory can be deployed to any static hosting service:

- **Vercel**: `vercel deploy`
- **Netlify**: Drag and drop `dist/` folder
- **GitHub Pages**: Use `gh-pages` package
- **AWS S3**: Upload `dist/` contents to S3 bucket

**Important**: Update `VITE_BACKEND_URL` environment variable to point to your production backend URL.

## Troubleshooting

### Can't connect to backend
- Verify backend is running on the URL specified in `VITE_BACKEND_URL`
- Check browser console for CORS errors
- Ensure `.env` file exists with correct backend URL

### Microphone not working
- Check browser permissions for microphone access
- Verify you're using HTTPS in production (required for microphone access)
- Test microphone in browser settings

### Orb not animating
- Check browser console for Three.js errors
- Verify WebGL is supported in your browser
- Try disabling browser extensions that might interfere with WebGL

## License

This project is part of the Outbound Voice Agent application.
