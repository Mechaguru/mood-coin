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

function applyAnimatedGradient(tone) {
  const body = document.body;
  body.className = "animated-bg"; // base class

  const hour = new Date().getHours();
  const isNight = hour >= 22 || hour < 6;

  let gradient;
  if (isNight) {
    gradient = "linear-gradient(135deg, #1e1e2f, #3a3a5a)";
    body.classList.add("dark-mode");
  } else {
    switch (tone) {
      case "Calm": gradient = "linear-gradient(135deg, #a3cce9, #f0f6fb)"; break;
      case "Motivational": gradient = "linear-gradient(135deg, #ffe9a3, #fffbe0)"; break;
      case "Soothing": gradient = "linear-gradient(135deg, #f8c6c6, #ffeaea)"; break;
      case "Reflective": gradient = "linear-gradient(135deg, #d5d5ff, #f5f5ff)"; break;
      case "Hopeful": gradient = "linear-gradient(135deg, #d2e8d2, #f3fbf3)"; break;
      default: gradient = "linear-gradient(135deg, #eaeaea, #ffffff)";
    }
    body.classList.remove("dark-mode");
  }

  body.style.setProperty('--bg-gradient', gradient);
}

function showQuote(entry, scanIndex) {
  const container = document.getElementById('quoteBox');
  let quote = entry.quotes[scanIndex % 3];
  if (quote.length < 20) quote = "Take a deep breath. You’re doing okay.";

  container.innerHTML = `<div class='quote-box'><div class='quote-text'>${quote}</div></div>`;
  applyAnimatedGradient(entry.tone);
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
