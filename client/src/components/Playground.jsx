import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Mic, X, ChevronRight, CheckCircle2, Loader2, MessageSquare, MicOff } from 'lucide-react';
import axios from 'axios';
import { MOCK_FORMS } from '../data/mockForms';

// API URL from environment variable (for deployment)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Initialize Speech Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// Audio Waveform Visualizer Component
const AudioWaveform = ({ isActive, analyser }) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        if (!isActive || !analyser || !canvasRef.current) {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);
            ctx.fillStyle = 'rgba(243, 244, 246, 1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let x = 0;
            for (let i = 0; i < bufferLength; i++) {
                const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;
                const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
                gradient.addColorStop(0, '#ef4444');
                gradient.addColorStop(1, '#dc2626');
                ctx.fillStyle = gradient;
                ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
                x += barWidth;
            }
        };
        draw();

        return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
    }, [isActive, analyser]);

    if (!isActive) return null;
    return (
        <div className="w-full h-16 rounded-lg overflow-hidden bg-gray-100 mb-4">
            <canvas ref={canvasRef} width={250} height={64} className="w-full h-full" />
        </div>
    );
};

const Playground = () => {
    const [activeForm, setActiveForm] = useState(null);
    const [conversationState, setConversationState] = useState('IDLE');
    const [status, setStatus] = useState("Ready to help");
    const [formValues, setFormValues] = useState({});
    const [transcript, setTranscript] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [missingFields, setMissingFields] = useState([]);
    const [voicesLoaded, setVoicesLoaded] = useState(false);

    const recognitionRef = useRef(null);
    const isSpeakingRef = useRef(false);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const mediaStreamRef = useRef(null);
    const silenceTimeoutRef = useRef(null);
    const transcriptRef = useRef("");
    const formValuesRef = useRef({});
    const selectedVoiceRef = useRef(null);

    // Preload voices
    useEffect(() => {
        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                const preferredVoices = ['Google UK English Female', 'Google US English', 'Samantha', 'Microsoft Zira', 'Microsoft David'];
                for (const preferred of preferredVoices) {
                    const voice = voices.find(v => v.name.includes(preferred));
                    if (voice) { selectedVoiceRef.current = voice; break; }
                }
                if (!selectedVoiceRef.current) selectedVoiceRef.current = voices.find(v => v.lang.startsWith('en')) || voices[0];
                setVoicesLoaded(true);
            }
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
        return () => { window.speechSynthesis.onvoiceschanged = null; };
    }, []);

    useEffect(() => { transcriptRef.current = transcript; }, [transcript]);
    useEffect(() => { formValuesRef.current = formValues; }, [formValues]);

    const speak = (text) => {
        return new Promise((resolve) => {
            isSpeakingRef.current = true;
            const processedText = text.replace(/\.\.\.(?=\s|$)/g, '... ').replace(/\.(?=\s|$)/g, '. ').replace(/!/g, '! ').replace(/\?/g, '? ');
            const utterance = new SpeechSynthesisUtterance(processedText);
            if (selectedVoiceRef.current) utterance.voice = selectedVoiceRef.current;
            utterance.rate = 0.95;
            utterance.pitch = 1.0;
            utterance.volume = 1;
            utterance.onend = () => { isSpeakingRef.current = false; resolve(); };
            utterance.onerror = () => { isSpeakingRef.current = false; resolve(); };
            window.speechSynthesis.speak(utterance);
        });
    };

    const startListening = async () => {
        if (!recognitionRef.current || isListening) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);
            analyser.fftSize = 64;
            source.connect(analyser);
            audioContextRef.current = audioContext;
            analyserRef.current = analyser;
            setTranscript("");
            setIsListening(true);
            recognitionRef.current.start();
        } catch (error) {
            console.error("Microphone access error:", error);
            setStatus("Microphone access denied.");
            setConversationState('IDLE');
        }
    };

    const stopListening = () => {
        if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
        if (recognitionRef.current) try { recognitionRef.current.stop(); } catch (e) { }
        if (mediaStreamRef.current) { mediaStreamRef.current.getTracks().forEach(track => track.stop()); mediaStreamRef.current = null; }
        if (audioContextRef.current) { audioContextRef.current.close(); audioContextRef.current = null; analyserRef.current = null; }
        setIsListening(false);
    };

    const simulateTyping = async (data) => {
        for (const [key, value] of Object.entries(data)) {
            if (!value || formValuesRef.current[key] === value) continue;
            const field = activeForm.fields.find(f => f.id === key);
            if (field) setStatus(`Filling ${field.label}...`);
            const element = document.getElementById(key);
            if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            let currentStr = "";
            for (const char of value.split("")) {
                await new Promise(r => setTimeout(r, 15));
                currentStr += char;
                setFormValues(prev => ({ ...prev, [key]: currentStr }));
            }
            await new Promise(r => setTimeout(r, 150));
        }
    };

    const processTranscript = useCallback(async (spokenText) => {
        if (!spokenText.trim()) {
            setStatus("I didn't catch that. Tap mic to try again.");
            setConversationState('IDLE');
            return;
        }
        setConversationState('PROCESSING');
        setStatus("Processing...");

        try {
            const response = await axios.post(`${API_URL}/analyze-form`, {
                formFields: activeForm.fields,
                transcript: spokenText,
                existingValues: formValuesRef.current
            });
            const { values, missingFields: missing, isComplete } = response.data;

            if (values && Object.keys(values).length > 0) {
                setStatus("AI Speaking...");
                try {
                    const ackResponse = await axios.post(`${API_URL}/chat`, { state: 'FILLING', context: { formTitle: activeForm?.title } });
                    await speak(ackResponse.data.reply);
                } catch (e) { await speak("Got it! Filling that in."); }
                await simulateTyping(values);
            }

            if (isComplete) {
                setStatus("Form Complete!");
                setMissingFields([]);
                try {
                    const doneResponse = await axios.post(`${API_URL}/chat`, { state: 'DONE', context: { formTitle: activeForm?.title } });
                    await speak(doneResponse.data.reply);
                } catch (e) { await speak("All done! Check it out."); }
                setConversationState('DONE');
            } else {
                setMissingFields(missing);
                setStatus(`Missing: ${missing.slice(0, 3).join(', ')}...`);
                try {
                    const askResponse = await axios.post(`${API_URL}/chat`, { state: 'ASK_MISSING', context: { formTitle: activeForm?.title }, missingFields: missing });
                    await speak(askResponse.data.reply);
                } catch (e) { await speak(`I still need your ${missing.slice(0, 2).join(' and ')}. What are those?`); }
                setConversationState('LISTENING');
                setStatus("Listening for more info...");
                await startListening();
            }
        } catch (error) {
            console.error("Error:", error);
            setStatus("Error occurred. Tap to retry.");
            setConversationState('IDLE');
        }
    }, [activeForm]);

    useEffect(() => {
        if (!SpeechRecognition) return;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';
            for (let i = 0; i < event.results.length; i++) {
                const part = event.results[i][0].transcript;
                if (event.results[i].isFinal) finalTranscript += part + ' ';
                else interimTranscript += part;
            }
            const fullTranscript = finalTranscript || interimTranscript;
            setTranscript(fullTranscript);
            if (fullTranscript) setStatus(`Hearing: "${fullTranscript.slice(-35)}${fullTranscript.length > 35 ? '...' : ''}"`);
            if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
            silenceTimeoutRef.current = setTimeout(() => {
                if (transcriptRef.current.trim()) { stopListening(); processTranscript(transcriptRef.current.trim()); }
            }, 2500);
        };
        recognition.onend = () => { setIsListening(false); if (mediaStreamRef.current) { mediaStreamRef.current.getTracks().forEach(t => t.stop()); mediaStreamRef.current = null; } };
        recognition.onerror = (e) => { console.error('Speech error:', e.error); setIsListening(false); if (e.error === 'no-speech') setStatus("No speech detected. Tap to try again."); setConversationState('IDLE'); };
        recognitionRef.current = recognition;
        return () => { if (recognitionRef.current) try { recognitionRef.current.stop(); } catch (e) { } if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current); };
    }, [processTranscript]);

    const closeForm = () => {
        setActiveForm(null);
        setConversationState('IDLE');
        setStatus("Ready to help");
        setFormValues({});
        setTranscript("");
        setMissingFields([]);
        stopListening();
        window.speechSynthesis.cancel();
    };

    const handleMicInteraction = async () => {
        if (!activeForm) return;
        if (!SpeechRecognition) { setStatus("Speech recognition not supported. Use Chrome."); return; }

        if (conversationState === 'IDLE') {
            setConversationState('INTRO');
            setStatus("AI Thinking...");
            try {
                const greetingResponse = await axios.post(`${API_URL}/chat`, {
                    state: 'INTRO',
                    context: { formTitle: activeForm.title },
                    fieldCount: activeForm.fields.length,
                    fieldLabels: activeForm.fields.map(f => f.label)
                });
                setStatus("AI Speaking...");
                await speak(greetingResponse.data.reply);
            } catch (error) {
                const fields = activeForm.fields.slice(0, 4).map(f => f.label).join(', ');
                await speak(`Hi! Let's fill the ${activeForm.title}. I need: ${fields}. Go ahead!`);
            }
            setConversationState('LISTENING');
            setStatus("Listening... speak now!");
            await startListening();
            return;
        }

        if (conversationState === 'LISTENING' && isListening) {
            stopListening();
            if (transcript.trim()) processTranscript(transcript.trim());
            else { setStatus("I didn't catch that. Tap to try again."); setConversationState('IDLE'); }
            return;
        }

        if (conversationState === 'DONE') {
            setConversationState('IDLE');
            setFormValues({});
            setTranscript("");
            setMissingFields([]);
            setStatus("Ready to help");
            speak("Ready for another one!");
        }
    };

    const getMicButtonStyle = () => {
        if (isListening) return 'bg-red-500';
        if (conversationState === 'DONE') return 'bg-green-500';
        if (conversationState === 'PROCESSING' || conversationState === 'INTRO') return 'bg-brand-600';
        return 'bg-brand-600 hover:bg-brand-700 active:scale-95';
    };

    const getMicIcon = () => {
        if (conversationState === 'PROCESSING' || conversationState === 'INTRO') return <Loader2 className="animate-spin" size={32} />;
        if (conversationState === 'DONE') return <CheckCircle2 size={32} />;
        if (isListening) return <MicOff size={32} />;
        return <Mic size={32} />;
    };

    const getHintText = () => {
        if (isListening) return "Tap to stop & process";
        if (conversationState === 'DONE') return "Tap to Reset";
        if (conversationState === 'PROCESSING') return "Processing...";
        return "Tap to Start";
    };

    const filledCount = Object.values(formValues).filter(v => v && v.trim()).length;
    const totalFields = activeForm?.fields?.length || 0;
    const progressPercent = totalFields > 0 ? (filledCount / totalFields) * 100 : 0;

    return (
        <section id="demo" className="py-20 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Try It Yourself</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">Select a form below. Speak your information naturally, and watch the AI fill it for you.</p>
                </div>

                <AnimatePresence mode="wait">
                    {!activeForm ? (
                        <motion.div key="picker" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {MOCK_FORMS.map((form) => (
                                <div key={form.id} onClick={() => setActiveForm(form)} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-brand-200 transition-all cursor-pointer group">
                                    <div className={`w-12 h-12 rounded-xl ${form.color} bg-opacity-10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <FileText className={`text-${form.color.replace('bg-', '')}`} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{form.title}</h3>
                                    <p className="text-gray-500 text-sm mb-4">{form.description}</p>
                                    <div className="flex items-center text-brand-600 text-sm font-medium">Select Form <ChevronRight size={16} /></div>
                                </div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div key="workspace" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="h-[800px] flex flex-col md:flex-row gap-6 relative">
                            {/* Left - Form */}
                            <div className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-y-auto relative p-8">
                                <div className="absolute top-4 left-4 z-10">
                                    <button onClick={closeForm} className="bg-gray-100 p-2 rounded-full shadow-sm text-gray-600 hover:text-red-500 transition-colors"><X size={20} /></button>
                                </div>
                                <div className="max-w-2xl mx-auto mt-8">
                                    <div className={`h-2 ${activeForm.color} rounded-t-lg mb-0`}></div>
                                    <div className="bg-white border border-gray-200 border-t-0 p-8 rounded-b-lg shadow-sm mb-6">
                                        <h1 className="text-3xl font-normal text-gray-900 mb-2">{activeForm.title}</h1>
                                        <p className="text-gray-500 text-sm">Speak your information and let AI fill this form.</p>
                                    </div>
                                    <div className="space-y-4">
                                        {activeForm.fields.map((field) => (
                                            <div key={field.id} id={field.id} className={`bg-white border p-6 rounded-lg shadow-sm transition-all hover:shadow-md ${formValues[field.id] ? 'border-green-300 bg-green-50/30' : missingFields.includes(field.label) ? 'border-orange-300 bg-orange-50/30' : 'border-gray-200'}`}>
                                                <label className="block text-base font-medium text-gray-800 mb-4">
                                                    {field.label} <span className="text-red-500">*</span>
                                                    {formValues[field.id] && <span className="ml-2 text-green-500 text-sm">✓</span>}
                                                </label>
                                                {field.type === 'textarea' ? (
                                                    <textarea readOnly value={formValues[field.id] || ''} className="w-full border-b border-gray-300 outline-none py-2 text-gray-700 bg-transparent min-h-[40px]" placeholder="Your answer" />
                                                ) : (
                                                    <input type={field.type} readOnly value={formValues[field.id] || ''} className="w-full border-b border-gray-300 outline-none py-2 text-gray-700 bg-transparent" placeholder="Your answer" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-8 flex items-center justify-between">
                                        <button className={`text-white px-6 py-2 rounded font-bold transition-colors ${activeForm.color} opacity-90 hover:opacity-100`}>Submit</button>
                                        <span className="text-sm text-green-600 font-medium cursor-pointer">Clear form</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right - Pebbles Panel */}
                            <div className="w-full md:w-[320px] shrink-0 flex flex-col z-20">
                                <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-full ring-8 ring-black/5">
                                    <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded bg-brand-600 flex items-center justify-center"><Mic size={14} className="text-white" /></div>
                                            <span className="font-semibold text-gray-900">Pebbles</span>
                                        </div>
                                        <div className={`text-xs font-medium px-2 py-1 rounded ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-brand-50 text-brand-600'}`}>{isListening ? '● Recording' : 'Active'}</div>
                                    </div>
                                    <div className="flex-1 p-6 flex flex-col items-center justify-center relative">
                                        {totalFields > 0 && (
                                            <div className="w-full mb-4">
                                                <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Progress</span><span>{filledCount}/{totalFields} fields</span></div>
                                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <motion.div className="h-full bg-green-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.3 }} />
                                                </div>
                                            </div>
                                        )}
                                        <div className="text-center mb-4 w-full">
                                            <AnimatePresence mode="wait">
                                                <motion.div key={status} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-gray-100 p-4 rounded-xl rounded-bl-none text-sm text-gray-700 mb-4 text-left relative">
                                                    {status.includes("Thinking") || status.includes("Speaking") ? <span className="flex items-center gap-2"><MessageSquare size={14} />{status.includes("Thinking") ? "Thinking..." : "Speaking..."}</span>
                                                        : status.includes("Hearing") ? <span className="flex items-center gap-2 text-red-600"><Mic size={14} className="animate-pulse" />{status}</span>
                                                            : status}
                                                    <div className="absolute -bottom-2 left-4 w-4 h-4 bg-gray-100 transform rotate-45"></div>
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>
                                        <AudioWaveform isActive={isListening} analyser={analyserRef.current} />
                                        {transcript && (conversationState === 'LISTENING' || conversationState === 'PROCESSING') && (
                                            <div className="w-full bg-gray-50 rounded-lg p-3 mb-4 max-h-20 overflow-y-auto">
                                                <div className="text-xs text-gray-400 mb-1">Your words:</div>
                                                <div className="text-sm text-gray-700 italic">"{transcript}"</div>
                                            </div>
                                        )}
                                        <div className="relative">
                                            {isListening && <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }} transition={{ repeat: Infinity, duration: 1.2 }} className="absolute w-full h-full bg-red-200 rounded-full" /></div>}
                                            {(conversationState === 'INTRO' || conversationState === 'PROCESSING') && <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute w-full h-full bg-brand-200 rounded-full" /></div>}
                                            <button onClick={handleMicInteraction} disabled={conversationState === 'INTRO' || conversationState === 'PROCESSING'} className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-all relative z-10 ${getMicButtonStyle()}`}>{getMicIcon()}</button>
                                        </div>
                                        <div className="mt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">{getHintText()}</div>
                                        {conversationState === 'DONE' && (
                                            <div className="mt-6 text-center">
                                                <div className="text-xs text-gray-400 mb-1">DATA SOURCE</div>
                                                <div className="text-xs font-mono text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100 inline-block">Live Gemini 2.0 Flash</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default Playground;
