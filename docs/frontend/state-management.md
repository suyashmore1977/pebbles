# State Management

This document explains the conversation state machine in Pebbles.

---

## State Machine Overview

The `conversationState` variable controls the entire user interaction flow.

```
┌─────────────────────────────────────────────────────────────────┐
│                      STATE MACHINE                               │
│                                                                 │
│   IDLE ──> INTRO ──> LISTENING ──> PROCESSING ──> LISTENING    │
│     ▲                                    │                      │
│     │                                    │ (complete)           │
│     │                                    ▼                      │
│     └────────────────────────────────── DONE                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## States Explained

### IDLE
**Initial state** - Waiting for user to start.

| Property | Value |
|----------|-------|
| Mic visible | ✅ Yes |
| Mic action | Click to start |
| Status | "Ready to help" |
| AI Speaking | ❌ No |
| Listening | ❌ No |

**Entry Points**:
- Page load
- Form close
- Error recovery
- Reset after DONE

**Exit Points**:
- User clicks mic → INTRO

---

### INTRO
**AI introduces itself** - Greeting and listing fields.

| Property | Value |
|----------|-------|
| Mic visible | ✅ Yes (disabled) |
| Mic action | None (disabled) |
| Status | "AI Thinking..." then "AI Speaking..." |
| AI Speaking | ✅ Yes |
| Listening | ❌ No |

**Actions**:
1. Call `/chat` with state "INTRO"
2. Speak the greeting
3. Transition to LISTENING

**Exit Points**:
- AI finishes speaking → LISTENING

---

### LISTENING
**Microphone active** - Capturing user speech.

| Property | Value |
|----------|-------|
| Mic visible | ✅ Yes (red, pulsing) |
| Mic action | Click to stop & process |
| Status | "Listening..." or showing transcript |
| AI Speaking | ❌ No |
| Listening | ✅ Yes |

**Actions**:
1. Display real-time waveform
2. Show interim transcript
3. Wait for silence (2.5s)

**Exit Points**:
- Silence detected → PROCESSING
- User clicks mic → PROCESSING
- No speech → IDLE

---

### PROCESSING
**Analyzing speech** - Sending to backend, filling form.

| Property | Value |
|----------|-------|
| Mic visible | ✅ Yes (spinning loader) |
| Mic action | None (disabled) |
| Status | "Processing..." |
| AI Speaking | ✅ Yes (acknowledgment) |
| Listening | ❌ No |

**Actions**:
1. Send transcript to `/analyze-form`
2. Speak acknowledgment
3. Animate typing into fields
4. Check completion

**Exit Points**:
- All fields filled → DONE
- Missing fields → LISTENING (loop)
- Error → IDLE

---

### DONE
**Form complete** - All fields filled.

| Property | Value |
|----------|-------|
| Mic visible | ✅ Yes (green checkmark) |
| Mic action | Click to reset |
| Status | "Form Complete!" |
| AI Speaking | ✅ Yes (completion message) |
| Listening | ❌ No |

**Actions**:
1. Speak completion message
2. Show green checkmark
3. Display "Gemini 2.0 Flash" badge

**Exit Points**:
- User clicks mic → IDLE (reset)

---

## State Transitions Code

```javascript
const handleMicInteraction = async () => {
    if (conversationState === 'IDLE') {
        setConversationState('INTRO');
        // ... get greeting from API
        await speak(greeting);
        setConversationState('LISTENING');
        await startListening();
    }
    
    if (conversationState === 'LISTENING' && isListening) {
        stopListening();
        if (transcript.trim()) {
            processTranscript(transcript.trim());
        } else {
            setConversationState('IDLE');
        }
    }
    
    if (conversationState === 'DONE') {
        // Reset everything
        setConversationState('IDLE');
        setFormValues({});
        setTranscript("");
        setMissingFields([]);
    }
};
```

---

## Processing Flow

```javascript
const processTranscript = async (spokenText) => {
    setConversationState('PROCESSING');
    
    const response = await axios.post(`${API_URL}/analyze-form`, {...});
    
    if (values) {
        await speak("Got it!");
        await simulateTyping(values);
    }
    
    if (isComplete) {
        setConversationState('DONE');
        await speak("All done!");
    } else {
        // Ask for missing fields and loop
        await speak("I still need...");
        setConversationState('LISTENING');
        await startListening();  // Loop back
    }
};
```

---

## Visual Feedback by State

| State | Mic Color | Mic Icon | Animation |
|-------|-----------|----------|-----------|
| IDLE | Brand blue | Microphone | None |
| INTRO | Brand blue | Spinner | Pulse glow |
| LISTENING | Red | Mic Off | Pulse ring |
| PROCESSING | Brand blue | Spinner | Pulse glow |
| DONE | Green | Checkmark | None |

---

## Error Recovery

All errors return to IDLE state:
```javascript
} catch (error) {
    console.error("Error:", error);
    setStatus("Error occurred. Tap to retry.");
    setConversationState('IDLE');
}
```

---

## Using Refs for State

Some state uses refs instead of useState to avoid stale closures:

```javascript
const transcriptRef = useRef("");
const formValuesRef = useRef({});

// Keep refs in sync
useEffect(() => {
    transcriptRef.current = transcript;
}, [transcript]);

useEffect(() => {
    formValuesRef.current = formValues;
}, [formValues]);
```

**Why?**
- Callbacks in event handlers can capture stale state
- Refs always have current value
- Critical for `onresult` and `processTranscript`
