// Pure AI response parsing logic — no browser dependencies.
// app.jsx inlines equivalent logic; this module is the testable source of truth.

const INTENSITY_LABELS = ["gentle", "pointed", "spicy", "savage", "nuclear"];
const UNHINGED_LABELS  = ["quirky", "weird", "deranged", "feral", "cosmic horror"];

const BOOTH_FALLBACK = {
  nonna:  "Madonna mia… procrastinating again? Your nonna is rolling in her grave, and she's not even dead yet.",
  bestie: "OKAY but first of all? Iconic of you to even ADMIT this. We love a self-aware legend. Now hop to it babe 💅",
  coach:  "Open the document and type one sentence — any sentence. Timer: 5 minutes.",
};

const LAUNDRY_FALLBACK = {
  suit:     "I'm unable to attend today due to unforeseen personal circumstances. I'll follow up to reschedule.",
  human:    "Hey, not gonna make it today — feeling kinda off. Catch up soon?",
  unhinged: "I'm deep in a philosophical crisis triggered by a yogurt label and cannot, in good conscience, leave the apartment until I resolve it.",
};

function extractJson(raw) {
  const cleaned = raw.replace(/```json|```/g, "").trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  return JSON.parse(match ? match[0] : cleaned);
}

function parseBoothResponse(raw) {
  try {
    const parsed = extractJson(raw);
    return {
      nonna:  parsed.nonna  || BOOTH_FALLBACK.nonna,
      bestie: parsed.bestie || BOOTH_FALLBACK.bestie,
      coach:  parsed.coach  || BOOTH_FALLBACK.coach,
    };
  } catch {
    return { ...BOOTH_FALLBACK };
  }
}

function parseLaundryResponse(raw) {
  try {
    const parsed = extractJson(raw);
    return {
      suit:     parsed.suit     || LAUNDRY_FALLBACK.suit,
      human:    parsed.human    || LAUNDRY_FALLBACK.human,
      unhinged: parsed.unhinged || LAUNDRY_FALLBACK.unhinged,
    };
  } catch {
    return { ...LAUNDRY_FALLBACK };
  }
}

module.exports = {
  INTENSITY_LABELS,
  UNHINGED_LABELS,
  BOOTH_FALLBACK,
  LAUNDRY_FALLBACK,
  parseBoothResponse,
  parseLaundryResponse,
};
