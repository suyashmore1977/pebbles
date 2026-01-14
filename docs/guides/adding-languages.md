# Multi-Language Support (Planned)

> ⚠️ **Note**: This feature is planned for Q2 2026 and not yet implemented.

This document outlines the planned implementation for multi-language support.

---

## Planned Features

1. **50+ Language Support**
   - Major world languages
   - Regional language support
   - Accent-aware recognition

2. **Auto-Translation**
   - Detect spoken language
   - Translate to form's language
   - Preserve meaning and context

3. **Mixed-Language Input**
   - Switch languages mid-sentence
   - Handle bilingual speakers

---

## Implementation Plan

### Phase 1: Language Detection

```javascript
// Planned: Detect language from transcript
async function detectLanguage(transcript) {
    const prompt = `Detect the language: "${transcript}"`;
    const result = await model.generateContent(prompt);
    return result.language; // e.g., "en", "hi", "es"
}
```

### Phase 2: Speech Recognition Languages

```javascript
// Configure recognition for detected language
recognition.lang = detectedLanguage; // 'en-US', 'hi-IN', 'es-ES'
```

### Phase 3: Translation Layer

```javascript
// Planned: Translate extracted values if needed
async function translateToEnglish(values, sourceLanguage) {
    if (sourceLanguage === 'en') return values;
    
    const prompt = `Translate from ${sourceLanguage} to English: ${JSON.stringify(values)}`;
    const result = await model.generateContent(prompt);
    return JSON.parse(result.text());
}
```

---

## Supported Languages (Planned)

| Language | Code | Status |
|----------|------|--------|
| English | en-US | Current |
| Hindi | hi-IN | Q2 2026 |
| Spanish | es-ES | Q2 2026 |
| French | fr-FR | Q2 2026 |
| German | de-DE | Q2 2026 |
| Mandarin | zh-CN | Q2 2026 |
| Japanese | ja-JP | Q3 2026 |
| Arabic | ar-SA | Q3 2026 |
| Portuguese | pt-BR | Q3 2026 |
| Russian | ru-RU | Q3 2026 |

---

## UI Changes (Planned)

1. **Language Selector**
   - Dropdown in Pebbles panel
   - Auto-detect option

2. **Visual Indicators**
   - Current language shown
   - Translation in progress indicator

---

## Prompt Modifications (Planned)

```javascript
// Enhanced prompt with language context
const prompt = `
Extract information from this speech in ${sourceLanguage}.
Translate values to English.

SPEECH: "${transcript}"
...
`;
```

---

## Challenges

1. **Accent Variations**
   - Different accents per language
   - Training data requirements

2. **Code-Switching**
   - Detecting language switches
   - Handling mixed inputs

3. **Proper Nouns**
   - Names shouldn't be translated
   - Address formatting varies

---

## Timeline

| Milestone | Date |
|-----------|------|
| Language detection | Q2 2026 |
| Hindi + Spanish | Q2 2026 |
| 10 languages | Q3 2026 |
| 50+ languages | Q4 2026 |
