const {
  INTENSITY_LABELS,
  UNHINGED_LABELS,
  BOOTH_FALLBACK,
  LAUNDRY_FALLBACK,
  parseBoothResponse,
  parseLaundryResponse,
} = require('../lib/responses');

// ── Label arrays ────────────────────────────────────────────────────

describe('INTENSITY_LABELS', () => {
  test('has exactly 5 levels', () => expect(INTENSITY_LABELS).toHaveLength(5));
  test('starts with gentle and ends with nuclear', () => {
    expect(INTENSITY_LABELS[0]).toBe('gentle');
    expect(INTENSITY_LABELS[4]).toBe('nuclear');
  });
});

describe('UNHINGED_LABELS', () => {
  test('has exactly 5 levels', () => expect(UNHINGED_LABELS).toHaveLength(5));
  test('starts with quirky and ends with cosmic horror', () => {
    expect(UNHINGED_LABELS[0]).toBe('quirky');
    expect(UNHINGED_LABELS[4]).toBe('cosmic horror');
  });
});

// ── parseBoothResponse ──────────────────────────────────────────────

describe('parseBoothResponse', () => {
  const validRaw = JSON.stringify({
    nonna:  "Madonna mia!",
    bestie: "YOU GOT THIS QUEEN 💅",
    coach:  "Open the doc and write one sentence.",
  });

  test('parses clean JSON', () => {
    const result = parseBoothResponse(validRaw);
    expect(result.nonna).toBe("Madonna mia!");
    expect(result.bestie).toBe("YOU GOT THIS QUEEN 💅");
    expect(result.coach).toBe("Open the doc and write one sentence.");
  });

  test('strips markdown code fences before parsing', () => {
    const fenced = `\`\`\`json\n${validRaw}\n\`\`\``;
    const result = parseBoothResponse(fenced);
    expect(result.nonna).toBe("Madonna mia!");
  });

  test('extracts JSON embedded in surrounding prose', () => {
    const wrapped = `Here is the response: ${validRaw} Hope that helps!`;
    const result = parseBoothResponse(wrapped);
    expect(result.coach).toBe("Open the doc and write one sentence.");
  });

  test('returns full fallback on completely invalid input', () => {
    const result = parseBoothResponse("not json at all %%%");
    expect(result).toEqual(BOOTH_FALLBACK);
  });

  test('returns full fallback on empty string', () => {
    expect(parseBoothResponse("")).toEqual(BOOTH_FALLBACK);
  });

  test('fills missing keys with fallback values', () => {
    const partial = JSON.stringify({ nonna: "Mamma mia!" });
    const result = parseBoothResponse(partial);
    expect(result.nonna).toBe("Mamma mia!");
    expect(result.bestie).toBe(BOOTH_FALLBACK.bestie);
    expect(result.coach).toBe(BOOTH_FALLBACK.coach);
  });

  test('returned object always has nonna, bestie, coach keys', () => {
    const result = parseBoothResponse("{}");
    expect(result).toHaveProperty('nonna');
    expect(result).toHaveProperty('bestie');
    expect(result).toHaveProperty('coach');
  });
});

// ── parseLaundryResponse ────────────────────────────────────────────

describe('parseLaundryResponse', () => {
  const validRaw = JSON.stringify({
    suit:     "I'm unable to attend due to a personal matter.",
    human:    "Hey, something came up — can we reschedule?",
    unhinged: "A philosophical goose has trapped me in my driveway.",
  });

  test('parses clean JSON', () => {
    const result = parseLaundryResponse(validRaw);
    expect(result.suit).toBe("I'm unable to attend due to a personal matter.");
    expect(result.human).toBe("Hey, something came up — can we reschedule?");
    expect(result.unhinged).toBe("A philosophical goose has trapped me in my driveway.");
  });

  test('strips markdown code fences before parsing', () => {
    const fenced = `\`\`\`json\n${validRaw}\n\`\`\``;
    const result = parseLaundryResponse(fenced);
    expect(result.suit).toContain("personal matter");
  });

  test('extracts JSON embedded in surrounding prose', () => {
    const wrapped = `Sure! Here you go: ${validRaw}`;
    const result = parseLaundryResponse(wrapped);
    expect(result.unhinged).toContain("goose");
  });

  test('returns full fallback on invalid input', () => {
    expect(parseLaundryResponse("garbage")).toEqual(LAUNDRY_FALLBACK);
  });

  test('returns full fallback on empty string', () => {
    expect(parseLaundryResponse("")).toEqual(LAUNDRY_FALLBACK);
  });

  test('fills missing keys with fallback values', () => {
    const partial = JSON.stringify({ suit: "I'm unavailable." });
    const result = parseLaundryResponse(partial);
    expect(result.suit).toBe("I'm unavailable.");
    expect(result.human).toBe(LAUNDRY_FALLBACK.human);
    expect(result.unhinged).toBe(LAUNDRY_FALLBACK.unhinged);
  });

  test('returned object always has suit, human, unhinged keys', () => {
    const result = parseLaundryResponse("{}");
    expect(result).toHaveProperty('suit');
    expect(result).toHaveProperty('human');
    expect(result).toHaveProperty('unhinged');
  });
});

// ── Fallback immutability ────────────────────────────────────────────

describe('fallback objects', () => {
  test('parseBoothResponse does not mutate BOOTH_FALLBACK', () => {
    const before = { ...BOOTH_FALLBACK };
    parseBoothResponse("bad json");
    expect(BOOTH_FALLBACK).toEqual(before);
  });

  test('parseLaundryResponse does not mutate LAUNDRY_FALLBACK', () => {
    const before = { ...LAUNDRY_FALLBACK };
    parseLaundryResponse("bad json");
    expect(LAUNDRY_FALLBACK).toEqual(before);
  });
});
