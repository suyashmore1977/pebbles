# Fallback Extraction (Regex Patterns)

When Gemini AI is unavailable (rate limited or error), the system falls back to regex-based extraction. This document details all extraction patterns.

---

## Function Overview

```javascript
function extractFromTranscript(transcript, formFields, existingValues = {})
```

**Parameters**:
- `transcript` - The spoken text to extract from
- `formFields` - Array of form field objects with id, label, type
- `existingValues` - Previously filled values (preserved)

**Returns**: Object with field IDs as keys and extracted values

---

## Extraction Patterns by Field Type

### 1. Name Fields

**Triggers**: Label contains "name" or "attendee" (but not "company")

**Patterns**:
```javascript
/(?:my name is|i am|i'm|name is|this is|call me)\s+([a-z]+(?:\s+[a-z]+){0,2})/i
/^([a-z]+(?:\s+[a-z]+)?)\s+(?:here|speaking)/i
/name[:\s]+([a-z]+(?:\s+[a-z]+)?)/i
```

**Examples**:
| Input | Extracted |
|-------|-----------|
| "My name is John Doe" | "John Doe" |
| "I'm Sarah Connor" | "Sarah Connor" |
| "Name is Mike" | "Mike" |

**Post-processing**: Title case applied

---

### 2. Email Fields

**Triggers**: Label contains "email"

**Patterns**:
```javascript
/([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})/i
/([a-z0-9._%+-]+\s*(?:at|@)\s*[a-z0-9.-]+\s*(?:dot|\.)\s*[a-z]{2,})/i
```

**Examples**:
| Input | Extracted |
|-------|-----------|
| "email john@example.com" | "john@example.com" |
| "john at example dot com" | "john@example.com" |

**Post-processing**: Converts "at" → "@", "dot" → "."

---

### 3. Phone/Mobile Fields

**Triggers**: Label contains "phone", "mobile", "number", or "contact"

**Patterns**:
```javascript
/(?:phone|mobile|number|contact)[:\s]*[\s]*([\d\s\-+()]{10,})/i
/(?:call me at|reach me at)\s*([\d\s\-+()]{10,})/i
/([\+]?\d{1,3}[\s\-]?\d{3,5}[\s\-]?\d{3,5}[\s\-]?\d{2,5})/
/(\d{10,})/
```

**Examples**:
| Input | Extracted |
|-------|-----------|
| "phone 9876543210" | "9876543210" |
| "call me at +1-234-567-8900" | "+1-234-567-8900" |
| "my number is 98765 43210" | "98765 43210" |

---

### 4. Company/Organization Fields

**Triggers**: Label contains "company", "organization", or "current"

**Patterns**:
```javascript
/(?:work at|working at|company is|from|at|with)\s+([a-z]+(?:\s+[a-z]+){0,3})/i
/company[:\s]+([a-z]+(?:\s+[a-z]+){0,2})/i
```

**Examples**:
| Input | Extracted |
|-------|-----------|
| "I work at Google" | "Google" |
| "company is Tech Corp" | "Tech Corp" |
| "I'm from Microsoft" | "Microsoft" |

---

### 5. LinkedIn/URL Fields

**Triggers**: Label contains "linkedin", "url", or "link"

**Patterns**:
```javascript
/(linkedin\.com\/in\/[a-z0-9_-]+)/i
/(https?:\/\/[^\s]+)/i
/linkedin[:\s]+(?:is\s+)?([a-z0-9_-]+)/i
```

**Examples**:
| Input | Extracted |
|-------|-----------|
| "linkedin.com/in/johndoe" | "linkedin.com/in/johndoe" |
| "my linkedin is johndoe" | "linkedin.com/in/johndoe" |

**Post-processing**: Adds "linkedin.com/in/" prefix if missing

---

### 6. Why/Reason Fields

**Triggers**: Label contains "why" or "reason"

**Patterns**:
```javascript
/(?:because|reason is|want this (?:job|role) because|interested because)\s+(.{10,})/i
/(?:i want|i'm interested|passionate about)\s+(.{10,})/i
```

**Examples**:
| Input | Extracted |
|-------|-----------|
| "I want this job because I love coding" | "I love coding" |
| "I'm passionate about AI technology" | "AI technology" |

**Post-processing**: Limited to 200 characters

---

### 7. Date Fields

**Triggers**: Label contains "date" or field type is "date"

**Patterns**:
```javascript
/(\d{4}-\d{2}-\d{2})/
/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/
/(january|february|march|...|december)\s+\d{1,2}(?:st|nd|rd|th)?(?:\s*,?\s*\d{4})?/i
```

**Examples**:
| Input | Extracted |
|-------|-----------|
| "date 2024-01-15" | "2024-01-15" |
| "January 15th, 2024" | "January 15th, 2024" |

---

### 8. Dietary/Restriction Fields

**Triggers**: Label contains "dietary" or "restriction"

**Patterns**:
```javascript
/(?:dietary|restriction|diet)[:\s]+(.+?)(?:\.|,|$)/i
/(?:i am|i'm)\s+(vegetarian|vegan|gluten[- ]?free|halal|kosher)/i
/(no\s+(?:nuts|dairy|gluten|meat|fish|shellfish))/i
```

**Examples**:
| Input | Extracted |
|-------|-----------|
| "I'm vegetarian" | "Vegetarian" |
| "dietary restriction no nuts" | "No nuts" |

---

### 9. Symptoms/Description Fields

**Triggers**: Label contains "symptom", "comment", or "description"

**Patterns**:
```javascript
/(?:symptom|feeling|experiencing)[:\s]+(.+?)(?:\.|$)/i
/(?:i have|i'm having|suffering from)\s+(.+?)(?:\.|,|$)/i
```

**Examples**:
| Input | Extracted |
|-------|-----------|
| "I'm having headaches" | "Headaches" |
| "symptom is fever and cough" | "Fever and cough" |

---

### 10. Rating/Number Fields

**Triggers**: Label contains "rating" or field type is "number"

**Patterns**:
```javascript
/(?:rating|rate|score)[:\s]*(\d+)/i
/(\d+)\s*(?:out of|\/)\s*\d+/i
/^(\d+)$/
```

**Examples**:
| Input | Extracted |
|-------|-----------|
| "rating 8" | "8" |
| "I'd give it 9 out of 10" | "9" |

---

## Limitations

1. **Order dependent** - If multiple values match, first wins
2. **English only** - Patterns designed for English speech
3. **No context** - Can't understand meaning, just patterns
4. **False positives** - "at" in "I'm at the office" could be misread

## When Fallback is Used

1. Gemini returns 429 (rate limit)
2. Gemini returns 500 (server error)
3. Network timeout
4. API key invalid
