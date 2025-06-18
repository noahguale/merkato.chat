# Merkato Chat

A multi-provider AI chat application built with Next.js 15, featuring real-time streaming responses and support for multiple AI models including OpenAI GPT, Google Gemini, Claude, and OpenRouter providers.

**Author:** Noah Guale

## Features

### Core Features
- **Multi-Provider AI Support**: OpenAI GPT models, Google Gemini, Anthropic Claude, and OpenRouter
- **Real-time Streaming**: Fast response streaming using Vercel AI SDK
- **Authentication & Sync**: Secure user authentication and data synchronization with Convex
- **Thread Management**: Organize conversations with branching, pinning, and search functionality

### Additional Features
- **Local Storage Threads**: Recent conversations saved locally for quick access
- **Auto-Generated Titles**: Thread titles and tags automatically generated using AI
- **Advanced Search**: Filter threads by tags and content
- **Syntax Highlighting**: Code blocks with customizable styling
- **Keyboard Shortcuts**: Efficient navigation and controls
- **File Attachments**: Support for file uploads in conversations
- **Bring Your Own Keys**: Use your own API keys for AI providers

### Upcoming Features
- **Attachment Support**: Enhanced file upload functionality (currently being fixed)
- **Image Generation**: AI-powered image creation capabilities
- **Resumable Streams**: Pause and resume chat responses
- **Chat Branching**: Create alternative conversation paths
- **Chat Sharing**: Share conversations with others
- **Web Search**: Integrated web search capabilities
- **Voice Generation**: Text-to-speech using Theo's voice
- **Community Features**: Submit your own feature ideas

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS v4
- **Backend**: Convex (real-time database and serverless functions)
- **AI Integration**: Vercel AI SDK with multiple provider support
- **Authentication**: Convex Auth
- **State Management**: Zustand
- **UI Components**: shadcn/ui with custom AI-focused components
- **Encryption**: AES-256-GCM for secure API key storage

## Installation

### Prerequisites
- Node.js 18+
- pnpm (recommended package manager)
- Convex account ([convex.dev](https://convex.dev))

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/merkato.chat.git
   cd merkato.chat
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up Convex**
   ```bash
   npx convex dev
   ```
   Follow the prompts to create a new Convex project or link to an existing one.

4. **Configure environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_CONVEX_URL=your-convex-url
   CONVEX_DEPLOY_KEY=your-convex-deploy-key
   ENCRYPTION_KEY=your-64-character-hex-encryption-key
   ```

5. **Generate encryption key**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Use the output as your `ENCRYPTION_KEY`.

6. **Deploy Convex functions**
   ```bash
   npx convex deploy
   ```

## Usage

### Development
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

### Production
```bash
pnpm build
pnpm start
```

### Available Scripts
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint checks

## Configuration

### AI Providers

The app supports multiple AI providers. Configure your API keys in the application settings:

- **OpenAI**: GPT-4o, GPT-4o Mini, GPT-4 Turbo, GPT-3.5 Turbo
- **Google**: Gemini 2.0 Flash, Gemini 1.5 Pro/Flash  
- **Anthropic**: Claude 3.5 Sonnet
- **OpenRouter**: DeepSeek and other models

API keys are encrypted using AES-256-GCM encryption before being stored in the database.

### Authentication

The app uses Convex Auth with support for external authentication providers. Configure your preferred authentication method in the Convex dashboard.

## Architecture

### Key Components
- **Chat Interface**: Real-time streaming chat with model selection
- **Thread Management**: Conversation organization with branching support
- **Provider System**: Unified interface for multiple AI providers
- **Encryption Layer**: Secure API key storage and retrieval
- **File System**: Attachment support for conversations

### Data Models
- **Threads**: Chat conversations with metadata
- **Messages**: Individual chat messages with status tracking
- **Provider Configs**: Encrypted API key storage
- **Attachments**: File attachment management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

Built for a hackathon as a T3Chat clone, focusing on improved response speeds and multi-model support.