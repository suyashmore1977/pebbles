# React Components

This document details all React components in the Pebbles frontend.

---

## Component Hierarchy

```
App.jsx
├── Router
│   ├── HomePage.jsx
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   └── Playground.jsx
│   │       └── AudioWaveform.jsx
│   └── FeaturesPage.jsx
```

---

## App.jsx

**Location**: `src/App.jsx`

**Purpose**: Root component with routing setup.

### Code
```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FeaturesPage from './pages/FeaturesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/features" element={<FeaturesPage />} />
      </Routes>
    </Router>
  );
}
```

### Routes
| Path | Component | Description |
|------|-----------|-------------|
| `/` | HomePage | Main landing page with demo |
| `/features` | FeaturesPage | Upcoming features page |

---

## Header.jsx

**Location**: `src/components/Header.jsx`

**Purpose**: Fixed navigation header.

### Props
None

### Features
- Fixed position with blur backdrop
- Logo with mic icon
- Navigation links (Features, How it Works, Demo)
- Join Waitlist CTA button
- Uses React Router `Link` for navigation

### Styling
- Glass morphism effect (`bg-white/80 backdrop-blur-md`)
- Brand color accent

---

## Hero.jsx

**Location**: `src/components/Hero.jsx`

**Purpose**: Landing page hero section.

### Props
None

### Features
- Large headline with gradient text
- Animated entrance using Framer Motion
- CTA buttons (Try Demo, Watch Video)
- Background decorations

---

## Playground.jsx

**Location**: `src/components/Playground.jsx`

**Purpose**: Main interactive form-filling demo. **This is the most complex component.**

### State Variables

| State | Type | Initial | Purpose |
|-------|------|---------|---------|
| `activeForm` | Object/null | null | Currently selected form |
| `conversationState` | String | 'IDLE' | Current conversation state |
| `status` | String | "Ready to help" | Status message displayed |
| `formValues` | Object | {} | Current form field values |
| `transcript` | String | "" | Current speech transcript |
| `isListening` | Boolean | false | Whether mic is active |
| `missingFields` | Array | [] | Fields still needing data |
| `voicesLoaded` | Boolean | false | Whether TTS voices are ready |

### Refs

| Ref | Purpose |
|-----|---------|
| `recognitionRef` | SpeechRecognition instance |
| `isSpeakingRef` | Track if AI is speaking |
| `audioContextRef` | Web Audio context |
| `analyserRef` | Audio analyser for waveform |
| `mediaStreamRef` | Microphone stream |
| `silenceTimeoutRef` | Timeout for speech end |
| `transcriptRef` | Current transcript (for closures) |
| `formValuesRef` | Current values (for closures) |
| `selectedVoiceRef` | Cached TTS voice |

### Key Functions

#### `speak(text)`
Converts text to speech using SpeechSynthesis API.
```javascript
const speak = (text) => {
    return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = selectedVoiceRef.current;
        utterance.rate = 0.95;
        utterance.onend = resolve;
        window.speechSynthesis.speak(utterance);
    });
};
```

#### `startListening()`
Starts microphone and speech recognition.
```javascript
const startListening = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Setup audio context for visualization
    // Start speech recognition
};
```

#### `stopListening()`
Stops recognition and cleans up audio resources.

#### `processTranscript(spokenText)`
Sends transcript to backend, handles response, updates form.
```javascript
const processTranscript = async (spokenText) => {
    const response = await axios.post(`${API_URL}/analyze-form`, {...});
    await simulateTyping(response.data.values);
    // Check if complete or ask for missing
};
```

#### `simulateTyping(data)`
Animates typing characters into form fields.
```javascript
const simulateTyping = async (data) => {
    for (const [key, value] of Object.entries(data)) {
        for (const char of value) {
            await new Promise(r => setTimeout(r, 15));
            setFormValues(prev => ({...prev, [key]: currentStr}));
        }
    }
};
```

#### `handleMicInteraction()`
Main click handler for mic button. Routes to different logic based on `conversationState`.

---

## AudioWaveform.jsx

**Location**: Inside `Playground.jsx` (not separate file)

**Purpose**: Real-time audio visualization.

### Props
| Prop | Type | Description |
|------|------|-------------|
| `isActive` | Boolean | Whether to show waveform |
| `analyser` | AnalyserNode | Web Audio analyser node |

### How It Works
1. Uses `requestAnimationFrame` for smooth animation
2. Gets frequency data from analyser
3. Draws bars with gradient colors
4. Cleans up on unmount

```javascript
const AudioWaveform = ({ isActive, analyser }) => {
    const canvasRef = useRef(null);
    
    useEffect(() => {
        const draw = () => {
            analyser.getByteFrequencyData(dataArray);
            // Draw bars on canvas
            requestAnimationFrame(draw);
        };
        draw();
    }, [isActive, analyser]);
    
    return <canvas ref={canvasRef} />;
};
```

---

## FeaturesPage.jsx

**Location**: `src/pages/FeaturesPage.jsx`

**Purpose**: Displays upcoming features with rich visuals.

### Features
- Three feature cards (Multi-lingual, Extension, E-commerce)
- Animated entrance on scroll
- Gradient backgrounds and glow effects
- Email signup CTA

### Feature Card Structure
```javascript
{
    icon: Globe,            // Lucide icon component
    title: "Multi-Lingual", // Feature name
    description: "...",     // Feature description
    gradient: "from-blue-500 to-cyan-400",
    status: "Coming Q2 2026",
    highlights: ["50+ Languages", ...],
    details: ["Seamless switching", ...]
}
```

---

## Styling Patterns

### Common Tailwind Classes
- `container mx-auto px-6` - Centered container
- `rounded-2xl` - Rounded corners
- `shadow-xl` - Elevation
- `bg-gradient-to-r from-X to-Y` - Gradients
- `transition-all duration-300` - Smooth transitions

### Brand Colors (from tailwind.config.js)
```javascript
brand: {
    50: '#f0f5ff',
    100: '#e0eaff',
    // ...
    600: '#4f46e5',
    700: '#4338ca',
}
```
