# NexusAI Frontend

React + TypeScript + Vite frontend application for AI Skill Tree platform.

## 🚀 Development

### Prerequisites
- Node.js 18+ and npm

### Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will be available at: **http://localhost:3000**

### Build for Production

```bash
npm run build
```

Output: `build/` directory

## 📁 Structure

```
src/
├── components/      # React components
│   ├── pages/       # Page components
│   └── ui/          # UI components (shadcn/ui)
├── contexts/        # React contexts
├── types/           # TypeScript types
├── data/            # Static JSON data
├── styles/          # CSS styles
├── App.tsx          # Main app component
└── main.tsx         # Entry point
```

## 🔧 Environment Variables

Create `.env.local`:

```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
```

## 🎨 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Radix UI** - UI components
- **Recharts** - Charts
- **React Context** - State management
