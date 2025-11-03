# AI Chatbot Frontend

A modern, feature-rich chatbot interface built with Next.js and Shadcn UI that integrates with the Helicone AI Gateway to access 100+ AI models from various providers.

## 🚀 Quick Start

### Launch the Frontend App

1. **Navigate to the frontend directory**:
```bash
cd frontend
```

2. **Install dependencies** (if not already installed):
```bash
npm install
```

3. **Configure API URL** (optional):
   
   Create a `.env.local` file in the `frontend` directory:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```
   
   If not set, the frontend will default to `http://localhost:8000`.

4. **Start the development server**:
```bash
npm run dev
```

5. **Open your browser**:
   
   Navigate to [http://localhost:3000](http://localhost:3000)

6. **First-time setup**:
   - Click the settings icon (⚙️) in the top right corner
   - Enter your Helicone API key (get it from [Helicone.ai](https://www.helicone.ai))
   - Select a model from the registry
   - Click "Save"

That's it! You're ready to chat with AI.

## ✨ Features

### 🎯 Core Chat Features

- **💬 Real-Time Streaming Chat**
  - Messages stream in real-time as the AI generates responses
  - No need to wait for complete responses
  - Smooth, responsive chat experience

- **📝 Markdown Support**
  - Assistant responses support full Markdown rendering
  - Code blocks with syntax highlighting
  - Lists, headers, blockquotes, and more
  - GitHub Flavored Markdown (GFM) support

- **⌨️ Keyboard Shortcuts**
  - `Enter` - Send message
  - `Shift + Enter` - Insert new line in message
  - Keyboard-friendly navigation

- **💾 Conversation History**
  - All messages are displayed in chronological order
  - Scrollable message history
  - Auto-scroll to latest message

### 🔧 Configuration & Settings

- **🔑 Helicone API Key Management**
  - Secure storage of API key (stored locally in browser)
  - Password-masked input field
  - Never sent to external servers

- **🤖 Model Selection**
  - Browse 100+ AI models from Helicone registry
  - Search models by name, author, or ID
  - View model details (context length, author, description)
  - Manual model ID entry as fallback
  - Default: `gpt-4o-mini`

- **⚙️ Developer Message (System Prompt)**
  - Optional system instructions for the AI
  - Customize AI behavior and persona
  - Persistent across sessions

- **🏥 API Health Check**
  - Built-in health check functionality
  - Verify backend API connectivity
  - Real-time status feedback

### 💡 User Experience Features

- **🎨 Modern, Clean UI**
  - Beautiful, intuitive interface
  - Similar to popular chat applications
  - Professional design with Shadcn UI components

- **💾 Local Storage**
  - Settings automatically saved to browser
  - Persistent across browser sessions
  - No need to reconfigure on each visit

- **📱 Responsive Design**
  - Works seamlessly on desktop and mobile
  - Adapts to different screen sizes
  - Touch-friendly interface

- **⚡ Loading States**
  - Visual feedback during message processing
  - "Thinking..." indicator while waiting
  - Disabled input during active requests

### 🌐 Multi-Model Support

Access to 100+ AI models from various providers:

- **OpenAI**: GPT-4, GPT-3.5, GPT-4o, GPT-4o-mini, and more
- **Anthropic**: Claude models (Opus, Sonnet, Haiku)
- **Google**: Gemini models
- **Meta**: Llama models
- **And many more** via Helicone registry

### 🔍 Model Registry Integration

- **Automatic Model Fetching**
  - Models loaded from Helicone registry on demand
  - Up-to-date model list
  - Model metadata included (context length, pricing, etc.)

- **Smart Search**
  - Search by model name
  - Search by author
  - Search by model ID
  - Real-time filtering

## 📋 Prerequisites

Before launching the frontend app, ensure you have:

- **Node.js 18+** installed ([Download Node.js](https://nodejs.org/))
- **npm** (comes with Node.js) or **yarn/pnpm**
- **Backend API server running** (see [API README](../api/README.md))
  - The backend should be accessible at `http://localhost:8000` (or your configured URL)
- **Helicone API key** ([Get one here](https://www.helicone.ai))

## 📖 Detailed Setup Instructions

### Step 1: Install Dependencies

Navigate to the frontend directory and install all required packages:

```bash
cd frontend
npm install
```

This will install all dependencies listed in `package.json`, including:
- Next.js 14.2.5
- React 18.3.1
- Shadcn UI components
- Markdown rendering libraries
- And more...

### Step 2: Configure Environment Variables (Optional)

Create a `.env.local` file in the `frontend` directory to customize the API URL:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Note**: If you don't create this file, the app will default to `http://localhost:8000`.

### Step 3: Start the Development Server

Run the development server:

```bash
npm run dev
```

You should see output similar to:
```
▲ Next.js 14.2.5
- Local:        http://localhost:3000
- Ready in 2.3s
```

### Step 4: Open in Browser

Open your web browser and navigate to:

**http://localhost:3000**

You should see the AI Chatbot interface with an empty chat area.

### Step 5: Configure Settings (First Time Only)

1. **Click the Settings icon** (⚙️) in the top right corner of the page
2. **Enter your Helicone API Key**:
   - Get your API key from [Helicone.ai](https://www.helicone.ai)
   - Paste it in the "Helicone API Key" field
   - Your key is stored securely in your browser's local storage
3. **Select a Model**:
   - Models are automatically loaded from the Helicone registry
   - Use the search box to find models by name, author, or ID
   - Default model: `gpt-4o-mini`
   - If models fail to load, you can manually enter a model ID
4. **Configure Developer Message** (Optional):
   - Add system instructions to guide AI behavior
   - Examples: "You are a helpful assistant", "You are a Python expert", etc.
5. **Test API Connection** (Optional):
   - Click "Check API Health" to verify backend connectivity
   - Ensure backend server is running before using the chatbot
6. **Click "Save"** to store your settings

Your settings are automatically saved and will persist across browser sessions.

## 🎮 Using the App

### Starting a Conversation

1. **Type your message** in the text input area at the bottom of the screen
2. **Send the message** using one of these methods:
   - Press `Enter` (sends immediately)
   - Click the "Send" button
   - Press `Shift + Enter` to insert a new line instead

### Interacting with Responses

- **Real-time Streaming**: Watch responses appear word-by-word as the AI generates them
- **Markdown Rendering**: Assistant responses support full Markdown:
  - Code blocks with syntax highlighting
  - Bulleted and numbered lists
  - Headers, bold, italic text
  - Blockquotes
  - And more...
- **Message History**: Scroll up to view previous messages
- **Auto-scroll**: Chat automatically scrolls to show the latest message

### Managing Settings

- **Access Settings**: Click the settings icon (⚙️) in the header anytime
- **Update Configuration**: Modify any setting (API key, model, developer message)
- **Save Changes**: Click "Save" to apply changes
- **Cancel Changes**: Click "Cancel" to discard unsaved changes

### Keyboard Shortcuts

| Key Combination | Action |
|----------------|--------|
| `Enter` | Send message |
| `Shift + Enter` | Insert new line |
| Settings icon click | Open/close settings dialog |

### Tips for Best Experience

1. **Ensure Backend is Running**: The chatbot requires the backend API server to be running
2. **Check API Health**: Use the health check button in settings to verify connectivity
3. **Model Selection**: Different models have different capabilities and pricing
4. **Developer Message**: Use clear, specific instructions for better AI responses
5. **Browser Storage**: Settings are stored locally - they won't sync across devices/browsers

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

## 🛠️ Available Scripts

Run these commands from the `frontend` directory:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server at http://localhost:3000 |
| `npm run build` | Build the app for production |
| `npm start` | Start the production server (requires build first) |
| `npm run lint` | Run ESLint to check for code issues |

### Development Workflow

```bash
# Development mode (hot reload enabled)
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

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

## 📝 Important Notes

### Security & Privacy
- **Local Storage Only**: Your Helicone API key and settings are stored locally in your browser using localStorage
- **No External Transmission**: API keys are never sent to external servers (only to your backend API)
- **Browser-Specific**: Settings are stored per browser and won't sync across devices

### Model Loading
- **On-Demand Loading**: Models are fetched from the Helicone registry when you open the settings dialog
- **Fallback Option**: If model loading fails, you can manually enter a model ID
- **Cached**: Models are cached in memory while the settings dialog is open

### Backend Requirements
- **Required**: The backend API server must be running before using the chatbot
- **Health Check**: Use the "Check API Health" button in settings to verify backend connectivity
- **API Gateway**: The backend routes all requests through Helicone AI Gateway

### Troubleshooting

**App won't start?**
- Ensure Node.js 18+ is installed: `node --version`
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`

**Can't connect to backend?**
- Verify backend is running at the configured URL (default: http://localhost:8000)
- Check `NEXT_PUBLIC_API_URL` environment variable
- Use the health check feature in settings

**Models not loading?**
- Check your internet connection
- Verify Helicone registry API is accessible
- You can still manually enter a model ID

**Settings not saving?**
- Check browser console for errors
- Verify localStorage is enabled in your browser
- Try clearing browser cache and reloading

**Messages not sending?**
- Verify your Helicone API key is correct
- Check that the backend server is running
- Review browser console for error messages
