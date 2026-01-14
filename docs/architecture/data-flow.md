# Data Flow

## Complete Data Flow Diagram

```
User Voice Input
      │
      ▼
┌──────────────────┐
│ Web Speech API   │
│ (Browser)        │
└────────┬─────────┘
         │ transcript (string)
         ▼
┌──────────────────┐
│ Silence Detection│
│ (2.5s timeout)   │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────────────────┐
│ Frontend: processTranscript()                     │
│                                                   │
│ Sends to Backend:                                │
│ {                                                │
│   formFields: [{id, label, type}, ...],          │
│   transcript: "user's spoken text",              │
│   existingValues: {field_id: "value", ...}       │
│ }                                                │
└────────┬─────────────────────────────────────────┘
         │ POST /analyze-form
         ▼
┌──────────────────────────────────────────────────┐
│ Backend: /analyze-form endpoint                   │
│                                                   │
│ 1. Builds prompt with transcript + field info    │
│ 2. Calls Gemini AI                               │
│ 3. Parses JSON response                          │
│ 4. Merges with existing values                   │
│ 5. Calculates missing fields                     │
└────────┬─────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────┐
│ Gemini AI                                         │
│                                                   │
│ Input: Prompt with transcript + fields           │
│ Output: JSON with extracted values               │
│                                                   │
│ Example:                                         │
│ {"entry.123": "John Doe", "entry.456": "..."}   │
└────────┬─────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────┐
│ Backend Response                                  │
│                                                   │
│ {                                                │
│   values: {field_id: "value", ...},              │
│   missingFields: ["Field Label", ...],           │
│   filledCount: 3,                                │
│   totalFields: 6,                                │
│   isComplete: false                              │
│ }                                                │
└────────┬─────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────┐
│ Frontend: simulateTyping()                        │
│                                                   │
│ 1. Iterates through returned values              │
│ 2. Types each character with 15ms delay          │
│ 3. Updates form state                            │
│ 4. Scrolls to active field                       │
└────────┬─────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────┐
│ Check Completion                                  │
│                                                   │
│ if (isComplete) → Show "Done" state              │
│ else → Call /chat with ASK_MISSING state         │
│        → AI asks for missing fields              │
│        → Start listening again                   │
└──────────────────────────────────────────────────┘
```

## State Transitions

```
IDLE ──(mic click)──> INTRO ──(AI speaks)──> LISTENING
                                                  │
                                                  │ (silence detected)
                                                  ▼
DONE <──(complete)── PROCESSING ──(incomplete)──> LISTENING
  │                      │
  │                      │ (calls /analyze-form)
  │                      │ (calls /chat FILLING)
  │                      │ (animates typing)
  │                      │
  └──(mic click)────> IDLE
```

## Data Structures

### Form Field Object
```javascript
{
  id: "entry.2005620554",    // Unique field identifier
  label: "Full Name",         // Human-readable label
  type: "text"               // Input type: text, email, tel, textarea
}
```

### Transcript to Backend
```javascript
{
  formFields: [
    { id: "entry.123", label: "Full Name", type: "text" },
    { id: "entry.456", label: "Email", type: "email" }
  ],
  transcript: "My name is John Doe and my email is john@example.com",
  existingValues: {}  // Previously filled values
}
```

### Backend Response
```javascript
{
  values: {
    "entry.123": "John Doe",
    "entry.456": "john@example.com"
  },
  missingFields: ["Phone Number", "Company"],
  filledCount: 2,
  totalFields: 4,
  isComplete: false
}
```
