// Mood Coin App Logic – Overwhelmed Coin Setup
const mood = "overwhelmed";
const version = "v1";
const QUOTE_KEY = `moodcoin_${mood}_version_${version}`;
const EMOJI_KEY = `moodcoin_emoji_${mood}`;
const EMOJI_LABEL_KEY = `moodcoin_emoji_label_${mood}`;

const emojiMap = {
  "😰": "Stressed",
  "🫠": "Melting",
  "😵": "Overloaded",
  "🤯": "Exploding",
  "🫂": "Needs comfort",
  "🧘": "Feeling like myself"
};

const encouragementMap = {
  "Feeling like myself": [
    "You're showing up for yourself. Keep going.",
    "You’ve made progress — own it.",
    "Welcome back. You’re doing great.",
    "You’ve overcome the hardest part already.",
    "This calm is well-earned."
  ],
  "Needs comfort": [
    "Be kind to yourself. You’re not alone.",
    "You’re held, even when it feels like you’re not.",
    "Gentleness is strength in disguise.",
    "You're not invisible. You matter.",
    "Let someone in — you're worth the care.",
    "This weight will ease in time.",
    "You’ve made it this far. Keep going.",
    "The world is better with you in it.",
    "Take a break, not a breakdown.",
    "Being here is enough."
  ],
  "Exploding": [
    "Slow down. You’ve got this.",
    "You can pause and still make progress.",
    "Even chaos can lead to clarity.",
    "Let it out, then let it pass.",
    "Storms don’t last forever.",
    "You’re not broken. You’re overloaded.",
    "It’s okay to step back.",
    "You’re still in control.",
    "This doesn’t define you.",
    "Powerful minds need room to breathe."
  ],
  "Overloaded": [
    "One step at a time is still progress.",
    "You’re allowed to log off.",
    "You can’t do it all — and that’s okay.",
    "Breathe. Then just do the next thing.",
    "You’re not weak for feeling this.",
    "Slow progress is still progress.",
    "Choose rest, not burnout.",
    "Clarity comes after pause.",
    "You’re enough, even without the output.",
    "There’s power in slowing down."
  ],
  "Melting": [
    "It’s okay to pause. You’ll find your shape.",
    "Dissolving doesn’t mean disappearing.",
    "You’re not falling apart — you’re softening.",
    "You’ll re-form stronger.",
    "Feelings fade. Strength stays.",
    "Every phase passes.",
    "This is temporary.",
    "Let the moment melt — not you.",
    "The sun is coming. Keep still.",
    "You’re allowed to not hold it all together."
  ],
  "Stressed": [
    "Even pressure makes diamonds.",
    "Stress is a signal, not a sentence.",
    "You can exhale. It's safe now.",
    "You’ve done hard things before.",
    "Not everything must be perfect.",
    "You’re capable — even when tense.",
    "Tension passes. Strength stays.",
    "You’re not alone in this.",
    "Pause. Re-centre. Begin again.",
    "Stress means you care. Just don’t carry it all."
  ]
};

function getDayNumber(startDate) {
  const now = new Date();
  const start = new Date(startDate);
  const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  return Math.min(diff + 1, 365);
}

function getTodayDateString() {
  return new Date().toISOString().split("T")[0];
}

function applyRandomGradient() {
  const body = document.body;
  body.className = "animated-bg";
  const hour = new Date().getHours();
  const isNight = hour >= 22 || hour < 6;

  const gradients = [
    "linear-gradient(135deg, #a3cce9, #f0f6fb)",
    "linear-gradient(135deg, #ffe9a3, #fffbe0)",
    "linear-gradient(135deg, #f8c6c6, #ffeaea)",
    "linear-gradient(135deg, #d5d5ff, #f5f5ff)",
    "linear-gradient(135deg, #d2e8d2, #f3fbf3)"
  ];

  const nightGradient = "linear-gradient(135deg, #1e1e2f, #3a3a5a)";
  const gradient = isNight ? nightGradient : gradients[Math.floor(Math.random() * gradients.length)];

  if (isNight) {
    body.classList.add("dark-mode");
  } else {
    body.classList.remove("dark-mode");
  }
  body.style.setProperty('--bg-gradient', gradient);
}

function playAudio() {
  const audio = new Audio(`audio/${mood}.mp3`);
  audio.volume = 0.4;
  audio.play().catch(() => {});
}

function closePage() {
  window.close();
  setTimeout(() => window.history.back(), 300);
}

function fadeReplaceText(element, newText, callback) {
  element.classList.add("fade-out");
  setTimeout(() => {
    element.innerText = newText;
    element.classList.remove("fade-out");
    element.classList.add("fade-in");
    setTimeout(() => {
      element.classList.remove("fade-in");
      if (callback) callback();
    }, 400);
  }, 500);
}

function showQuote(entry, scanIndex, dayNum) {
  const container = document.getElementById('quoteBox');
  const storedEmoji = localStorage.getItem(EMOJI_KEY) || "";
  const isSelfFeeling = localStorage.getItem(EMOJI_LABEL_KEY) === "Feeling like myself";

  let quote = entry.quotes[scanIndex % 3]?.text || "Take a deep breath. You’re doing okay.";
  if (isSelfFeeling) {
    const affirmations = encouragementMap["Feeling like myself"];
    quote = affirmations[Math.floor(Math.random() * affirmations.length)];
  }

  const html = `
    <div class='close-button' onclick='closePage()'>×</div>
    <div class='emotion-label-container'>
      <div class='emotion-label'>Overwhelmed</div>
    </div>
    <div class='quote-box mood-${mood}'>
      <div class='quote-text'>${quote}</div>
    </div>
    <div class='progress'>Day ${dayNum} of 365 | Quote ${scanIndex + 1} of 3</div>
    <div class='emoji-picker-wrapper'>
      <div class='emoji-prompt'>Which emoji best describes how you're feeling today?</div>
      <div class='emoji-picker'>
        ${Object.entries(emojiMap).map(([emoji, label], idx) => `
          <div class='emoji-bubble'>
            <input type='radio' name='emoji' id='emoji${idx}' value='${emoji}' ${storedEmoji === emoji ? "checked" : ""}>
            <label for='emoji${idx}'>${emoji}<div class='emoji-label'>${label}</div></label>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  container.innerHTML = html;
  applyRandomGradient();
  playAudio();

  const labelEl = document.querySelector(".emotion-label");
  if (labelEl) {
    setTimeout(() => {
      fadeReplaceText(labelEl, "Quote of the Day");
    }, 3200);
  }

  document.querySelectorAll(".emoji-picker input").forEach(input => {
    input.addEventListener("change", e => {
      const selected = e.target.value;
      const label = emojiMap[selected] || mood;

      if (label === "Feeling like myself") {
        localStorage.removeItem(EMOJI_KEY);
        localStorage.removeItem(EMOJI_LABEL_KEY);
      } else {
        localStorage.setItem(EMOJI_KEY, selected);
        localStorage.setItem(EMOJI_LABEL_KEY, label);
      }

      const encouragements = encouragementMap[label] || [];
      if (encouragements.length) {
        const quoteEl = document.querySelector(".quote-text");
        if (quoteEl) {
          fadeReplaceText(quoteEl, encouragements[Math.floor(Math.random() * encouragements.length)], () => {
            setTimeout(() => {
              fadeReplaceText(quoteEl, quote);
            }, 4000);
          });
        }
      }
    });
  });
}

fetch(`quotes/quotes-${mood}-${version}.json`)
  .then(res => res.json())
  .then(data => {
    let userData = JSON.parse(localStorage.getItem(QUOTE_KEY));
    if (!userData) {
      userData = {
        startDate: new Date().toISOString(),
        version,
        dayNumber: 1,
        lastSeenDate: getTodayDateString(),
        scanCountToday: 0
      };
    }

    const today = getTodayDateString();
    if (userData.lastSeenDate !== today) {
      userData.dayNumber = Math.min(userData.dayNumber + 1, 365);
      userData.scanCountToday = 0;
      userData.lastSeenDate = today;
    }

    const entry = data.find(q => q.day === userData.dayNumber);
    if (!entry) return;
    const quoteIndex = userData.scanCountToday % 3;
    showQuote(entry, quoteIndex, userData.dayNumber);
    userData.scanCountToday += 1;
    localStorage.setItem(QUOTE_KEY, JSON.stringify(userData));
  });
