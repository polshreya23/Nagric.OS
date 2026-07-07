import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Sparkles, Send, RefreshCw } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

export const JarvisAssistant: React.FC = () => {
  const { playFeedbackAudio, currentLanguage } = useAccessibility();
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [aiSpeech, setAiSpeech] = useState<string>('Greetings Citizen, I am Jarvis. How can I guide you today?');
  const [inputText, setInputText] = useState('');
  const [dialogues, setDialogues] = useState<Array<{ sender: 'user' | 'jarvis', text: string }>>([
    { sender: 'jarvis', text: 'Greetings Citizen, I am Jarvis. How can I guide you today?' }
  ]);

  const handleSpeechSimulation = () => {
    if (isListening) {
      setIsListening(false);
      setIsThinking(true);

      // Simulate intent extraction & DB routing
      setTimeout(() => {
        setIsThinking(false);
        const userUtterance = "Crop damage compensation registration";
        const answer = currentLanguage === 'hi' 
          ? "मैंने आपकी भूमि रिकॉर्ड के अनुसार पीएम फसल बीमा योजना आवेदन पत्र तैयार कर दिया है। क्या मैं इसे सबमिट करूं?"
          : "I have prepared the PM Fasal Bima Scheme form matching your geo-coordinates. Shall I submit it now?";
        
        setDialogues(prev => [
          ...prev,
          { sender: 'user', text: userUtterance },
          { sender: 'jarvis', text: answer }
        ]);
        setAiSpeech(answer);
        playFeedbackAudio(answer);
      }, 1800);
    } else {
      setIsListening(true);
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(60);
      }
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText;
    setDialogues(prev => [...prev, { sender: 'user', text: userText }]);
    setInputText('');
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      let responseText = `I have verified your request: "${userText}" and cross-referenced with your DigiVault. No discrepancies found.`;
      if (userText.toLowerCase().includes('scam') || userText.toLowerCase().includes('whatsapp')) {
        responseText = "Scam Shield Alert: The flyer URL is NOT registered on dynamic government DNS. Please do not submit transaction fees.";
      } else if (userText.toLowerCase().includes('explain')) {
        responseText = "Jargon-Buster: This notice confirms your building verification compliance approval under Section 4(B). No penalty is due.";
      }
      setDialogues(prev => [...prev, { sender: 'jarvis', text: responseText }]);
      setAiSpeech(responseText);
      playFeedbackAudio(responseText);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/40 rounded-3xl border border-slate-800/80 overflow-hidden backdrop-blur-xl">
      {/* 1. Header Banner */}
      <div className="px-6 py-4 bg-slate-950/40 border-b border-slate-800/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
            </span>
          </div>
          <div>
            <h3 className="font-outfit text-sm font-semibold tracking-wide text-slate-200">JARVIS CORE GRID</h3>
            <p className="text-xs text-slate-400 font-mono">Status: Connected (15-Dialect Mesh)</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">RAG-Active</span>
        </div>
      </div>

      {/* 2. Visual AI Avatar Grid */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        <div className="relative mb-6">
          {/* Futuristic Glowing Rings */}
          <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 to-orange-500 blur-xl opacity-20 transition-transform duration-1000 ${isListening ? 'scale-125 animate-pulse' : 'scale-100'}`} />
          
          <button
            onClick={handleSpeechSimulation}
            className={`relative z-10 w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-950 to-slate-900 border flex flex-col items-center justify-center transition-all duration-300 ${
              isListening 
                ? 'border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.3)] scale-105' 
                : 'border-slate-800 hover:border-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]'
            }`}
          >
            {isListening ? (
              <Volume2 className="h-10 w-10 text-orange-500 animate-bounce" />
            ) : isThinking ? (
              <RefreshCw className="h-10 w-10 text-indigo-400 animate-spin" />
            ) : (
              <Mic className="h-10 w-10 text-slate-300 group-hover:text-indigo-400" />
            )}
            
            <span className="text-[10px] text-slate-400 font-mono mt-2 uppercase tracking-widest">
              {isListening ? 'Listening' : isThinking ? 'Analyzing' : 'Tap to Speak'}
            </span>
          </button>
        </div>

        {/* 3. Audio Waveform Indicators */}
        <div className="h-8 flex items-center justify-center gap-1.5 mb-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-1 rounded-full bg-gradient-to-t from-indigo-500 to-orange-400 voice-bar ${
                isListening || isThinking ? 'h-6' : 'h-2 opacity-30'
              }`}
            />
          ))}
        </div>

        {/* 4. Display Dialogues */}
        <div className="w-full text-center px-4 max-h-36 overflow-y-auto mb-2 text-sm text-slate-300 font-medium">
          <p className="italic text-slate-400 font-light">&ldquo;{aiSpeech}&rdquo;</p>
        </div>
      </div>

      {/* 5. Terminal-like TextInput Grid */}
      <form onSubmit={handleSendMessage} className="p-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-3">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask schemes status, evaluate forwarded sms, or paste doc URLs..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white p-2.5 rounded-xl transition-all"
        >
          <Send className="h-4.5 w-4.5" />
        </button>
      </form>
    </div>
  );
};
export default JarvisAssistant;
