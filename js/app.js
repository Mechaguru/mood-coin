// Mood Coin App Logic – One Quote Per Scan, 3 Per Day, Rotate
const mood = "overwhelmed";
const version = "v1";
const QUOTE_KEY = `moodcoin_${mood}_version_${version}`;

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
    "linear-gradient(135deg, #a3cce9, #f0f6fb)", // Calm Blue
    "linear-gradient(135deg, #ffe9a3, #fffbe0)", // Warm Yellow
    "linear-gradient(135deg, #f8c6c6, #ffeaea)", // Soft Pink
    "linear-gradient(135deg, #d5d5ff, #f5f5ff)", // Cool Lilac
    "linear-gradient(135deg, #d2e8d2, #f3fbf3)"  // Light Green
  ];

  const nightGradient = "linear-gradient(135deg, #1e1e2f, #3a3a5a)";

  const gradient = isNight
    ? nightGradient
    : gradients[Math.floor(Math.random() * gradients.length)];

  if (isNight) {
    body.classList.add("dark-mode");
  } else {
    body.classList.remove("dark-mode");
  }

  body.style.setProperty('--bg-gradient', gradient);
}

function showQuote(entry, scanIndex) {
  const container = document.getElementById('quoteBox');
  let quote = entry.quotes[scanIndex % 3];
  if (typeof quote === 'object') quote = quote.text;
  if (!quote || quote.length < 20) {
    quote = "Take a deep breath. You’re doing okay.";
  }

  container.innerHTML = `<div class='quote-box'><div class='quote-text'>${quote}</div></div>`;
  applyRandomGradient();
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
    showQuote(entry, quoteIndex);

    userData.scanCountToday += 1;
    localStorage.setItem(QUOTE_KEY, JSON.stringify(userData));
  });
