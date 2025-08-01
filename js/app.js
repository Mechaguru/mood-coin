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
  "Stressed": [
    "Even pressure makes diamonds.",
    "You’ve overcome this feeling before.",
    "Step back. You deserve peace too.",
    "Pause. Regroup. Restart.",
    "You’ve made it through worse.",
    "Stress means you care. Refocus.",
    "Every storm passes.",
    "You’re not failing. You’re adapting.",
    "This feeling isn’t forever.",
    "One task at a time."
  ],
  "Melting": [
    "It’s okay to pause. You’ll reshape.",
    "Melt today, rebuild tomorrow.",
    "Soft doesn’t mean broken.",
    "You’re still whole. Just resting.",
    "Slow is strong too.",
    "Let yourself feel. Then reset.",
    "Your mind needs softness.",
    "Stillness is growth, too.",
    "You’re human. That’s enough.",
    "Gentle is powerful."
  ],
  "Overloaded": [
    "One step at a time is still progress.",
    "It’s okay not to do it all.",
    "You can pause without guilt.",
    "Simplify. Release one thing.",
    "You’re not meant to carry it all.",
    "Overwhelm is a signal to rest.",
    "You’re doing enough.",
    "Give yourself permission to stop.",
    "You’ve earned rest.",
    "Nothing wrong with slowing down."
  ],
  "Exploding": [
    "Let it out safely. Breathe back in.",
    "You’re not breaking, you’re releasing.",
    "This isn’t the end. It’s a release.",
    "Storms cleanse. So do tears.",
    "Find stillness after the bang.",
    "Energy is powerful. Use it gently.",
    "You’re still in control.",
    "Let the heat pass.",
    "There’s peace on the other side.",
    "You’re more than this surge."
  ],
  "Needs comfort": [
    "Be kind to yourself. You’re not alone.",
    "Ask for a hug—even from yourself.",
    "You’re not a burden.",
    "You matter, even on bad days.",
    "Gentle words heal fast.",
    "You are loved, even now.",
    "Take what you need.",
    "Comfort isn’t weakness. It’s wise.",
    "Wrap yourself in kindness.",
    "Soft moments are sacred."
  ],
  "Feeling like myself": [
    "You're showing up for yourself. Keep going.",
    "You’ve made progress — own it.",
    "Welcome back. You’re doing great.",
    "You’ve overcome the hardest part already.",
    "This calm is well-earned.",
    "Feel that? That’s resilience.",
    "Hold on to that strength.",
    "This moment is proof.",
    "Let that clarity guide you.",
    "Keep rising. You’re ready."
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

function fadeReplaceQuote(newText, emoji) {
  const quoteText = document.querySelector(".quote-text");
  if (!quoteText) return;
  quoteText.style.opacity = 0;
  setTimeout(() => {
    quoteText.textContent = `${newText} ${emoji || ""}`;
    quoteText.style.opacity = 1;
  }, 300);
}

function showQuote(entry, scanIndex, dayNum) {
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

  const html = `
    <div class='close-button' onclick='closePage()'>×</div>
    <div class='emotion-label-container'>
      <div class='emotion-label' id='emotionLabel'>${storedLabel}</div>
    </div>
    <div class='quote-box mood-${mood}'>
      <div class='quote-text' id='quoteText'>${quote} ${isSelfFeeling ? '' : storedEmoji}</div>
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

  setTimeout(() => fadeReplaceQuote(quote, isSelfFeeling ? '' : storedEmoji), 4000);

  document.querySelectorAll(".emoji-picker input").forEach(input => {
    input.addEventListener("change", e => {
      const selected = e.target.value;
      const label = emojiMap[selected] || mood;
      const messages = encouragementMap[label] || [];
      const newMessage = messages[Math.floor(Math.random() * messages.length)];

      fadeReplaceQuote(newMessage, selected);

      setTimeout(() => fadeReplaceQuote(quote, selected), 4500);

      if (label === "Feeling like myself") {
        localStorage.removeItem(EMOJI_KEY);
        localStorage.removeItem(EMOJI_LABEL_KEY);
      } else {
        localStorage.setItem(EMOJI_KEY, selected);
        localStorage.setItem(EMOJI_LABEL_KEY, label);
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
