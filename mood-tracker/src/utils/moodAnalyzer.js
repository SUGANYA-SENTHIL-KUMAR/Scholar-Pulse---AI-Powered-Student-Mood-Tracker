// src/utils/moodAnalyzer.js
//
// Simple, beginner-friendly mood detection:
//   1. Count keyword matches for each mood in the spoken text.
//   2. Pick the mood with the highest match count (Neutral if none match).
//   3. Turn the match count into a confidence percentage.
//   4. Nudge the confidence using a rough "voice energy" reading (average
//      loudness while speaking) — louder speech slightly boosts Angry/Happy,
//      quieter speech slightly boosts Sad/Calm.
//
import moodData from "../data/moodData";

function scoreText(text) {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  const scores = {};
  Object.keys(moodData).forEach((mood) => {
    scores[mood] = 0;
  });

  words.forEach((word) => {
    Object.entries(moodData).forEach(([mood, data]) => {
      if (data.keywords.includes(word)) {
        scores[mood] += 1;
      }
    });
  });

  return { scores, wordCount: words.length };
}

// energyLevel is a rough 0-1 loudness reading captured while the user spoke.
// It's optional — if not provided, detection relies on keywords only.
export function analyzeMood(text, energyLevel = null) {
  const { scores, wordCount } = scoreText(text);

  let topMood = "Neutral";
  let topScore = 0;
  Object.entries(scores).forEach(([mood, score]) => {
    if (score > topScore) {
      topScore = score;
      topMood = mood;
    }
  });

  // Base confidence: how much of the speech matched the winning mood's
  // keywords, scaled up so a couple of strong words still reads as
  // meaningful (beginner-friendly heuristic, not a real NLP model).
  let confidence = 0;
  if (wordCount > 0 && topScore > 0) {
    confidence = Math.min(95, Math.round((topScore / Math.min(wordCount, 6)) * 100));
    confidence = Math.max(confidence, 50); // any keyword match is at least 50%
  } else {
    // No keywords matched at all -> Neutral with modest confidence
    topMood = "Neutral";
    confidence = 40;
  }

  // Voice energy nudge (optional, simple heuristic)
  if (energyLevel !== null && !Number.isNaN(energyLevel)) {
    if (energyLevel > 0.6 && (topMood === "Angry" || topMood === "Happy")) {
      confidence = Math.min(95, confidence + 10);
    } else if (energyLevel < 0.25 && (topMood === "Sad" || topMood === "Calm")) {
      confidence = Math.min(95, confidence + 10);
    }
  }

  return {
    mood: topMood,
    confidence,
  };
}
