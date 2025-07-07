// File: src/speechAlerts.js

export function speak(message, mood = "calm") {
  if (!window.speechSynthesis) return;

  const utterance = new SpeechSynthesisUtterance(message);

  // Customize voice mood
  const voices = window.speechSynthesis.getVoices();
  const selected =
    voices.find((v) => v.name.includes("Google") && v.lang === "en-US") ||
    voices[0];

  utterance.voice = selected;

  switch (mood) {
    case "funny":
      utterance.rate = 1.4;
      utterance.pitch = 1.6;
      break;
    case "serious":
      utterance.rate = 0.9;
      utterance.pitch = 0.8;
      break;
    case "calm":
    default:
      utterance.rate = 1.1;
      utterance.pitch = 1.1;
      break;
  }

  speechSynthesis.speak(utterance);
}
