// File: src/useMotivationVoice.js

export default function useMotivationVoice() {
  const speak = (message, mood = "neutral") => {
    if (!window.speechSynthesis) return;

    const voices = speechSynthesis.getVoices();
    const preferred = voices.find((v) => v.name.includes("Google") || v.lang === "en-US");

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.voice = preferred || voices[0];

    switch (mood) {
      case "hype":
        utterance.pitch = 1.4;
        utterance.rate = 0.95;
        break;
      case "calm":
        utterance.pitch = 0.9;
        utterance.rate = 0.9;
        break;
      case "serious":
        utterance.pitch = 1.0;
        utterance.rate = 0.85;
        break;
      default:
        break;
    }

    speechSynthesis.speak(utterance);
  };

  const motivate = (digit, chance) => {
    if (chance >= 90) {
      speak(`Digit ${digit} sniper setup looks unstoppable. Get ready!`, "hype");
    } else if (chance >= 75) {
      speak(`Digit ${digit} showing strong sniper signs. Stay alert.`, "calm");
    } else if (chance <= 50) {
      speak(`Sniper setup on digit ${digit} seems risky. Be cautious.`, "serious");
    }
  };

  return { speak, motivate };
}
