# System Overview

## What is Pebbles?

Pebbles is a voice-powered AI form-filling assistant that allows users to speak their information naturally and have forms automatically filled in. It uses Google's Gemini AI for natural language understanding and the Web Speech API for voice recognition.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER                                     │
│                    (Speaks into microphone)                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ Speech          │  │ Audio           │  │ Form            │  │
│  │ Recognition     │──│ Visualizer      │  │ Renderer        │  │
│  │ (Web Speech API)│  │ (Web Audio API) │  │ (React)         │  │
│  └────────┬────────┘  └─────────────────┘  └────────▲────────┘  │
│           │                                          │           │
│           ▼                                          │           │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │              State Machine (Conversation Flow)               ││
│  │   IDLE → INTRO → LISTENING → PROCESSING → FILLING → DONE   ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP POST
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js + Express)                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ /chat           │  │ /analyze-form   │  │ Fallback        │  │
│  │ endpoint        │  │ endpoint        │  │ Extraction      │  │
│  └────────┬────────┘  └────────┬────────┘  │ (Regex)         │  │
│           │                    │           └─────────────────┘  │
│           └────────┬───────────┘                                 │
│                    ▼                                             │
│           ┌─────────────────┐                                    │
│           │ Rate Limiter    │                                    │
│           │ (Retry Backoff) │                                    │
│           └────────┬────────┘                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GEMINI AI (Google)                            │
│                    Model: gemini-2.0-flash                       │
│  ┌─────────────────┐  ┌─────────────────┐                       │
│  │ Conversational  │  │ Information     │                       │
│  │ Responses       │  │ Extraction      │                       │
│  └─────────────────┘  └─────────────────┘                       │
└─────────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Frontend (React + Vite)
- **Location**: `/client`
- **Purpose**: User interface, voice capture, form display
- **Key Files**:
  - `src/components/Playground.jsx` - Main demo component
  - `src/pages/HomePage.jsx` - Landing page
  - `src/pages/FeaturesPage.jsx` - Upcoming features

### 2. Backend (Node.js + Express)
- **Location**: `/server`
- **Purpose**: API endpoints, Gemini integration, data processing
- **Key Files**:
  - `index.js` - All server logic

### 3. External Services
- **Gemini AI**: Natural language processing
- **Web Speech API**: Browser-based speech recognition
- **Web Audio API**: Audio visualization

## Request Flow

1. **User clicks mic** → Frontend captures audio
2. **User speaks** → Web Speech API transcribes to text
3. **Silence detected** → Frontend sends transcript to `/analyze-form`
4. **Backend processes** → Gemini extracts field values from text
5. **Response returned** → Frontend animates typing into form fields
6. **Check completion** → If fields missing, AI asks for more info
7. **Loop continues** → Until all fields are filled
