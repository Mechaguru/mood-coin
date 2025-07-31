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
  return new Date().toISOString().split("T")[0]; // e.g., "2025-08-01"
}

function getGradient(tone) {
  switch (tone) {
    case "Calm": return "linear-gradient(to bottom, #a3cce9, #f0f6fb)";
    case "Motivational": return "linear-gradient(to bottom, #ffe9a3, #fffbe0)";
    default: return "#ffffff";
  }
}

function showQuote(entry, scanIndex) {
  const container = document.getElementById('quoteBox');
  const quote = entry.quotes[scanIndex % 3];
  container.innerHTML = `<div class='quote'>${quote}</div>`;
  document.body.style.background = getGradient(entry.tone);
}

fetch(`quotes/quotes-${mood}-${version}.json`)
  .then(res => res.json())
  .then(data => {
    let userData = JSON.parse(localStorage.getItem(QUOTE_KEY));

    // First-time visit
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

    // New day? Advance quote day, reset scan count
    if (userData.lastSeenDate !== today) {
      userData.dayNumber = Math.min(userData.dayNumber + 1, 365);
      userData.scanCountToday = 0;
      userData.lastSeenDate = today;
    }

    const entry = data.find(q => q.day === userData.dayNumber);
    if (!entry) return;

    const quoteIndex = userData.scanCountToday % 3;
    showQuote(entry, quoteIndex);

    // Update scan count for today
    userData.scanCountToday += 1;
    localStorage.setItem(QUOTE_KEY, JSON.stringify(userData));
  });
