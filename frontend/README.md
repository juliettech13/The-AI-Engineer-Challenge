# AI Chatbot Frontend

A modern chatbot interface built with Next.js and Shadcn UI that integrates with the Helicone AI Gateway to access 100+ AI models.

## Features

- 🚀 **Streaming Responses** - Real-time streaming chat responses via Helicone AI Gateway
- 🌐 **Multi-Model Support** - Access to 100+ AI models from various providers (OpenAI, Anthropic, Google, Meta, etc.)
- 🔍 **Model Registry** - Browse and search models from the Helicone registry
- 🎨 **Modern UI** - Beautiful chatbot interface similar to popular chat applications
- ⚙️ **Configurable Settings** - Easy configuration of Helicone API key, model selection, and developer messages
- 💾 **Local Storage** - Settings are saved locally in your browser
- 🏥 **Health Check** - Built-in API health check functionality
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)
- The backend API server running (see [API README](../api/README.md))

## Setup

1. **Install dependencies**:

```bash
cd frontend
npm install
```

2. **Configure API URL** (optional):

Create a `.env.local` file in the `frontend` directory:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

If not set, the frontend will default to `http://localhost:8000`.

3. **Run the development server**:

```bash
npm run dev
```

4. **Open your browser**:

Navigate to [http://localhost:3000](http://localhost:3000)

## First Time Setup

1. Get your Helicone API key from [Helicone.ai](https://www.helicone.ai)
2. Click the settings icon (⚙️) in the top right corner
3. Enter your Helicone API key
4. Select a model from the registry (or enter a model ID manually)
   - Models are automatically loaded from the Helicone registry
   - You can search by name, author, or model ID
   - Default: `gpt-4o-mini`
5. Optionally configure:
   - Developer message (system instructions for the AI)
6. Click "Save"
7. Optionally click "Check API Health" to verify the backend is running

## Usage

1. **Start a conversation**: Type your message in the input area at the bottom
2. **Send messages**:
   - Press `Enter` to send
   - Press `Shift + Enter` for a new line
3. **View responses**: Assistant responses appear in real-time as they stream from the API
4. **Manage settings**: Click the settings icon anytime to update your configuration

## Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles and CSS variables
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main page component
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   ├── chatbot.tsx       # Main chatbot component
│   └── settings-dialog.tsx # Settings dialog component
├── lib/                   # Utility functions
│   ├── api.ts            # API integration functions
│   └── utils.ts          # General utilities
└── package.json          # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## API Integration

The frontend integrates with the following API endpoints:

- `POST /api/chat` - Streaming chat endpoint (routes through Helicone AI Gateway)
- `GET /api/health` - Health check endpoint

The backend uses [Helicone AI Gateway](https://docs.helicone.ai/gateway) to access 100+ AI models from various providers. The frontend fetches available models from the Helicone registry API.

See the [API README](../api/README.md) for more details on the backend API.

## Deployment

This frontend is designed to work with Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Set the `NEXT_PUBLIC_API_URL` environment variable to your API URL
4. Deploy!

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Shadcn UI** - Beautiful, accessible UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible component primitives

## Notes

- Your Helicone API key and settings are stored locally in your browser using localStorage
- The frontend automatically saves your settings whenever you update them
- Models are fetched from the Helicone registry when you open the settings dialog
- If model loading fails, you can manually enter a model ID
- Make sure the backend API server is running before using the chatbot
- The backend routes all requests through Helicone AI Gateway, which supports models from OpenAI, Anthropic, Google, Meta, and more
