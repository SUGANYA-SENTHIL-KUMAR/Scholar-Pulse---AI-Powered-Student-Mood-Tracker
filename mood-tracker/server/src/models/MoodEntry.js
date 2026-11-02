import mongoose from "mongoose";
const moodEntrySchema = new mongoose.Schema({ user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, transcript: { type: String, required: true }, emotion: { type: String, required: true }, confidence: Number, riskLevel: String, sentiment: { positive: Number, negative: Number, neutral: Number, compound: Number }, voiceEnergy: Number, acousticFeatures: mongoose.Schema.Types.Mixed }, { timestamps: true });
export default mongoose.model("MoodEntry", moodEntrySchema);
