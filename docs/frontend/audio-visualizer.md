# Audio Waveform Visualizer

This document explains the real-time audio visualization component.

---

## Overview

The waveform visualizer shows audio levels when the microphone is active, providing visual feedback that the app is listening.

---

## Technologies Used

- **Web Audio API** - For audio analysis
- **Canvas API** - For drawing
- **requestAnimationFrame** - For smooth animation

---

## Component Code

```jsx
const AudioWaveform = ({ isActive, analyser }) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        if (!isActive || !analyser || !canvasRef.current) {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);
            
            // Get frequency data
            analyser.getByteFrequencyData(dataArray);

            // Clear canvas
            ctx.fillStyle = 'rgba(243, 244, 246, 1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw bars
            const barWidth = (canvas.width / bufferLength) * 2.5;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;

                // Gradient from red to dark red
                const gradient = ctx.createLinearGradient(
                    0, canvas.height - barHeight, 
                    0, canvas.height
                );
                gradient.addColorStop(0, '#ef4444');
                gradient.addColorStop(1, '#dc2626');

                ctx.fillStyle = gradient;
                ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
                x += barWidth;
            }
        };

        draw();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isActive, analyser]);

    if (!isActive) return null;

    return (
        <div className="w-full h-16 rounded-lg overflow-hidden bg-gray-100 mb-4">
            <canvas ref={canvasRef} width={250} height={64} className="w-full h-full" />
        </div>
    );
};
```

---

## Props

| Prop | Type | Description |
|------|------|-------------|
| `isActive` | Boolean | Whether to show and animate |
| `analyser` | AnalyserNode | Web Audio analyser node |

---

## How It Works

### 1. Setup Audio Context

```javascript
// In startListening()
const audioContext = new AudioContext();
const analyser = audioContext.createAnalyser();
const source = audioContext.createMediaStreamSource(stream);

analyser.fftSize = 64;  // Number of frequency bins
source.connect(analyser);
```

### 2. Get Frequency Data

```javascript
const bufferLength = analyser.frequencyBinCount;  // = fftSize / 2 = 32
const dataArray = new Uint8Array(bufferLength);

analyser.getByteFrequencyData(dataArray);
// dataArray now contains 32 values from 0-255
```

### 3. Draw Bars

```javascript
for (let i = 0; i < bufferLength; i++) {
    // Calculate bar height (0-255 → 0-canvas.height)
    const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;
    
    // Draw bar from bottom up
    ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
    x += barWidth;
}
```

### 4. Animation Loop

```javascript
const draw = () => {
    animationRef.current = requestAnimationFrame(draw);
    // ... drawing code
};

draw();  // Start loop
```

---

## Configuration

### FFT Size
```javascript
analyser.fftSize = 64;
```
- Lower = fewer bars, better performance
- Higher = more bars, smoother visualization
- Must be power of 2 (32, 64, 128, 256, etc.)

### Bar Appearance
```javascript
const barWidth = (canvas.width / bufferLength) * 2.5;
```
- Multiplier controls bar width
- Gap between bars: `barWidth - 1`

### Colors
```javascript
gradient.addColorStop(0, '#ef4444');  // Top: Red-500
gradient.addColorStop(1, '#dc2626');  // Bottom: Red-600
```

---

## Cleanup

Important to prevent memory leaks:

```javascript
// In useEffect cleanup
return () => {
    if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
    }
};

// In stopListening
if (audioContextRef.current) {
    audioContextRef.current.close();
    audioContextRef.current = null;
    analyserRef.current = null;
}
```

---

## Visual Design

```
┌─────────────────────────────────────────────┐
│ ▄   ▄▄  ▄▄▄ ▄▄  ▄   ▄▄ ▄▄▄  ▄  ▄▄  ▄       │
│ █   ██  ███ ██  █   ██ ███  █  ██  █       │
│ █   ██  ███ ██  █   ██ ███  █  ██  █       │
│ █▄  ██▄ ███ ██▄ █▄  ██ ███ ▄█▄ ██▄ █▄      │
│ ████████████████████████████████████████   │
└─────────────────────────────────────────────┘
```

- Bars grow from bottom
- Gradient creates depth
- Red color matches "recording" indicator
