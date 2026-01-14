# Gemini AI Prompts

This document details all prompts sent to Google Gemini AI and explains the reasoning behind each.

---

## Model Configuration

```javascript
const MODEL_NAME = "gemini-2.0-flash";
const model = genAI.getGenerativeModel({ model: MODEL_NAME });
```

**Why gemini-2.0-flash?**
- Fast response times (~1-2 seconds)
- Good for conversational tasks
- Cost-effective for high-volume usage

---

## Chat Prompts

### 1. INTRO State - Initial Greeting

**Purpose**: Greet the user and tell them what information is needed.

**Prompt Template**:
```
You are Pebbles, a friendly Voice AI. User opened "{formTitle}" form. 
Say hi and list these fields: {fieldLabels}. 
Keep under 30 words. Be natural.
```

**Example Generated Prompt**:
```
You are Pebbles, a friendly Voice AI. User opened "Job Application" form. 
Say hi and list these fields: Full Name, Email, Phone, Company, LinkedIn, Why this job?. 
Keep under 30 words. Be natural.
```

**Example Output**:
> "Hey there! Ready to fill out the Job Application? I'll need your name, email, phone, company, LinkedIn, and why you want this role. Go ahead!"

**Design Decisions**:
- Word limit (30) keeps responses concise for voice
- "Be natural" encourages conversational tone
- Lists all fields so user knows what to provide

---

### 2. LISTENING_PROMPT State

**Purpose**: Quick prompt when system starts listening.

**Prompt**:
```
Say a quick prompt like "Go ahead!" or "I'm listening!" - under 6 words.
```

**Example Outputs**:
- "Go ahead!"
- "I'm listening!"
- "Ready when you are!"

---

### 3. FILLING State

**Purpose**: Acknowledge receiving information.

**Prompt**:
```
Acknowledge you got the info. Say something like "Got it!" - under 8 words.
```

**Example Outputs**:
- "Got it! Filling that in now."
- "Perfect, I've got that!"
- "Great, adding that now."

---

### 4. ASK_MISSING State

**Purpose**: Ask for specific missing fields.

**Prompt Template**:
```
Ask for these missing fields: {missingFields}. Be natural, under 20 words.
```

**Example Generated Prompt**:
```
Ask for these missing fields: Phone, Company, LinkedIn. Be natural, under 20 words.
```

**Example Output**:
> "Almost there! I still need your phone number, company, and LinkedIn. What are those?"

**Design Decisions**:
- Limits to first 4 missing fields to avoid overwhelming user
- "Be natural" prevents robotic responses

---

### 5. DONE State

**Purpose**: Confirm completion and ask for review.

**Prompt**:
```
Form is done! Ask user to review. Be friendly, under 10 words.
```

**Example Outputs**:
- "All done! Take a look and let me know."
- "Perfect! Check if everything looks good."

---

## Form Analysis Prompt

### Purpose
Extract specific field values from natural speech.

### Full Prompt Template

```
Extract ALL information from this speech to fill a form. Be thorough!

SPEECH: "{transcript}"

FIELDS TO FILL:
{fieldInfo}

INSTRUCTIONS:
- Extract EVERY piece of information mentioned
- Match spoken info to the closest field
- For name fields: extract full name (first + last)
- For email: look for @, "at", email patterns
- For phone: look for number sequences (10+ digits)
- For LinkedIn: look for linkedin mentions or urls
- For "why" questions: use any reason/motivation mentioned
- Return ONLY valid JSON with field IDs as keys
- Use "" for truly missing fields

OUTPUT FORMAT (JSON only, no markdown):
{"field_id_1": "value1", "field_id_2": "value2", ...}
```

### Example

**User Speech**:
> "My name is John Doe, email is john@example.com, phone 9876543210, I work at TechCorp"

**Generated Prompt**:
```
Extract ALL information from this speech to fill a form. Be thorough!

SPEECH: "My name is John Doe, email is john@example.com, phone 9876543210, I work at TechCorp"

FIELDS TO FILL:
"entry.123": Full Name
"entry.456": Email Address
"entry.789": Phone Number
"entry.101": Current Company
"entry.102": LinkedIn URL
"entry.103": Why do you want this job?

INSTRUCTIONS:
- Extract EVERY piece of information mentioned
- Match spoken info to the closest field
...

OUTPUT FORMAT (JSON only, no markdown):
{"field_id_1": "value1", "field_id_2": "value2", ...}
```

**Gemini Response**:
```json
{
  "entry.123": "John Doe",
  "entry.456": "john@example.com",
  "entry.789": "9876543210",
  "entry.101": "TechCorp",
  "entry.102": "",
  "entry.103": ""
}
```

### Design Decisions

1. **"Be thorough!"** - Emphasizes extracting all information
2. **Specific patterns** - Tells Gemini what to look for (@ for email, digits for phone)
3. **JSON-only output** - Easier to parse, no markdown formatting
4. **Empty string for missing** - Consistent handling of unfilled fields
5. **Field ID mapping** - Uses actual form field IDs for direct assignment

---

## Prompt Optimization Tips

### Current Token Usage (Approximate)
- Chat prompts: 50-100 tokens
- Analysis prompt: 200-400 tokens (varies with field count)

### Potential Improvements

1. **Reduce tokens** - Shorter prompts for lower costs
2. **Few-shot examples** - Add example extractions for better accuracy
3. **Language hints** - Add detected language for multi-lingual support
4. **Field type hints** - Tell Gemini about input types (email, tel, etc.)
