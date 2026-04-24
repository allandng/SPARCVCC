# Hail Mary

Sparc vibe coding contest — Andrew, Allan, Yunus

A dual-mode AI app: confess what you're procrastinating on and get roasted by three personas (Nonna, Bestie, Coach), or feed it your real excuse and get three laundered versions (corporate, human, unhinged).

## Setup

1. Get a free Gemini API key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey) — create the key **from AI Studio directly**, not from Google Cloud Console, or the free tier won't apply.

2. Add it to `.env`:
   ```
   GEMINI_API_KEY=your-key-here
   ```

3. Install and run:
   ```bash
   npm install
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Tests

```bash
npm test
```
