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

const encouragementQuotes = {
  "Stressed": [
    "You are more resilient than you realise.",
    "Stress fades; strength remains.",
    "Breathe. This moment will pass.",
    "Even pressure makes diamonds.",
    "You’ve survived every tough day so far.",
    "You can’t pour from an empty cup.",
    "Pause. Collect. Proceed.",
    "It’s okay to step back to recharge.",
    "Stress signals the need for care.",
    "You’re doing your best. That’s enough."
  ],
  "Melting": [
    "It's okay to pause. You’ll find your shape.",
    "Meltdowns are not failures.",
    "Cooling down is part of the process.",
    "Drift gently. Reform on your time.",
    "You are allowed to soften.",
    "Take the shape you need today.",
    "Let yourself decompress.",
    "Melt today, rise tomorrow.",
    "No shame in feeling undone.",
    "This too will settle."
  ],
  "Overloaded": [
    "One task at a time is still progress.",
    "You don’t have to carry it all.",
    "Unload. Regroup. Start fresh.",
    "It’s okay to say ‘not now’.",
    "Boundaries protect peace.",
    "Overload isn’t weakness.",
    "Breaks prevent burnout.",
    "Simplify where you can.",
    "Let go of what's not yours.",
    "You’re not alone in this."
  ],
  "Exploding": [
    "Pressure means passion. Redirect it.",
    "Let your emotions breathe.",
    "Intensity is not instability.",
    "Explosions create space for light.",
    "Energy can be refocused.",
    "Calm follows every burst.",
    "Find stillness within the storm.",
    "You are allowed big feelings.",
    "It’s okay to fall apart briefly.",
    "You’re safe. You’re supported."
  ],
  "Needs comfort": [
    "You deserve softness.",
    "Be kind to yourself. You’re not alone.",
    "You are worthy of love and care.",
    "Gentle is a valid pace.",
    "Hold yourself like a friend.",
    "Comfort is a strength, not a crutch.",
    "Let comfort be your anchor.",
    "You’re surrounded by warmth.",
    "There is safety in stillness.",
    "It's okay to lean on support."
  ],
  "Feeling like myself": [
    "You're showing up for yourself. Keep going.",
    "You’ve made progress — own it.",
    "Welcome back. You’re doing great.",
    "You’ve overcome the hardest part already.",
    "This calm is well-earned."
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

  body.style.setProperty('--bg-gradient', gradient);
  if (isNight) {
    body.classList.add("dark-mode");
  } else {
    body.classList.remove("dark-mode");
  }
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

function showQuote(entry, scanIndex, dayNum) {
  const container = document.getElementById('quoteBox');
  const storedEmoji = localStorage.getItem(EMOJI_KEY);
  const storedLabel = localStorage.getItem(EMOJI_LABEL_KEY);
  const isSelfFeeling = storedLabel === "Feeling like myself";

  let quote = "Take a deep breath. You’re doing okay.";
  if (entry && entry.quotes && entry.quotes[scanIndex % 3]) {
    quote = entry.quotes[scanIndex % 3].text;
  }

  const html = `
    <div class='close-button' onclick='closePage()'>×</div>
    <div class='emotion-label-container'>
      <div class='emotion-label fade' id='emotionLabel'>Overwhelmed</div>
    </div>
    <div class='quote-box mood-${mood}'>
      <div class='quote-text' id='quoteText'>${quote}</div>
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

  setTimeout(() => {
    const label = document.getElementById("emotionLabel");
    if (label) {
      label.classList.add("fade-out");
      setTimeout(() => {
        label.innerText = "Quote of the Day";
        label.classList.remove("fade-out");
      }, 1500);
    }
  }, 2000);

  document.querySelectorAll(".emoji-picker input").forEach(input => {
    input.addEventListener("change", e => {
      const selected = e.target.value;
      const label = emojiMap[selected] || mood;
      const quoteBox = document.getElementById("quoteText");
      let encouragement = "You're doing okay.";

      if (encouragementQuotes[label]) {
        const list = encouragementQuotes[label];
        encouragement = list[Math.floor(Math.random() * list.length)];
      }

      if (label === "Feeling like myself") {
        localStorage.removeItem(EMOJI_KEY);
        localStorage.removeItem(EMOJI_LABEL_KEY);
      } else {
        localStorage.setItem(EMOJI_KEY, selected);
        localStorage.setItem(EMOJI_LABEL_KEY, label);
      }

      if (quoteBox) {
        quoteBox.style.opacity = 0;
        setTimeout(() => {
          quoteBox.innerText = encouragement;
          quoteBox.style.opacity = 1;
          setTimeout(() => {
            quoteBox.style.opacity = 0;
            setTimeout(() => {
              quoteBox.innerText = quote;
              quoteBox.style.opacity = 1;
            }, 500);
          }, 4500);
        }, 500);
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
