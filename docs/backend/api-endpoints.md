# API Endpoints

## Overview

The Pebbles backend exposes two main API endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/chat` | POST | Get AI conversational responses |
| `/analyze-form` | POST | Extract form data from speech |

---

## POST `/chat`

Generates conversational responses for different stages of the form-filling process.

### Request Body

```javascript
{
  "context": {
    "formTitle": "Job Application"   // Name of the form
  },
  "state": "INTRO",                  // Conversation state
  "fieldCount": 6,                   // Number of form fields
  "fieldLabels": [                   // Array of field names
    "Full Name",
    "Email",
    "Phone",
    "Company",
    "LinkedIn",
    "Why do you want this job?"
  ],
  "missingFields": [                 // Only for ASK_MISSING state
    "Phone",
    "Company"
  ]
}
```

### State Values

| State | Description | Example Response |
|-------|-------------|------------------|
| `INTRO` | Initial greeting when form opens | "Hi! Let's fill the Job Application. I need your name, email, phone..." |
| `LISTENING_PROMPT` | Quick prompt before listening | "Go ahead!" |
| `FILLING` | Acknowledgment while filling | "Got it! Filling that in." |
| `ASK_MISSING` | Request for missing fields | "Almost there! I still need your phone and company." |
| `DONE` | Form completion message | "All done! Take a look." |

### Response

```javascript
{
  "reply": "Hi! Let's fill the Job Application. I need your name, email, phone, company, LinkedIn, and why you want this job. Go ahead!"
}
```

### Error Handling

If Gemini fails, returns fallback responses:
```javascript
{
  "reply": "Hi! Let's fill the Job Application. I need: Full Name, Email, Phone. Go ahead!"
}
```

---

## POST `/analyze-form`

Extracts form field values from a spoken transcript using Gemini AI.

### Request Body

```javascript
{
  "formFields": [
    {
      "id": "entry.2005620554",
      "label": "Full Name",
      "type": "text"
    },
    {
      "id": "entry.1234567890",
      "label": "Email Address",
      "type": "email"
    }
    // ... more fields
  ],
  "transcript": "Hi my name is John Doe and my email is john@example.com",
  "existingValues": {
    // Previously filled values (for multi-turn)
    "entry.999": "Previous Value"
  }
}
```

### Response

```javascript
{
  "values": {
    "entry.2005620554": "John Doe",
    "entry.1234567890": "john@example.com",
    "entry.999": "Previous Value"   // Preserved from existingValues
  },
  "missingFields": [
    "Phone Number",
    "Company"
  ],
  "filledCount": 3,
  "totalFields": 5,
  "isComplete": false
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `values` | Object | Map of field IDs to extracted values |
| `missingFields` | Array | Labels of unfilled fields |
| `filledCount` | Number | Count of filled fields |
| `totalFields` | Number | Total number of fields |
| `isComplete` | Boolean | True if all fields are filled |

### Fallback Behavior

If Gemini fails (rate limit, error), the endpoint uses regex-based fallback extraction:
- Extracts names using patterns like "my name is X"
- Extracts emails using @ symbol detection
- Extracts phone numbers using digit patterns
- See [Fallback Extraction](./fallback-extraction.md) for details

---

## Error Responses

### 400 Bad Request
```javascript
{
  "error": "Missing formFields or transcript"
}
```

### 500 Internal Server Error
Falls back to regex extraction and returns best-effort results.

---

## Rate Limiting

Both endpoints implement retry with exponential backoff:
- Initial wait: 2000ms
- Max retries: 3
- Backoff multiplier: 2x

See [Rate Limiting](./rate-limiting.md) for details.
