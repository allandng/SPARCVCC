// Hail Mary — Confession Booth for Procrastinators
// Three-persona response: Nonna (judgmental grandma) → Bestie (hype friend) → Coach (5-min step)

const TWEAK_DEFAULTS = {
  "grandmaIntensity": 3,
  "unhingedLevel": 3
};

const INTENSITY_LABELS = ["gentle", "pointed", "spicy", "savage", "nuclear"];
const UNHINGED_LABELS = ["quirky", "weird", "deranged", "feral", "cosmic horror"];

// ── Gemini API helper ──────────────────────────────────────────────
async function geminiComplete(prompt) {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const { text } = await res.json();
  return text;
}

// ───────────────────────────── Mascot ─────────────────────────────
function Mary({ size = 120, mood = "idle", listening = false }) {
  const eyeScale = mood === "thinking" ? 0.6 : 1;
  const mouth =
    mood === "speaking" ? "M 42 72 Q 60 84 78 72" :
    mood === "thinking" ? "M 46 76 Q 60 74 74 76" :
    mood === "wink"     ? "M 44 74 Q 60 82 76 74" :
                          "M 44 74 Q 60 80 76 74";

  return (
    <svg viewBox="0 0 120 120" width={size} height={size} style={{ display: "block" }}>
      {/* halo */}
      <ellipse cx="60" cy="18" rx="30" ry="6" fill="none"
               stroke="#E8B845" strokeWidth="3" />
      {/* veil back */}
      <path d="M 18 60 Q 18 30 60 28 Q 102 30 102 60 L 102 108 Q 60 98 18 108 Z"
            fill="#6B7FD7" />
      {/* face */}
      <ellipse cx="60" cy="62" rx="30" ry="34" fill="#FBE8D0" />
      {/* veil front edges */}
      <path d="M 30 60 Q 22 45 30 36 Q 40 30 52 32 L 48 56 Z" fill="#5A6DC2" />
      <path d="M 90 60 Q 98 45 90 36 Q 80 30 68 32 L 72 56 Z" fill="#5A6DC2" />
      {/* cheeks */}
      <circle cx="40" cy="70" r="5" fill="#F3B5A3" opacity="0.55" />
      <circle cx="80" cy="70" r="5" fill="#F3B5A3" opacity="0.55" />
      {/* eyes */}
      {mood === "wink" ? (
        <>
          <circle cx="48" cy={60} r={3} fill="#29261B" />
          <path d="M 68 60 Q 74 60 78 60" stroke="#29261B" strokeWidth="3"
                strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <ellipse cx="48" cy={60} rx={3} ry={3 * eyeScale} fill="#29261B">
            {listening && (
              <animate attributeName="ry" values="3;0.4;3" dur="3.2s" repeatCount="indefinite" />
            )}
          </ellipse>
          <ellipse cx="72" cy={60} rx={3} ry={3 * eyeScale} fill="#29261B">
            {listening && (
              <animate attributeName="ry" values="3;0.4;3" dur="3.2s" repeatCount="indefinite" />
            )}
          </ellipse>
        </>
      )}
      {/* brows */}
      <path d="M 42 52 Q 48 50 54 52" stroke="#29261B" strokeWidth="2"
            strokeLinecap="round" fill="none" />
      <path d="M 66 52 Q 72 50 78 52" stroke="#29261B" strokeWidth="2"
            strokeLinecap="round" fill="none" />
      {/* mouth */}
      <path d={mouth} stroke="#29261B" strokeWidth="2.5"
            strokeLinecap="round" fill="none" />
      {/* small cross pendant */}
      <rect x="58" y="104" width="4" height="10" rx="1" fill="#E8B845" />
      <rect x="54" y="107" width="12" height="4" rx="1" fill="#E8B845" />
    </svg>
  );
}

// ─────────────────────────── Demon mascot ───────────────────────────
function Demon({ size = 120, mood = "idle", listening = false }) {
  const eyeScale = mood === "thinking" ? 0.6 : 1;
  const mouth =
    mood === "speaking" ? "M 42 76 Q 60 86 78 76" :
    mood === "thinking" ? "M 46 78 Q 60 76 74 78" :
    mood === "wink"     ? "M 44 78 Q 60 84 76 78" :
                          "M 44 78 Q 60 82 76 78";
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} style={{ display: "block" }}>
      {/* unholy ring */}
      <ellipse cx="60" cy="18" rx="30" ry="6" fill="none"
               stroke="#C8322A" strokeWidth="3">
        {listening && (
          <animate attributeName="stroke-opacity" values="0.5;1;0.5"
                   dur="2.4s" repeatCount="indefinite" />
        )}
      </ellipse>
      {/* horns */}
      <path d="M 36 28 Q 30 18 34 10 Q 40 18 42 30 Z" fill="#29261B" />
      <path d="M 84 28 Q 90 18 86 10 Q 80 18 78 30 Z" fill="#29261B" />
      <path d="M 38 22 Q 36 16 38 13" stroke="#5A1A14" strokeWidth="1" fill="none" opacity="0.5" />
      <path d="M 82 22 Q 84 16 82 13" stroke="#5A1A14" strokeWidth="1" fill="none" opacity="0.5" />
      {/* cloak */}
      <path d="M 18 60 Q 18 30 60 28 Q 102 30 102 60 L 102 108 Q 60 98 18 108 Z"
            fill="#5A1A14" />
      {/* face */}
      <ellipse cx="60" cy="62" rx="30" ry="34" fill="#F2C9A8" />
      {/* veil front points */}
      <path d="M 30 60 Q 22 45 28 34 L 38 30 L 50 34 L 48 58 Z" fill="#3E0E0A" />
      <path d="M 90 60 Q 98 45 92 34 L 82 30 L 70 34 L 72 58 Z" fill="#3E0E0A" />
      {/* cheeks */}
      <circle cx="40" cy="72" r="5" fill="#C8322A" opacity="0.35" />
      <circle cx="80" cy="72" r="5" fill="#C8322A" opacity="0.35" />
      {/* eyes */}
      {mood === "wink" ? (
        <>
          <circle cx="48" cy="62" r={3} fill="#29261B" />
          <path d="M 68 62 Q 74 62 78 62" stroke="#29261B" strokeWidth="3"
                strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <ellipse cx="48" cy={62} rx={3} ry={3 * eyeScale} fill="#29261B">
            {listening && (
              <animate attributeName="ry" values="3;0.4;3" dur="2.8s" repeatCount="indefinite" />
            )}
          </ellipse>
          <ellipse cx="72" cy={62} rx={3} ry={3 * eyeScale} fill="#29261B">
            {listening && (
              <animate attributeName="ry" values="3;0.4;3" dur="2.8s" repeatCount="indefinite" />
            )}
          </ellipse>
          {/* glowing red pupils */}
          <circle cx="48" cy="62" r="1" fill="#FF5A4E" opacity="0.9" />
          <circle cx="72" cy="62" r="1" fill="#FF5A4E" opacity="0.9" />
        </>
      )}
      {/* angry brows */}
      <path d="M 42 52 L 54 56" stroke="#29261B" strokeWidth="2.5"
            strokeLinecap="round" fill="none" />
      <path d="M 78 52 L 66 56" stroke="#29261B" strokeWidth="2.5"
            strokeLinecap="round" fill="none" />
      {/* mouth */}
      <path d={mouth} stroke="#29261B" strokeWidth="2.5"
            strokeLinecap="round" fill="none" />
      {/* fangs */}
      <path d="M 52 79 L 54 84 L 56 79 Z" fill="#FAF5EC" />
      <path d="M 64 79 L 66 84 L 68 79 Z" fill="#FAF5EC" />
      {/* forked goatee */}
      <path d="M 60 92 L 57 102 L 60 99 L 63 102 Z" fill="#29261B" />
      {/* pentagram pendant */}
      <circle cx="60" cy="110" r="5" fill="none" stroke="#C8322A" strokeWidth="1.2" />
      <path d="M 60 106 L 62 112 L 56 108 L 64 108 L 58 112 Z"
            fill="none" stroke="#C8322A" strokeWidth="0.8" />
    </svg>
  );
}

// ─────────────────────────── Persona meta ───────────────────────────
const PERSONAS = {
  nonna:    { name: "Nonna",    emoji: "👵", color: "#B85C5C", tint: "#F5DCDC",
              desc: "the judgmental grandma" },
  bestie:   { name: "Bestie",   emoji: "💅", color: "#C060A1", tint: "#F6DCEE",
              desc: "your hype friend" },
  coach:    { name: "Coach",    emoji: "🎯", color: "#4A7A5C", tint: "#D9ECDE",
              desc: "one actionable step" },
  suit:     { name: "The Suit", emoji: "💼", color: "#D89A5E", tint: "#3A221C",
              desc: "corporate-professional" },
  human:    { name: "Human",    emoji: "🔥", color: "#E8B845", tint: "#3D2820",
              desc: "believably human" },
  unhinged: { name: "Unhinged", emoji: "👿", color: "#FF5A4E", tint: "#4A1A16",
              desc: "completely off the rails" },
};

// ─────────────────────────── AI calls ───────────────────────────
async function getLaunderedExcuses(reason, unhingedLevel) {
  const weirdness = UNHINGED_LABELS[unhingedLevel] || "deranged";
  const prompt = `You are the brain of "Excuse Laundromat" — a tool that launders embarrassing real reasons into excuses people can actually send.

The user will give you the UNFILTERED truth. Return THREE laundered versions:

1. SUIT — corporate-professional. The kind you'd email your boss or a client. Use phrases like "personal matter," "unable to attend," "circumstances." Slightly stiff. 1-2 sentences.
2. HUMAN — believably human. The kind you'd text a friend without raising alarm. Casual, warm, specific-but-vague. 1-2 sentences.
3. UNHINGED — gloriously off the rails. Weirdness level: ${weirdness}. Commit to an absurd scenario (philosophical crisis, kidnapped by geese, swallowed by a revolving door, etc). Make it funny, not mean. 1-3 sentences.

Real reason: "${reason}"

Return ONLY valid JSON, no markdown, no code fence:
{"suit":"...","human":"...","unhinged":"..."}`;

  try {
    const raw = await geminiComplete(prompt);
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(match ? match[0] : cleaned);
    return {
      suit:     parsed.suit     || "I'm unable to attend today due to a personal matter. Apologies for the short notice.",
      human:    parsed.human    || "Ugh, today just isn't it for me — can we push to later this week?",
      unhinged: parsed.unhinged || "I cannot come in today. A goose has pinned me to my driveway and is lecturing me about property law.",
    };
  } catch (e) {
    console.warn("Gemini call failed, using fallback", e);
    return {
      suit:     "I'm unable to attend today due to unforeseen personal circumstances. I'll follow up to reschedule.",
      human:    "Hey, not gonna make it today — feeling kinda off. Catch up soon?",
      unhinged: "I'm deep in a philosophical crisis triggered by a yogurt label and cannot, in good conscience, leave the apartment until I resolve it.",
    };
  }
}

async function getThreeResponses(confession, intensity) {
  const level = INTENSITY_LABELS[intensity] || "spicy";
  const prompt = `You are the brain of "Hail Mary," a confession booth for procrastinators.

The user is avoiding something. Respond as THREE personas in sequence:

1. NONNA — a judgmental Italian grandmother. Guilt-trip them lovingly. Intensity: ${level}. Reference food, saints, or "when I was your age." 1-2 sentences.
2. BESTIE — their unhinged hype friend. Validate wildly, use caps and slang, reframe their avoidance as queen behavior before redirecting. 1-2 sentences.
3. COACH — calm, practical. Give ONE concrete 5-minute action they can do RIGHT NOW. Specific verb, specific first step. 1 sentence.

User is avoiding: "${confession}"

Return ONLY valid JSON, no markdown, no code fence:
{"nonna":"...","bestie":"...","coach":"..."}`;

  try {
    const raw = await geminiComplete(prompt);
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(match ? match[0] : cleaned);
    return {
      nonna:  parsed.nonna  || "Mamma mia, I have no words.",
      bestie: parsed.bestie || "BESTIE YOU GOT THIS 💖",
      coach:  parsed.coach  || "Open the thing. Stare at it for 5 minutes.",
    };
  } catch (e) {
    console.warn("Gemini call failed, using fallback", e);
    return {
      nonna:  "Madonna mia… procrastinating again? Your nonna is rolling in her grave, and she's not even dead yet.",
      bestie: "OKAY but first of all? Iconic of you to even ADMIT this. We love a self-aware legend. Now hop to it babe 💅",
      coach:  "Open the document and type one sentence — any sentence. Timer: 5 minutes.",
    };
  }
}

// ─────────────────────────── Typing dots ───────────────────────────
function TypingDots({ color }) {
  return (
    <div className="typing">
      <span style={{ background: color }} />
      <span style={{ background: color }} />
      <span style={{ background: color }} />
    </div>
  );
}

// ─────────────────────────── Copy button ───────────────────────────
function CopyButton({ text, color }) {
  const [copied, setCopied] = React.useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta);
      ta.select(); document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <button
      type="button"
      className={"copy-btn" + (copied ? " copied" : "")}
      onClick={onCopy}
      style={{ "--col": color }}
      aria-label="Copy to clipboard"
    >
      {copied ? <><span className="copy-check">✓</span> Copied</>
             : <><span className="copy-icon" aria-hidden>⧉</span> Copy</>}
    </button>
  );
}

function PersonaBubble({ personaKey, text, typing, copyable }) {
  const p = PERSONAS[personaKey];
  return (
    <div className="msg msg-ai" style={{ "--tint": p.tint, "--col": p.color }}>
      <div className="avatar" style={{ background: p.tint, color: p.color }}>
        <span className="avatar-emoji">{p.emoji}</span>
      </div>
      <div className="bubble-wrap">
        <div className="persona-name">{p.name} <span className="persona-desc">· {p.desc}</span></div>
        <div className="bubble">
          {typing ? <TypingDots color={p.color} /> : text}
        </div>
        {copyable && !typing && text && (
          <CopyButton text={text} color={p.color} />
        )}
      </div>
    </div>
  );
}

function UserBubble({ text }) {
  return (
    <div className="msg msg-user">
      <div className="bubble">{text}</div>
    </div>
  );
}

// ─────────────────────────── Modes ───────────────────────────
const MODES = {
  booth: {
    key: "booth",
    brandName: "Hail Mary",
    brandTag: "confession booth for procrastinators",
    subtitle: "click Mary to flip to the other side",
    emptyTitle: <>What are you <em>avoiding?</em></>,
    emptySub: "Tell Mary. Nonna, Bestie, and Coach will answer.",
    placeholder: "i've been putting off…",
    placeholderAgain: "another confession?",
    sendLabel: "Confess",
    workingLabel: "listening",
    personas: ["nonna", "bestie", "coach"],
    chips: [
      "the email I've been dodging for 3 weeks",
      "calling the doctor to book a checkup",
      "starting my taxes",
      "replying to that one text from Sunday",
    ],
  },
  generator: {
    key: "generator",
    brandName: "Hail Mary",
    brandTag: "excuse generator for the hopelessly unbothered",
    subtitle: "click Mary to flip back to the light side",
    emptyTitle: <>What do you <em>really</em> want to get out of?</>,
    emptySub: "Whisper the ugly truth. The Demon will launder it three ways.",
    placeholder: "the real reason (no filter)…",
    placeholderAgain: "another lie to launder?",
    sendLabel: "Summon",
    workingLabel: "conjuring",
    personas: ["suit", "human", "unhinged"],
    chips: [
      "hungover, don't want to go",
      "really just don't like this person",
      "forgot until 20 min ago",
      "would rather watch paint dry",
    ],
  },
};

// ─────────────────────────── Intensity Bars ───────────────────────────
function IntensityBars({ value, onChange, labels, variant = "booth" }) {
  const n = labels.length;
  return (
    <div className={"intensity intensity-" + variant}>
      <div className="intensity-label">
        <span>{variant === "booth" ? "Nonna's intensity" : "Demon's chaos"}</span>
        <b>{labels[value]}</b>
      </div>
      <div className="intensity-bars" role="slider"
           aria-valuemin={0} aria-valuemax={n - 1} aria-valuenow={value}>
        {Array.from({ length: n }).map((_, i) => {
          const active = i <= value;
          const h = 16 + i * 8; // 16, 24, 32, 40, 48
          return (
            <button
              key={i}
              type="button"
              className={"intensity-bar" + (active ? " active" : "")}
              data-level={i}
              style={{ height: h + "px" }}
              onClick={() => onChange(i)}
              aria-label={`Level ${i + 1}: ${labels[i]}`}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────── App ───────────────────────────
function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [mode, setMode] = React.useState("booth");
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState("");
  const [isWorking, setIsWorking] = React.useState(false);
  const [maryMood, setMaryMood] = React.useState("idle");
  const scrollRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const idRef = React.useRef(0);
  const nid = () => ++idRef.current;

  const M = MODES[mode];

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  React.useEffect(() => {
    if (inputRef.current && !isWorking) inputRef.current.focus();
  }, [isWorking, mode]);

  const switchMode = (next) => {
    if (next === mode || isWorking) return;
    setMode(next);
    setMessages([]);
    setInput("");
  };

  const submit = async () => {
    const text = input.trim();
    if (!text || isWorking) return;

    setInput("");
    setIsWorking(true);
    setMaryMood("thinking");

    const userMsg = { id: nid(), role: "user", text };
    const personaKeys = M.personas;
    const copyable = mode === "generator";
    const firstId = nid();
    setMessages((m) => [
      ...m,
      userMsg,
      { id: firstId, role: "persona", personaKey: personaKeys[0], text: "", typing: true, copyable },
    ]);

    const responses = mode === "booth"
      ? await getThreeResponses(text, tweaks.grandmaIntensity)
      : await getLaunderedExcuses(text, tweaks.unhingedLevel);

    const revealDelays = [900, 1700, 1500];
    const ids = [firstId, nid(), nid()];

    for (let i = 0; i < 3; i++) {
      if (i > 0) {
        await sleep(500);
        setMessages((m) => [
          ...m,
          { id: ids[i], role: "persona", personaKey: personaKeys[i], text: "", typing: true, copyable },
        ]);
      }
      await sleep(revealDelays[i]);
      const key = personaKeys[i];
      setMessages((m) =>
        m.map((x) => (x.id === ids[i] ? { ...x, text: responses[key], typing: false } : x))
      );
      if (i === 0) setMaryMood("speaking");
    }

    setMaryMood("wink");
    setTimeout(() => setMaryMood("idle"), 1500);
    setIsWorking(false);
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className={`app mode-${mode}`}>
      <header className="topbar">
        <button
          type="button"
          className={"brand-toggle" + (isWorking ? " working" : "")}
          onClick={() => switchMode(mode === "booth" ? "generator" : "booth")}
          disabled={isWorking}
          aria-label="Flip between Mary and Demon"
        >
          <div className="brand-flipper" data-mode={mode}>
            <div className="flip-face flip-front"><Mary size={56} /></div>
            <div className="flip-face flip-back"><Demon size={56} /></div>
          </div>
          <div className="brand-text">
            <div className="brand-name">{M.brandName}</div>
            <div className="brand-tag">{M.brandTag}</div>
          </div>
          <div className="brand-hint">{M.subtitle}</div>
        </button>
      </header>

      <main className="chat" ref={scrollRef}>
        {isEmpty ? (
          <div className="empty">
            <div className="empty-mascot">
              {mode === "booth"
                ? <Mary size={180} mood="idle" listening />
                : <Demon size={180} mood="idle" listening />}
            </div>
            <h1 className="empty-title">{M.emptyTitle}</h1>
            <p className="empty-sub">{M.emptySub}</p>
            <div className="chips">
              {M.chips.map((c) => (
                <button key={c} className="chip" onClick={() => setInput(c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="stream">
            {messages.map((m) =>
              m.role === "user"
                ? <UserBubble key={m.id} text={m.text} />
                : <PersonaBubble key={m.id} personaKey={m.personaKey}
                                 text={m.text} typing={m.typing}
                                 copyable={m.copyable} />
            )}
          </div>
        )}
      </main>

      <div className="intensity-row">
        {mode === "booth" ? (
          <IntensityBars
            value={tweaks.grandmaIntensity}
            onChange={(v) => setTweak("grandmaIntensity", v)}
            labels={INTENSITY_LABELS}
            variant="booth"
          />
        ) : (
          <IntensityBars
            value={tweaks.unhingedLevel}
            onChange={(v) => setTweak("unhingedLevel", v)}
            labels={UNHINGED_LABELS}
            variant="generator"
          />
        )}
      </div>

      <form className="composer" onSubmit={(e) => { e.preventDefault(); submit(); }}>
        <div className="composer-inner">
          <textarea
            ref={inputRef}
            className="input"
            placeholder={isEmpty ? M.placeholder : M.placeholderAgain}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            rows={1}
            disabled={isWorking}
          />
          <button
            type="submit"
            className="send"
            disabled={!input.trim() || isWorking}
          >
            {isWorking ? (
              <span className="send-working">
                <span className="dot-spin" /> {M.workingLabel}
              </span>
            ) : (
              <>{M.sendLabel} <span className="send-arrow">→</span></>
            )}
          </button>
        </div>
        <div className="composer-hint">
          Enter to send · Shift+Enter for a new line
        </div>
      </form>
    </div>
  );
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
