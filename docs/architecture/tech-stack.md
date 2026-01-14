# Technology Stack

## Overview

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Frontend | React | 18.x | UI Components |
| Frontend | Vite | 5.x | Build tool & dev server |
| Frontend | Framer Motion | 11.x | Animations |
| Frontend | Tailwind CSS | 3.x | Styling |
| Frontend | Axios | 1.x | HTTP client |
| Frontend | Lucide React | - | Icons |
| Backend | Node.js | 18+ | Runtime |
| Backend | Express | 4.x | Web framework |
| Backend | @google/generative-ai | 0.x | Gemini AI SDK |
| AI | Gemini 2.0 Flash | - | Language model |

## Frontend Technologies

### React 18
- **Why**: Component-based architecture, hooks for state management
- **Key Features Used**: 
  - `useState` - Local state
  - `useEffect` - Side effects
  - `useRef` - DOM and value references
  - `useCallback` - Memoized callbacks

### Vite
- **Why**: Fast development server, quick builds
- **Config**: `vite.config.js`
- **Environment Variables**: Uses `import.meta.env.VITE_*`

### Framer Motion
- **Why**: Smooth, declarative animations
- **Used For**:
  - Page transitions (`AnimatePresence`)
  - Element entrance animations
  - Mic button pulse effects

### Tailwind CSS
- **Why**: Utility-first, rapid styling
- **Custom Config**: `tailwind.config.js`
- **Custom Colors**: `brand-*` color palette

### Web APIs (Browser)

#### Web Speech API
```javascript
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
```
- **Purpose**: Converts voice to text
- **Support**: Chrome, Edge (webkit prefix needed)
- **Settings**: Continuous mode, interim results

#### Web Audio API
```javascript
const audioContext = new AudioContext();
const analyser = audioContext.createAnalyser();
```
- **Purpose**: Audio visualization
- **Used For**: Real-time waveform display

#### SpeechSynthesis API
```javascript
const utterance = new SpeechSynthesisUtterance(text);
window.speechSynthesis.speak(utterance);
```
- **Purpose**: Text-to-speech for AI responses
- **Voice Selection**: Prefers natural-sounding voices

## Backend Technologies

### Express.js
- **Why**: Simple, flexible web framework
- **Middleware**: 
  - `cors` - Cross-origin requests
  - `express.json()` - JSON parsing

### @google/generative-ai
- **Version**: Latest
- **Model**: `gemini-2.0-flash`
- **Features Used**:
  - `generateContent()` - Text generation
  - JSON output parsing

## External Services

### Google Gemini AI
- **Model**: gemini-2.0-flash
- **Rate Limits**: Free tier has token/minute limits
- **Endpoint**: Called via SDK (not direct HTTP)

### Railway (Deployment)
- **Frontend**: Static site hosting
- **Backend**: Node.js container
- **Auto-deploy**: On GitHub push

## File Structure

```
pebbles/
├── client/                 # Frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── data/          # Mock data
│   │   ├── App.jsx        # Root component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── .env               # Environment variables
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── server/                 # Backend
│   ├── index.js           # All server code
│   ├── .env               # API keys
│   └── package.json
└── docs/                   # Documentation
```
