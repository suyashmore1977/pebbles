# Adding New Forms

Guide to adding new form types to Pebbles.

---

## Step 1: Define the Form

Add a new form object to `client/src/data/mockForms.js`:

```javascript
{
    id: "unique-form-id",
    title: "Your Form Title",
    description: "Brief description for the card",
    color: "bg-green-500",  // Tailwind color class
    fields: [
        {
            id: "field_1",
            label: "Field Label",
            type: "text"  // text, email, tel, textarea
        },
        {
            id: "field_2",
            label: "Email Address",
            type: "email"
        }
        // Add more fields...
    ]
}
```

---

## Step 2: Field Configuration

### Field Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | String | Unique identifier (used as key) |
| `label` | String | Human-readable name |
| `type` | String | Input type for rendering |

### Supported Types

| Type | Renders As | Best For |
|------|-----------|----------|
| `text` | Text input | Names, general text |
| `email` | Email input | Email addresses |
| `tel` | Phone input | Phone numbers |
| `textarea` | Multi-line | Long descriptions |
| `date` | Date input | Dates |
| `number` | Number input | Ratings, quantities |

---

## Step 3: Optimize for Voice

### Good Field Labels

Labels should be clear and unique:

✅ **Good**:
- "Full Name"
- "Email Address"
- "Phone Number"
- "Current Company"

❌ **Avoid**:
- "Name" (too generic)
- "Info" (too vague)
- "Field 1" (not descriptive)

### Voice-Friendly Tips

1. Use complete phrases: "Why do you want this job?"
2. Be specific: "Primary Contact Email" vs "Email"
3. Avoid abbreviations: "Phone Number" not "Ph#"

---

## Step 4: Test Voice Recognition

After adding a form, test these speech patterns:

```
"My name is John Doe"
"Email john@example.com"
"Phone 9876543210"
"I work at Google"
```

Check that:
- Fields are correctly matched
- Values are properly formatted
- Nothing is missed

---

## Example: Event Registration Form

```javascript
{
    id: "event-registration",
    title: "Event Registration",
    description: "Register for the upcoming conference",
    color: "bg-purple-500",
    fields: [
        {
            id: "attendee_name",
            label: "Attendee Name",
            type: "text"
        },
        {
            id: "email",
            label: "Email Address",
            type: "email"
        },
        {
            id: "phone",
            label: "Phone Number",
            type: "tel"
        },
        {
            id: "company",
            label: "Company Name",
            type: "text"
        },
        {
            id: "dietary",
            label: "Dietary Restrictions",
            type: "text"
        },
        {
            id: "session",
            label: "Preferred Session",
            type: "text"
        }
    ]
}
```

---

## Step 5: Colors

Available Tailwind colors for `color` property:

| Color | Class |
|-------|-------|
| Red | `bg-red-500` |
| Orange | `bg-orange-500` |
| Yellow | `bg-yellow-500` |
| Green | `bg-green-500` |
| Blue | `bg-blue-500` |
| Purple | `bg-purple-500` |
| Pink | `bg-pink-500` |
| Brand | `bg-brand-600` |

---

## Fallback Extraction

If you add custom field types, consider updating the fallback regex in `server/index.js`:

```javascript
else if (label.includes('your_keyword')) {
    const patterns = [
        /your pattern here/i
    ];
    // ...
}
```

See [Fallback Extraction](../backend/fallback-extraction.md) for pattern examples.
