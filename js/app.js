const mood = "overwhelmed";
const version = "v1";
const QUOTE_KEY = `moodcoin_${mood}_version_${version}`;

function getDayNumber(startDate) {
  const diff = Math.floor((Date.now() - new Date(startDate)) / (1000 * 60 * 60 * 24));
  return Math.min(diff + 1, 365);
}

function loadQuotesForDay(quotes, dayNum) {
  const entry = quotes.find(q => q.day === dayNum);
  const container = document.getElementById('quoteBox');
  if (!entry) return;
  container.innerHTML = entry.quotes.map(q => `<div class='quote'>${q}</div>`).join('');
  document.body.style.background = getGradient(entry.tone);
}

function getGradient(tone) {
  switch (tone) {
    case "Calm": return "linear-gradient(to bottom, #a3cce9, #f0f6fb)";
    case "Motivational": return "linear-gradient(to bottom, #ffe9a3, #fffbe0)";
    default: return "#ffffff";
  }
}

fetch(`quotes/quotes-overwhelmed-v1.json`)
  .then(res => res.json())
  .then(data => {
    let userData = JSON.parse(localStorage.getItem(QUOTE_KEY));
    if (!userData) {
      userData = { startDate: new Date(), version };
      localStorage.setItem(QUOTE_KEY, JSON.stringify(userData));
    }
    const day = getDayNumber(userData.startDate);
    loadQuotesForDay(data, day);
  });
