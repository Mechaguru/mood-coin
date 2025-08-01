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
    "You deserve the same love you give others.",
    "Take it slow — you're safe here.",
    "Let yourself feel. It's part of healing.",
    "Small steps forward still matter."
  ],
  "Exploding": [
    "Slow down. You’ve got this.",
    "Not everything needs fixing right now.",
    "Step back and breathe.",
    "One thing at a time is enough.",
    "You’re not broken — just overloaded."
  ],
  "Overloaded": [
    "One step at a time is still progress.",
    "You’re doing more than you know.",
    "Pause. Reset. Continue.",
    "Let go of perfect — aim for done.",
    "No one expects you to carry it all."
  ],
  "Melting": [
    "It’s okay to pause. You’ll find your shape.",
    "You don’t have to hold it all together.",
    "Let things soften — including you.",
    "You’re not disappearing. Just adjusting.",
    "This isn’t the end — just a dip."
  ],
  "Stressed": [
    "Even pressure makes diamonds.",
    "Stress is a signal — not your identity.",
    "You're allowed to rest.",
    "It’s okay to not be okay.",
    "Progress, not perfection."
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

function fadeReplace(selector, newContent) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.style.opacity = 0;
  setTimeout(() => {
    el.textContent = newContent;
    el.style.opacity = 1;
  }, 500);
}

function showQuote(entry, scanIndex, dayNum, isTemporary = false) {
  const container = document.getElementById('quoteBox');
  const storedEmoji = localStorage.getItem(EMOJI_KEY) || "";
  const storedLabel = localStorage.getItem(EMOJI_LABEL_KEY) || mood.charAt(0).toUpperCase() + mood.slice(1);
  const isSelfFeeling = storedLabel === "Feeling like myself";

  let quote = "Take a deep breath. You’re doing okay.";
  if (isSelfFeeling) {
    const affirmations = encouragementMap["Feeling like myself"];
    quote = affirmations[Math.floor(Math.random() * affirmations.length)];
  } else {
    let rawQuote = entry.quotes[scanIndex % 3];
    if (typeof rawQuote === 'object') rawQuote = rawQuote.text;
    if (rawQuote && rawQuote.length >= 25) quote = rawQuote;
  }

  const lastLabel = (!isSelfFeeling && storedLabel !== "") ? `Last selected: ${storedEmoji} ${storedLabel}` : "";

  const html = `
    <div class='close-button' onclick='closePage()'>×</div>
    <div class='emotion-label-container'>
      <div class='emotion-label'>${storedLabel}</div>
    </div>
    <div class='quote-box mood-${mood}'>
      <div class='quote-text'>${quote} ${isSelfFeeling ? '' : storedEmoji}</div>
    </div>
    <div class='progress'>Day ${dayNum} of 365 | Quote ${scanIndex + 1} of 3</div>
    <div class='emoji-picker-wrapper'>
      <div class='emoji-prompt'>Which emoji best describes how you're feeling today?</div>
      ${lastLabel ? `<div class='emoji-last'>${lastLabel}</div>` : ''}
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

  setTimeout(() => fadeReplace(".emotion-label", quote), 4000);

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

      const encouragements = encouragementMap[label];
      const tempQuote = Array.isArray(encouragements) ? encouragements[Math.floor(Math.random() * encouragements.length)] : encouragements;
      fadeReplace(".quote-text", tempQuote);

      setTimeout(() => {
        const entry = JSON.parse(localStorage.getItem(QUOTE_KEY));
        const today = getTodayDateString();
        const currentDay = entry?.dayNumber || 1;
        const index = (entry?.scanCountToday || 1) % 3;
        fetch(`quotes/quotes-${mood}-${version}.json`)
          .then(res => res.json())
          .then(data => {
            const todayQuote = data.find(q => q.day === currentDay)?.quotes[index];
            fadeReplace(".quote-text", todayQuote);
          });
      }, 5000);
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
