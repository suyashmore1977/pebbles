# Customizing Voice Settings

How to customize the text-to-speech voice in Pebbles.

---

## Current Implementation

The voice is selected and cached when the page loads:

```javascript
// In Playground.jsx
useEffect(() => {
    const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        
        const preferredVoices = [
            'Google UK English Female',
            'Google US English',
            'Samantha',
            'Microsoft Zira',
            'Microsoft David',
        ];
        
        for (const preferred of preferredVoices) {
            const voice = voices.find(v => v.name.includes(preferred));
            if (voice) {
                selectedVoiceRef.current = voice;
                break;
            }
        }
    };
    
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
}, []);
```

---

## Voice Parameters

```javascript
const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.voice = selectedVoiceRef.current;
    utterance.rate = 0.95;   // Speed: 0.1 to 10
    utterance.pitch = 1.0;   // Pitch: 0 to 2
    utterance.volume = 1;    // Volume: 0 to 1
    
    window.speechSynthesis.speak(utterance);
};
```

---

## Customization Options

### Change Speech Rate

| Rate | Effect |
|------|--------|
| 0.5 | Very slow |
| 0.75 | Slow |
| 1.0 | Normal |
| 1.25 | Fast |
| 1.5 | Very fast |

**Current**: 0.95 (slightly slower for clarity)

### Change Pitch

| Pitch | Effect |
|-------|--------|
| 0.5 | Deep voice |
| 1.0 | Normal |
| 1.5 | Higher voice |
| 2.0 | Very high |

**Current**: 1.0 (normal)

---

## Available Voices by Platform

### Windows
- Microsoft David Desktop
- Microsoft Zira Desktop
- Microsoft Mark Mobile

### macOS
- Samantha
- Karen (Australian)
- Daniel (British)
- Alex

### Chrome (all platforms)
- Google UK English Female
- Google UK English Male
- Google US English

---

## How to List Available Voices

Run in browser console:
```javascript
speechSynthesis.getVoices().forEach(v => {
    console.log(v.name, v.lang);
});
```

---

## Changing the Preferred Voice

Edit the `preferredVoices` array in `Playground.jsx`:

```javascript
const preferredVoices = [
    'Your Preferred Voice First',
    'Second Choice',
    'Third Choice',
    // Fallback to any English voice
];
```

---

## Adding Natural Pauses

Current implementation adds pauses at punctuation:

```javascript
const processedText = text
    .replace(/\.\.\.(?=\s|$)/g, '... ')  // Preserve existing ...
    .replace(/\.(?=\s|$)/g, '. ')        // Add pause at periods
    .replace(/!/g, '! ')                  // Pause at exclamations
    .replace(/\?/g, '? ');               // Pause at questions
```

---

## Future Improvements

1. **User voice selection** - Dropdown in settings
2. **Voice preview** - Test button
3. **Persist preference** - Save to localStorage

---

## Troubleshooting

### No voice plays
1. Check browser supports SpeechSynthesis
2. Wait for voices to load (`onvoiceschanged`)
3. Some browsers need user gesture first

### Wrong voice
1. Check preferred voice is installed
2. Fallback is first English voice
3. Log selected voice to console

### Voice sounds robotic
1. Try different voices
2. Lower the rate slightly
3. Add more natural pauses
