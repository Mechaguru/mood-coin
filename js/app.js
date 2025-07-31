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

function applyGradient(tone) {
  const body = document.body;
  body.className = ""; // Clear previous

  switch (tone) {
    case "Calm":        body.classList.add("bg-calm"); break;
    case "Motivational":body.classList.add("bg-motivational"); break;
    case "Soothing":    body.classList.add("bg-soothing"); break;
    case "Reflective":  body.classList.add("bg-reflective"); break;
    case "Hopeful":     body.classList.add("bg-hopeful"); break;
    default:             body.classList.add("bg-neutral");
  }
}

function showQuote(entry, scanIndex) {
  const container = document.getElementById('quoteBox');
  const quote = entry.quotes[scanIndex % 3];
  container.innerHTML = `<div class='quote'>${quote}</div>`;
  applyGradient(entry.tone);
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
