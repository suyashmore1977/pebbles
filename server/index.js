require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL_NAME = "gemini-2.0-flash";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

// Enhanced extraction patterns
function extractFromTranscript(transcript, formFields, existingValues = {}) {
    const text = transcript.toLowerCase();
    const result = { ...existingValues };

    for (const field of formFields) {
        // Skip if already filled
        if (result[field.id] && result[field.id].trim()) continue;

        const label = field.label.toLowerCase();
        let value = "";

        // Name extraction (improved)
        if ((label.includes('name') || label.includes('attendee')) && !label.includes('company') && !label.includes('organization')) {
            const patterns = [
                /(?:my name is|i am|i'm|name is|this is|call me)\s+([a-z]+(?:\s+[a-z]+){0,2})/i,
                /^([a-z]+(?:\s+[a-z]+)?)\s+(?:here|speaking)/i,
                /name[:\s]+([a-z]+(?:\s+[a-z]+)?)/i
            ];
            for (const pattern of patterns) {
                const match = transcript.match(pattern);
                if (match) {
                    value = match[1].split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
                    break;
                }
            }
        }
        // Email extraction
        else if (label.includes('email')) {
            const patterns = [
                /([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})/i,
                /([a-z0-9._%+-]+\s*(?:at|@)\s*[a-z0-9.-]+\s*(?:dot|\.)\s*[a-z]{2,})/i
            ];
            for (const pattern of patterns) {
                const match = transcript.match(pattern);
                if (match) {
                    value = match[1].replace(/\s*at\s*/gi, '@').replace(/\s*dot\s*/gi, '.').toLowerCase();
                    break;
                }
            }
        }
        // Phone extraction (improved)
        else if (label.includes('phone') || label.includes('mobile') || label.includes('number') || label.includes('contact')) {
            const patterns = [
                /(?:phone|mobile|number|contact)[:\s]*[\s]*([\d\s\-+()]{10,})/i,
                /(?:call me at|reach me at)\s*([\d\s\-+()]{10,})/i,
                /([\+]?\d{1,3}[\s\-]?\d{3,5}[\s\-]?\d{3,5}[\s\-]?\d{2,5})/,
                /(\d{10,})/
            ];
            for (const pattern of patterns) {
                const match = transcript.match(pattern);
                if (match) {
                    value = match[1].replace(/\s+/g, ' ').trim();
                    break;
                }
            }
        }
        // Company/Organization extraction
        else if (label.includes('company') || label.includes('organization') || label.includes('current')) {
            const patterns = [
                /(?:work at|working at|company is|from|at|with)\s+([a-z]+(?:\s+[a-z]+){0,3})/i,
                /company[:\s]+([a-z]+(?:\s+[a-z]+){0,2})/i
            ];
            for (const pattern of patterns) {
                const match = transcript.match(pattern);
                if (match) {
                    value = match[1].split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
                    break;
                }
            }
        }
        // LinkedIn/URL extraction
        else if (label.includes('linkedin') || label.includes('url') || label.includes('link')) {
            const patterns = [
                /(linkedin\.com\/in\/[a-z0-9_-]+)/i,
                /(https?:\/\/[^\s]+)/i,
                /linkedin[:\s]+(?:is\s+)?([a-z0-9_-]+)/i
            ];
            for (const pattern of patterns) {
                const match = transcript.match(pattern);
                if (match) {
                    value = match[1];
                    if (!value.includes('linkedin.com') && label.includes('linkedin')) {
                        value = 'linkedin.com/in/' + value;
                    }
                    break;
                }
            }
        }
        // Why/Reason extraction
        else if (label.includes('why') || label.includes('reason')) {
            const patterns = [
                /(?:because|reason is|want this (?:job|role) because|interested because)\s+(.{10,})/i,
                /(?:i want|i'm interested|passionate about)\s+(.{10,})/i
            ];
            for (const pattern of patterns) {
                const match = transcript.match(pattern);
                if (match) {
                    value = match[1].charAt(0).toUpperCase() + match[1].slice(1);
                    // Limit length
                    if (value.length > 200) value = value.substring(0, 200) + '...';
                    break;
                }
            }
        }
        // Date extraction
        else if (label.includes('date') || field.type === 'date') {
            const patterns = [
                /(\d{4}-\d{2}-\d{2})/,
                /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/,
                /(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}(?:st|nd|rd|th)?(?:\s*,?\s*\d{4})?/i
            ];
            for (const pattern of patterns) {
                const match = transcript.match(pattern);
                if (match) {
                    value = match[1];
                    break;
                }
            }
        }
        // Dietary/preference extraction  
        else if (label.includes('dietary') || label.includes('restriction')) {
            const patterns = [
                /(?:dietary|restriction|diet)[:\s]+(.+?)(?:\.|,|$)/i,
                /(?:i am|i'm)\s+(vegetarian|vegan|gluten[- ]?free|halal|kosher)/i,
                /(no\s+(?:nuts|dairy|gluten|meat|fish|shellfish))/i
            ];
            for (const pattern of patterns) {
                const match = transcript.match(pattern);
                if (match) {
                    value = match[1].charAt(0).toUpperCase() + match[1].slice(1);
                    break;
                }
            }
        }
        // Symptoms/description extraction
        else if (label.includes('symptom') || label.includes('comment') || label.includes('description')) {
            const patterns = [
                /(?:symptom|feeling|experiencing)[:\s]+(.+?)(?:\.|$)/i,
                /(?:i have|i'm having|suffering from)\s+(.+?)(?:\.|,|$)/i
            ];
            for (const pattern of patterns) {
                const match = transcript.match(pattern);
                if (match) {
                    value = match[1].charAt(0).toUpperCase() + match[1].slice(1);
                    break;
                }
            }
        }
        // Rating extraction
        else if (label.includes('rating') || field.type === 'number') {
            const match = transcript.match(/(?:rating|rate|score)[:\s]*(\d+)/i) ||
                transcript.match(/(\d+)\s*(?:out of|\/)\s*\d+/i) ||
                transcript.match(/^(\d+)$/);
            if (match) {
                value = match[1];
            }
        }

        if (value) {
            result[field.id] = value;
        }
    }

    return result;
}

// Chat endpoint
app.post('/chat', async (req, res) => {
    try {
        const { context, state, fieldCount, fieldLabels, missingFields } = req.body;
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        let prompt = "";

        if (state === "INTRO") {
            const fields = fieldLabels?.join(', ') || 'your details';
            prompt = `You are Pebbles, a friendly Voice AI. User opened "${context.formTitle}" form. Say hi and list these fields: ${fields}. Keep under 30 words. Be natural.`;
        }
        else if (state === "LISTENING_PROMPT") {
            prompt = `Say a quick prompt like "Go ahead!" or "I'm listening!" - under 6 words.`;
        }
        else if (state === "FILLING") {
            prompt = `Acknowledge you got the info. Say something like "Got it!" - under 8 words.`;
        }
        else if (state === "ASK_MISSING") {
            const missing = missingFields?.slice(0, 4).join(', ') || 'more info';
            prompt = `Ask for these missing fields: ${missing}. Be natural, under 20 words.`;
        }
        else if (state === "DONE") {
            prompt = `Form is done! Ask user to review. Be friendly, under 10 words.`;
        }

        const result = await retryWithBackoff(() => model.generateContent(prompt));
        res.json({ reply: result.response.text() });

    } catch (error) {
        console.error("Chat Error:", error.message);
        const { context, state, fieldLabels, missingFields } = req.body;

        let reply = "I'm ready.";
        if (state === "INTRO") {
            const fields = fieldLabels?.slice(0, 5).join(', ') || 'your details';
            reply = `Hi! Let's fill ${context?.formTitle || 'the form'}. I need: ${fields}. Go ahead!`;
        } else if (state === "LISTENING_PROMPT") {
            reply = "Go ahead!";
        } else if (state === "FILLING") {
            reply = "Got it! Filling now.";
        } else if (state === "ASK_MISSING") {
            reply = `Still need: ${missingFields?.slice(0, 3).join(', ') || 'more info'}. What are those?`;
        } else if (state === "DONE") {
            reply = "All done! Check it out.";
        }

        res.json({ reply });
    }
});

// Analyze form endpoint
app.post('/analyze-form', async (req, res) => {
    console.log("\n=== ANALYZE-FORM ===");

    try {
        const { formFields, transcript, existingValues } = req.body;

        console.log("Transcript:", transcript);

        if (!formFields || !transcript) {
            return res.status(400).json({ error: "Missing data" });
        }

        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        // Build field mapping
        const fieldInfo = formFields.map(f => `"${f.id}": ${f.label}`).join('\n');

        const prompt = `Extract ALL information from this speech to fill a form. Be thorough!

SPEECH: "${transcript}"

FIELDS TO FILL:
${fieldInfo}

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
{"field_id_1": "value1", "field_id_2": "value2", ...}`;

        console.log("Calling Gemini...");

        const result = await retryWithBackoff(() => model.generateContent(prompt));
        let text = result.response.text();
        console.log("Raw:", text);

        // Clean JSON
        text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) text = jsonMatch[0];

        let extracted = JSON.parse(text);

        // Merge with existing
        const merged = { ...existingValues, ...extracted };
        for (const key in merged) {
            if (!merged[key] && existingValues?.[key]) {
                merged[key] = existingValues[key];
            }
        }

        // Determine missing
        const missing = formFields
            .filter(f => !merged[f.id] || merged[f.id].trim() === "")
            .map(f => f.label);

        console.log("Extracted:", merged);
        console.log("Missing:", missing);

        res.json({
            values: merged,
            missingFields: missing,
            filledCount: formFields.length - missing.length,
            totalFields: formFields.length,
            isComplete: missing.length === 0
        });

    } catch (error) {
        console.error("Gemini Error:", error.message);
        console.log("Using fallback extraction...");

        // Use enhanced local extraction
        const extracted = extractFromTranscript(
            req.body.transcript || '',
            req.body.formFields || [],
            req.body.existingValues || {}
        );

        const missing = (req.body.formFields || [])
            .filter(f => !extracted[f.id] || extracted[f.id].trim() === "")
            .map(f => f.label);

        console.log("Fallback extracted:", extracted);
        console.log("Missing:", missing);

        res.json({
            values: extracted,
            missingFields: missing,
            filledCount: (req.body.formFields?.length || 0) - missing.length,
            totalFields: req.body.formFields?.length || 0,
            isComplete: missing.length === 0
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server: http://localhost:${PORT}`);
    console.log(`Model: ${MODEL_NAME}`);
});
