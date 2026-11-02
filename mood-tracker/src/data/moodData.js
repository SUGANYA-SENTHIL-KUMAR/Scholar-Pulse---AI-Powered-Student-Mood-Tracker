// src/data/moodData.js
//
// Central definition of every mood the app can detect: its emoji, display
// name, keyword list (used for text-based detection), a short positive
// message, and a few simple mood-normalizing exercises.

const moodData = {
  Happy: {
    emoji: "😄",
    color: "var(--mood-happy)",
    keywords: [
      "happy", "great", "good", "awesome", "excited", "joy", "joyful",
      "wonderful", "fantastic", "glad", "love", "amazing", "fun",
      "excellent", "delighted", "cheerful", "grateful", "proud",
    ],
    message: "It's great to hear you're feeling good! Keep that energy going.",
    exercises: [
      "Write down one thing that made you smile today.",
      "Share your good mood with a friend or family member.",
      "Take a short walk and notice three things you enjoy around you.",
    ],
  },
  Calm: {
    emoji: "😌",
    color: "var(--mood-calm)",
    keywords: [
      "calm", "relaxed", "peaceful", "fine", "okay", "content", "steady",
      "chill", "comfortable", "rested",
    ],
    message: "You sound calm and settled. That's a great place to be.",
    exercises: [
      "Take five slow, deep breaths to stay grounded.",
      "Spend a few minutes stretching or sitting quietly.",
      "Jot down one thing you're grateful for right now.",
    ],
  },
  Sad: {
    emoji: "😢",
    color: "var(--mood-sad)",
    keywords: [
      "sad", "down", "depressed", "unhappy", "cry", "crying", "lonely",
      "hopeless", "tired", "upset", "miserable", "hurt", "empty", "low",
      "heartbroken", "disappointed", "worthless", "exhausted",
    ],
    message:
      "It sounds like things are heavy right now. Be gentle with yourself — this feeling won't last forever.",
    exercises: [
      "Try slow breathing: inhale for 4 counts, hold for 4, exhale for 6.",
      "Reach out to someone you trust and share how you're feeling.",
      "Step outside for a few minutes of fresh air and natural light.",
      "Write down what's on your mind — getting it out of your head can help.",
    ],
  },
  Angry: {
    emoji: "😠",
    color: "var(--mood-angry)",
    keywords: [
      "angry", "mad", "furious", "annoyed", "frustrated", "hate",
      "irritated", "rage", "pissed", "outraged", "resentful", "fed up",
    ],
    message:
      "It sounds like something's really frustrating you. Let's take a moment to cool down before reacting.",
    exercises: [
      "Try box breathing: inhale 4, hold 4, exhale 4, hold 4 — repeat 4 times.",
      "Step away from the situation for a few minutes before responding.",
      "Unclench your jaw and shoulders, and let your hands relax.",
      "Write down what triggered this feeling, without judging yourself.",
    ],
  },
  Neutral: {
    emoji: "😐",
    color: "var(--mood-neutral)",
    keywords: [],
    message: "Thanks for checking in. Not every moment needs a strong emotion attached to it.",
    exercises: [
      "Take a moment to notice how your body feels right now.",
      "Drink a glass of water and take a short break.",
      "Set one small, achievable goal for the next hour.",
    ],
  },
};

export default moodData;
