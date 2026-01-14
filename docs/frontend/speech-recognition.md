# Speech Recognition

This document explains how the Web Speech API is used for voice input.

---

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full support |
| Edge | ✅ Full support |
| Safari | ⚠️ Partial (webkit prefix) |
| Firefox | ❌ Not supported |

---

## Initialization

```javascript
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// Check if supported
if (!SpeechRecognition) {
    setStatus("Speech recognition not supported. Use Chrome.");
    return;
}
```

---

## Configuration

```javascript
const recognition = new SpeechRecognition();

recognition.continuous = true;      // Keep listening after each result
recognition.interimResults = true;  // Get results while still speaking
recognition.lang = 'en-US';         // Language for recognition
```

### Options Explained

| Option | Value | Purpose |
|--------|-------|---------|
| `continuous` | true | Don't stop after first sentence |
| `interimResults` | true | Show partial results while speaking |
| `lang` | 'en-US' | English recognition model |

---

## Event Handlers

### onresult - Speech Detected

```javascript
recognition.onresult = (event) => {
    let finalTranscript = '';
    let interimTranscript = '';
    
    for (let i = 0; i < event.results.length; i++) {
        const part = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
            finalTranscript += part + ' ';
        } else {
            interimTranscript += part;
        }
    }
    
    const fullTranscript = finalTranscript || interimTranscript;
    setTranscript(fullTranscript);
};
```

**Understanding Results**:
- `event.results` - Array of recognition results
- `isFinal` - True when recognition is confident
- `transcript` - The recognized text

### onend - Recognition Stopped

```javascript
recognition.onend = () => {
    setIsListening(false);
    
    // Cleanup microphone stream
    if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
        mediaStreamRef.current = null;
    }
};
```

### onerror - Error Occurred

```javascript
recognition.onerror = (event) => {
    console.error('Speech error:', event.error);
    setIsListening(false);
    
    if (event.error === 'no-speech') {
        setStatus("No speech detected. Tap to try again.");
    }
    setConversationState('IDLE');
};
```

**Common Errors**:
| Error | Meaning |
|-------|---------|
| `no-speech` | User didn't speak |
| `audio-capture` | No microphone |
| `not-allowed` | Permission denied |
| `network` | Network error |

---

## Starting Recognition

```javascript
const startListening = async () => {
    try {
        // Request microphone permission
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        
        // Setup audio context for visualization
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        analyser.fftSize = 64;
        source.connect(analyser);
        
        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        
        // Clear previous transcript
        setTranscript("");
        setIsListening(true);
        
        // Start recognition
        recognitionRef.current.start();
        
    } catch (error) {
        console.error("Microphone access error:", error);
        setStatus("Microphone access denied.");
    }
};
```

---

## Stopping Recognition

```javascript
const stopListening = () => {
    // Clear silence timeout
    if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
    }
    
    // Stop recognition
    if (recognitionRef.current) {
        try {
            recognitionRef.current.stop();
        } catch (e) {}
    }
    
    // Stop microphone stream
    if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
    }
    
    // Close audio context
    if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
        analyserRef.current = null;
    }
    
    setIsListening(false);
};
```

---

## Silence Detection

The app automatically stops after 2.5 seconds of silence:

```javascript
recognition.onresult = (event) => {
    // ... process results ...
    
    // Reset silence timer on each result
    if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
    }
    
    // Set new timer
    silenceTimeoutRef.current = setTimeout(() => {
        if (transcriptRef.current.trim()) {
            stopListening();
            processTranscript(transcriptRef.current.trim());
        }
    }, 2500);  // 2.5 second silence
};
```

**Why 2.5 seconds?**
- Long enough for natural pauses
- Short enough to feel responsive
- Prevents awkward waiting

---

## Flow Diagram

```
User clicks mic
       │
       ▼
┌──────────────────┐
│ getUserMedia()   │──> Get microphone access
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ recognition.start│──> Start listening
└────────┬─────────┘
         │
    ┌────┴────┐
    │ onresult│──> Update transcript
    └────┬────┘    Reset silence timer
         │
         │ (2.5s silence)
         ▼
┌──────────────────┐
│ stopListening()  │──> Stop recognition
└────────┬─────────┘    Stop media stream
         │
         ▼
┌──────────────────┐
│ processTranscript│──> Send to backend
└──────────────────┘
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| No microphone prompt | Check site permissions in browser |
| "Not allowed" error | Grant microphone permission |
| Recognition not starting | Use Chrome or Edge |
| Poor accuracy | Speak clearly, reduce background noise |
| Stops too early | Increase silence timeout |
