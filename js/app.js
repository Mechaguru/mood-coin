// Mood Coin App Logic – Overwhelmed Coin Setup
const mood = "overwhelmed";
const version = "v1";
const QUOTE_KEY = `moodcoin_${mood}_version_${version}`;
const EMOJI_KEY = `moodcoin_emoji_${mood}`;

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

function showQuote(entry, scanIndex, dayNum) {
  const container = document.getElementById('quoteBox');
  let quote = entry.quotes[scanIndex % 3];
  if (typeof quote === 'object') quote = quote.text;
  if (!quote || quote.length < 20) {
    quote = "Take a deep breath. You’re doing okay.";
  }

  const storedEmoji = localStorage.getItem(EMOJI_KEY) || "";

  const html = `
    <div class='emotion-label'>${mood.charAt(0).toUpperCase() + mood.slice(1)}</div>
    <div class='quote-box mood-${mood}'>
      <div class='quote-text'>${quote} ${storedEmoji}</div>
    </div>
    <div class='progress'>Day ${dayNum} of 365 | Quote ${scanIndex + 1} of 3</div>
    <div class='emoji-picker'>
      <span>Select your vibe:</span>
      ${["😊", "😌", "🌿", "💙", "🫂"].map((emoji, idx) => `
        <input type='radio' name='emoji' id='emoji${idx}' value='${emoji}' ${storedEmoji === emoji ? "checked" : ""}>
        <label for='emoji${idx}'>${emoji}</label>
      `).join('')}
    </div>
  `;
  container.innerHTML = html;
  applyRandomGradient();
  playAudio();

  document.querySelectorAll(".emoji-picker input").forEach(input => {
    input.addEventListener("change", e => {
      localStorage.setItem(EMOJI_KEY, e.target.value);
      showQuote(entry, scanIndex, dayNum); // refresh with selected emoji
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
