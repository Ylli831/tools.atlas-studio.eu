"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const CHARS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

const AMBIGUOUS = "O0Il1";

// Common English words for passphrase generation (EFF-inspired short list)
const WORDS = [
  "acid", "acme", "aged", "also", "area", "army", "away", "back", "bail", "band",
  "bank", "barn", "base", "bath", "bear", "beat", "been", "bell", "belt", "bend",
  "best", "bike", "bird", "bite", "blow", "blue", "blur", "boat", "body", "bold",
  "bolt", "bomb", "bond", "bone", "book", "boot", "bore", "born", "boss", "both",
  "bowl", "bulk", "burn", "bush", "busy", "cafe", "cage", "cake", "calm", "came",
  "camp", "cape", "card", "care", "cart", "case", "cash", "cast", "cave", "cell",
  "chef", "chin", "chip", "city", "clad", "clan", "clay", "clip", "club", "clue",
  "coat", "code", "coil", "coin", "cold", "come", "cook", "cool", "cope", "copy",
  "cord", "core", "corn", "cost", "coup", "crop", "crow", "cure", "curl", "cute",
  "dado", "dale", "damn", "damp", "dare", "dark", "dart", "dash", "data", "date",
  "dawn", "days", "dead", "deaf", "deal", "dean", "dear", "debt", "deck", "deed",
  "deem", "deep", "deer", "demo", "deny", "desk", "dial", "dice", "diet", "dirt",
  "dish", "disk", "dock", "does", "dome", "done", "doom", "door", "dose", "down",
  "drag", "draw", "drop", "drum", "dual", "duke", "dull", "dumb", "dump", "dune",
  "dust", "duty", "each", "earn", "ease", "east", "easy", "echo", "edge", "edit",
  "else", "emit", "epic", "euro", "even", "ever", "evil", "exam", "exit", "eyes",
  "face", "fact", "fade", "fail", "fair", "fake", "fall", "fame", "fang", "fare",
  "farm", "fast", "fate", "fear", "feat", "feed", "feel", "feet", "fell", "felt",
  "file", "fill", "film", "find", "fine", "fire", "firm", "fish", "fist", "five",
  "flag", "flat", "fled", "flew", "flip", "flow", "foam", "fold", "folk", "fond",
  "font", "food", "fool", "foot", "ford", "fore", "fork", "form", "fort", "foul",
  "four", "free", "frog", "from", "fuel", "full", "fund", "fury", "fuse", "gain",
  "gala", "gale", "game", "gang", "garb", "gave", "gaze", "gear", "gene", "gift",
  "girl", "give", "glad", "glow", "glue", "goat", "goes", "gold", "golf", "gone",
  "good", "grab", "gray", "grew", "grid", "grim", "grin", "grip", "grow", "gulf",
  "guru", "gust", "hack", "half", "hall", "halt", "hand", "hang", "hard", "harm",
  "harp", "hash", "hate", "haul", "have", "hawk", "haze", "head", "heal", "heap",
  "hear", "heat", "heel", "held", "help", "herb", "herd", "here", "hero", "hide",
  "high", "hike", "hill", "hint", "hire", "hold", "hole", "holy", "home", "hood",
  "hook", "hope", "horn", "host", "hour", "huge", "hull", "hung", "hunt", "hurt",
  "icon", "idea", "inch", "info", "into", "iron", "isle", "item", "jade", "jail",
  "jazz", "jean", "jest", "jobs", "join", "joke", "jump", "june", "jury", "just",
  "keen", "keep", "kept", "keys", "kick", "kids", "kill", "kind", "king", "kiss",
  "kite", "knee", "knew", "knit", "knob", "knot", "know", "lace", "lack", "laid",
  "lake", "lamp", "land", "lane", "last", "late", "lawn", "lead", "leaf", "lean",
  "leap", "left", "lend", "lens", "less", "lied", "life", "lift", "like", "limb",
  "lime", "limp", "line", "link", "lion", "list", "live", "load", "loan", "lock",
  "logo", "lone", "long", "look", "lord", "lose", "loss", "lost", "loud", "love",
  "luck", "lump", "lung", "lure", "lurk", "made", "mail", "main", "make", "male",
  "mall", "malt", "many", "maps", "mare", "mark", "mask", "mass", "mast", "mate",
  "maze", "meal", "mean", "meat", "meet", "melt", "memo", "menu", "mere", "mesh",
  "mild", "mile", "milk", "mill", "mind", "mine", "mint", "miss", "mode", "mold",
  "mood", "moon", "more", "moss", "most", "move", "much", "must", "myth", "nail",
  "name", "navy", "near", "neat", "neck", "need", "nest", "nets", "news", "next",
  "nice", "nine", "node", "none", "norm", "nose", "note", "noun", "odds", "okay",
  "once", "only", "onto", "open", "oral", "oven", "over", "owed", "pace", "pack",
  "page", "paid", "pain", "pair", "pale", "palm", "pane", "pant", "park", "part",
  "pass", "past", "path", "peak", "peel", "peer", "pine", "pink", "pipe", "plan",
  "play", "plea", "plot", "plug", "plus", "poem", "poet", "pole", "poll", "polo",
  "pond", "pool", "poor", "pope", "pork", "port", "pose", "post", "pour", "pray",
  "prey", "prop", "pull", "pulp", "pump", "pure", "push", "quit", "quiz", "race",
  "rack", "rage", "raid", "rail", "rain", "rank", "rare", "rate", "rays", "read",
  "real", "rear", "reef", "rein", "rely", "rent", "rest", "rice", "rich", "ride",
  "ring", "rise", "risk", "road", "roam", "rock", "rode", "role", "roll", "roof",
  "room", "root", "rope", "rose", "ruin", "rule", "rush", "rust", "safe", "sage",
  "said", "sail", "sake", "sale", "salt", "same", "sand", "sang", "save", "seal",
  "seat", "seed", "seek", "seem", "seen", "self", "sell", "send", "sept", "shed",
  "ship", "shop", "shot", "show", "shut", "sick", "side", "sigh", "sign", "silk",
  "sink", "site", "size", "skin", "slim", "slip", "slot", "slow", "snap", "snow",
  "soak", "sock", "soft", "soil", "sold", "sole", "some", "song", "soon", "sort",
  "soul", "span", "spin", "spot", "star", "stay", "stem", "step", "stew", "stir",
  "stop", "such", "suit", "sure", "surf", "swap", "swim", "tail", "take", "tale",
  "talk", "tall", "tank", "tape", "task", "taxi", "team", "tear", "teen", "tell",
  "tend", "tent", "term", "test", "text", "than", "that", "them", "then", "thin",
  "this", "thus", "tick", "tide", "tidy", "tied", "tier", "tile", "till", "time",
  "tiny", "tire", "toad", "toll", "tomb", "tone", "took", "tool", "tops", "tore",
  "torn", "tour", "town", "trap", "tree", "trim", "trio", "trip", "true", "tube",
  "tuck", "tune", "turn", "twin", "type", "ugly", "undo", "unit", "upon", "urge",
  "used", "user", "vain", "vale", "van", "vary", "vast", "veil", "vent", "verb",
  "very", "vest", "vibe", "view", "vine", "visa", "void", "volt", "vote", "wade",
  "wage", "wait", "wake", "walk", "wall", "wand", "want", "ward", "warm", "warn",
  "warp", "wash", "vast", "wave", "weak", "wear", "weed", "week", "well", "went",
  "were", "west", "what", "when", "whom", "wide", "wife", "wild", "will", "wind",
  "wine", "wing", "wire", "wise", "wish", "with", "woke", "wolf", "wood", "wool",
  "word", "wore", "work", "worm", "worn", "wrap", "yard", "yarn", "year", "yell",
  "your", "zeal", "zero", "zinc", "zone", "zoom",
];

const SEPARATORS = ["-", ".", "_", " ", "/"];

function getStrength(
  length: number,
  charsetSize: number
): "weak" | "fair" | "strong" | "very_strong" {
  const entropy = length * Math.log2(charsetSize || 1);
  if (entropy < 36) return "weak";
  if (entropy < 60) return "fair";
  if (entropy < 80) return "strong";
  return "very_strong";
}

function getPassphraseStrength(
  wordCount: number
): "weak" | "fair" | "strong" | "very_strong" {
  // ~10.5 bits per word from our ~800-word list
  const entropy = wordCount * Math.log2(WORDS.length);
  if (entropy < 36) return "weak";
  if (entropy < 60) return "fair";
  if (entropy < 80) return "strong";
  return "very_strong";
}

const STRENGTH_COLORS: Record<string, string> = {
  weak: "bg-red-400",
  fair: "bg-yellow-400",
  strong: "bg-teal",
  very_strong: "bg-green-500",
};

export default function PasswordGeneratorTool() {
  const t = useTranslations("tools.password-generator");
  const [mode, setMode] = useState<"password" | "passphrase">("password");

  // Password options
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);

  // Passphrase options
  const [wordCount, setWordCount] = useState(5);
  const [separator, setSeparator] = useState("-");
  const [capitalize, setCapitalize] = useState(false);
  const [addNumber, setAddNumber] = useState(false);

  // Shared
  const [quantity, setQuantity] = useState(1);
  const [passwords, setPasswords] = useState<string[]>([]);

  const generatePassword = useCallback(() => {
    let charset = "";
    if (uppercase) charset += CHARS.uppercase;
    if (lowercase) charset += CHARS.lowercase;
    if (numbers) charset += CHARS.numbers;
    if (symbols) charset += CHARS.symbols;
    if (!charset) charset = CHARS.lowercase;

    if (excludeAmbiguous) {
      charset = charset
        .split("")
        .filter((c) => !AMBIGUOUS.includes(c))
        .join("");
    }

    const results: string[] = [];
    const arr = new Uint32Array(length);
    for (let i = 0; i < quantity; i++) {
      crypto.getRandomValues(arr);
      let pw = "";
      for (let j = 0; j < length; j++) {
        pw += charset[arr[j] % charset.length];
      }
      results.push(pw);
    }
    return results;
  }, [length, uppercase, lowercase, numbers, symbols, excludeAmbiguous, quantity]);

  const generatePassphrase = useCallback(() => {
    const results: string[] = [];
    for (let i = 0; i < quantity; i++) {
      const arr = new Uint32Array(wordCount);
      crypto.getRandomValues(arr);
      let words = Array.from(arr).map((n) => WORDS[n % WORDS.length]);
      if (capitalize) {
        words = words.map((w) => w.charAt(0).toUpperCase() + w.slice(1));
      }
      let phrase = words.join(separator);
      if (addNumber) {
        const numArr = new Uint32Array(1);
        crypto.getRandomValues(numArr);
        phrase += separator + (numArr[0] % 1000);
      }
      results.push(phrase);
    }
    return results;
  }, [wordCount, separator, capitalize, addNumber, quantity]);

  const generate = useCallback(() => {
    setPasswords(mode === "password" ? generatePassword() : generatePassphrase());
  }, [mode, generatePassword, generatePassphrase]);

  const charsetSize =
    (uppercase ? 26 : 0) +
    (lowercase ? 26 : 0) +
    (numbers ? 10 : 0) +
    (symbols ? CHARS.symbols.length : 0) -
    (excludeAmbiguous ? AMBIGUOUS.length : 0);

  const strength = mode === "password"
    ? getStrength(length, charsetSize)
    : getPassphraseStrength(wordCount + (addNumber ? 1 : 0));

  return (
    <ToolLayout toolSlug="password-generator">
      <div className="space-y-6">
        {/* Mode toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => { setMode("password"); setPasswords([]); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "password" ? "bg-teal text-white" : "bg-surface text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("mode_password")}
          </button>
          <button
            onClick={() => { setMode("passphrase"); setPasswords([]); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "passphrase" ? "bg-teal text-white" : "bg-surface text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("mode_passphrase")}
          </button>
        </div>

        {mode === "password" ? (
          <>
            {/* Length slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-foreground">
                  {t("length")}
                </label>
                <span className="text-sm font-mono text-teal">{length}</span>
              </div>
              <input
                type="range"
                min={4}
                max={128}
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full accent-teal"
              />
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { key: "uppercase", val: uppercase, set: setUppercase },
                { key: "lowercase", val: lowercase, set: setLowercase },
                { key: "numbers", val: numbers, set: setNumbers },
                { key: "symbols", val: symbols, set: setSymbols },
                { key: "exclude_ambiguous", val: excludeAmbiguous, set: setExcludeAmbiguous },
              ].map(({ key, val, set }) => (
                <label
                  key={key}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <input
                    type="checkbox"
                    checked={val}
                    onChange={(e) => set(e.target.checked)}
                    className="rounded border-border accent-teal"
                  />
                  {t(key)}
                </label>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Word count slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-foreground">
                  {t("word_count")}
                </label>
                <span className="text-sm font-mono text-teal">{wordCount}</span>
              </div>
              <input
                type="range"
                min={3}
                max={10}
                value={wordCount}
                onChange={(e) => setWordCount(Number(e.target.value))}
                className="w-full accent-teal"
              />
            </div>

            {/* Separator */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {t("separator")}
              </label>
              <div className="flex gap-2">
                {SEPARATORS.map((sep) => (
                  <button
                    key={sep}
                    onClick={() => setSeparator(sep)}
                    className={`w-10 h-10 rounded-lg border text-sm font-mono transition-colors ${
                      separator === sep
                        ? "bg-teal text-white border-teal"
                        : "bg-card border-border hover:border-teal"
                    }`}
                  >
                    {sep === " " ? "␣" : sep}
                  </button>
                ))}
              </div>
            </div>

            {/* Passphrase options */}
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={capitalize}
                  onChange={(e) => setCapitalize(e.target.checked)}
                  className="rounded border-border accent-teal"
                />
                {t("capitalize_words")}
              </label>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={addNumber}
                  onChange={(e) => setAddNumber(e.target.checked)}
                  className="rounded border-border accent-teal"
                />
                {t("add_number")}
              </label>
            </div>
          </>
        )}

        {/* Quantity + Generate */}
        <div className="flex items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t("quantity")}
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, Math.min(20, Number(e.target.value))))
              }
              className="w-24 bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
            />
          </div>
          <button
            onClick={generate}
            className="bg-teal text-white font-medium px-6 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm"
          >
            {t("generate")}
          </button>
        </div>

        {/* Strength meter */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-muted-foreground">{t("strength")}</span>
            <span className="text-xs font-medium text-foreground">
              {t(strength)}
            </span>
          </div>
          <div className="h-2 bg-surface rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${STRENGTH_COLORS[strength]}`}
              style={{
                width: `${strength === "weak" ? 25 : strength === "fair" ? 50 : strength === "strong" ? 75 : 100}%`,
              }}
            />
          </div>
        </div>

        {/* Output */}
        {passwords.length > 0 && (
          <div className="space-y-2">
            {passwords.map((pw, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-card border border-border rounded-lg p-3"
              >
                <code className="flex-1 text-sm font-mono break-all select-all">
                  {pw}
                </code>
                <CopyButton text={pw} />
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
