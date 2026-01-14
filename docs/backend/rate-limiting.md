# Rate Limiting & Retry Logic

## Overview

Gemini AI has rate limits on the free tier. This document explains how Pebbles handles rate limits gracefully.

---

## Rate Limit Errors

Gemini returns these errors when rate limited:
- HTTP 429 (Too Many Requests)
- Error message containing "RESOURCE_EXHAUSTED"
- Error message containing "Too Many Requests"

---

## Retry with Exponential Backoff

### Implementation

```javascript
async function retryWithBackoff(fn, maxRetries = 3, initialDelay = 2000) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            const isRateLimit = error.message?.includes('429') ||
                error.message?.includes('Too Many Requests') ||
                error.message?.includes('RESOURCE_EXHAUSTED');

            if (isRateLimit && attempt < maxRetries - 1) {
                const waitTime = initialDelay * Math.pow(2, attempt);
                console.log(`Rate limited. Waiting ${waitTime}ms...`);
                await delay(waitTime);
            } else {
                throw error;
            }
        }
    }
}
```

### Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `fn` | - | Async function to call (Gemini API) |
| `maxRetries` | 3 | Maximum retry attempts |
| `initialDelay` | 2000ms | Initial wait time before first retry |

### Wait Time Calculation

```
Attempt 0: Fails → Wait 2000ms
Attempt 1: Fails → Wait 4000ms  
Attempt 2: Fails → Wait 8000ms
Attempt 3: Fails → Give up, use fallback
```

Formula: `waitTime = initialDelay * 2^attempt`

---

## Flow Diagram

```
API Call
    │
    ▼
┌──────────────────┐
│ Try Gemini Call  │
└────────┬─────────┘
         │
    ┌────┴────┐
    │ Success │──────────────────────> Return Response
    └────┬────┘
         │
    ┌────┴────┐
    │ Error?  │
    └────┬────┘
         │
    ┌────┴─────────────┐
    │ Is Rate Limit?   │
    │ (429/EXHAUSTED)  │
    └────┬─────────────┘
         │
    ┌────┴────┐
    │  Yes    │──> Wait (exponential) ──> Retry
    └────┬────┘
         │
    ┌────┴────────────┐
    │ No / Max Retries│
    └────┬────────────┘
         │
         ▼
┌──────────────────────┐
│ Use Fallback         │
│ (Regex Extraction)   │
└──────────────────────┘
```

---

## Usage in Code

### Chat Endpoint
```javascript
const result = await retryWithBackoff(() => model.generateContent(prompt));
```

### Analyze-Form Endpoint
```javascript
const result = await retryWithBackoff(() => model.generateContent(prompt));
```

---

## Fallback Strategy

If all retries fail, the system falls back to:

### For `/chat`
Returns hardcoded responses based on state:
```javascript
if (state === "INTRO") {
    reply = `Hi! Let's fill ${context?.formTitle}. I need: ${fields}. Go ahead!`;
}
```

### For `/analyze-form`
Uses regex-based extraction:
```javascript
const extracted = extractFromTranscript(transcript, formFields, existingValues);
```

---

## Monitoring

Console logs during rate limiting:
```
Rate limited. Waiting 2000ms...
Rate limited. Waiting 4000ms...
Gemini Error: 429 Too Many Requests
Using fallback extraction...
```

---

## Best Practices

1. **Don't call too frequently** - Add debouncing on frontend
2. **Batch if possible** - Combine multiple extractions
3. **Cache responses** - Don't re-ask for same prompt
4. **Monitor usage** - Track API calls per minute

---

## Gemini Free Tier Limits (Approximate)

| Metric | Limit |
|--------|-------|
| Requests per minute | 60 |
| Tokens per minute | 60,000 |
| Requests per day | 1,500 |

*Note: Limits may vary. Check Google AI Studio for current limits.*
