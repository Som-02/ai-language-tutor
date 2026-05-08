import { useState } from 'react';

export default function useSpeechSynthesis() {
  const [speaking, setSpeaking] = useState(false);

  const speak = (text, langCode = 'en-US') => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance    = new SpeechSynthesisUtterance(text);
    utterance.lang     = langCode;
    utterance.rate     = 0.9;
    utterance.pitch    = 1;

    // Try to find a native voice for the language
    const voices = window.speechSynthesis.getVoices();
    const match  = voices.find(v => v.lang.startsWith(langCode.split('-')[0]));
    if (match) utterance.voice = match;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend   = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  };

  return { speak, stop, speaking };
}