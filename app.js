let cities = [];
let current = 0;
let answers = {};

// LOAD DATA
fetch("data/cities.json")
  .then(res => res.json())
  .then(data => cities = data);

// QUESTIONS
const questions = [

// --- SAME 15 QUESTIONS ---
{
  id: "budget",
  text: "What is your total travel budget?",
  options: [
    { label: "< $1,500", value: 1 },
    { label: "$1,500–$3,000", value: 2 },
    { label: "$3,000–$6,000", value: 3 },
    { label: "$6,000+", value: 4 }
  ]
},
{
  id: "flight",
  text: "How long can you fly comfortably?",
  options: [
    { label: "< 5 hours", value: 1 },
    { label: "5–10 hours", value: 2 },
    { label: "10–15 hours", value: 3 },
    { label: "15+ hours", value: 4 }
  ]
},
{
  id: "exchange",
  text: "How important is exchange rate?",
  options: [
    { label: "Very important", value: 3 },
    { label: "Moderate", value: 2 },
    { label: "Not important", value: 1 }
  ]
},
{
  id: "booking",
  text: "Your booking style?",
  options: [
    { label: "Fully planned", value: 3 },
    { label: "Semi-planned", value: 2 },
    { label: "Flexible", value: 1 }
  ]
},
{
  id: "activity",
  text: "Preferred activity level?",
  options: [
    { label: "Relaxed", value: 1 },
    { label: "Balanced", value: 2 },
    { label: "High-energy", value: 3 }
  ]
},
{
  id: "culture",
  text: "Cultural comfort?",
  options: [
    { label: "Very comfortable", value: 3 },
    { label: "Moderate", value: 2 },
    { label: "Adventurous", value: 1 }
  ]
},
{
  id: "climate",
  text: "Preferred climate?",
  options: [
    { label: "Tropical", value: 3 },
    { label: "Mild", value: 2 },
    { label: "Cold", value: 1 }
  ]
},
{
  id: "age",
  text: "Who are you travelling with?",
  options: [
    { label: "Adults only", value: 1 },
    { label: "Toddlers", value: 4 },
    { label: "Primary kids", value: 3 },
    { label: "Teenagers", value: 2 }
  ]
},
{
  id: "pace",
  text: "Travel pace?",
  options: [
    { label: "Stay in one place", value: 1 },
    { label: "2–3 places", value: 2 },
    { label: "Multi-city", value: 3 }
  ]
},
{
  id: "food",
  text: "Food preference?",
  options: [
    { label: "Picky", value: 1 },
    { label: "Moderate", value: 2 },
    { label: "Foodie", value: 3 }
  ]
},
{
  id: "goal",
  text: "Main goal?",
  options: [
    { label: "Relax", value: 1 },
    { label: "Explore", value: 3 }
  ]
},
{
  id: "toddler",
  text: "Toddler needs?",
  options: [
    { label: "Important", value: 3 },
    { label: "Somewhat", value: 2 },
    { label: "Not relevant", value: 1 }
  ]
},
{
  id: "primary",
  text: "Primary kids needs?",
  options: [
    { label: "High", value: 3 },
    { label: "Moderate", value: 2 },
    { label: "Low", value: 1 }
  ]
},
{
  id: "teen",
  text: "Teen needs?",
  options: [
    { label: "High thrill", value: 3 },
    { label: "Moderate", value: 2 },
    { label: "Low", value: 1 }
  ]
},
{
  id: "vibe",
  text: "Preferred vibe?",
  options: [
    { label: "Familiar", value: 1 },
    { label: "Mix", value: 2 },
    { label: "Unique", value: 3 }
  ]
}
];

// INIT
render();

// -----------------------------
// RENDER QUESTION
// -----------------------------
function render() {

  let q = questions[current];

  let html = `<div class="question">
    <h2>${q.text}</h2>
    <div class="options">`;

  q.options.forEach(opt => {
    let selected = answers[q.id] === opt.value ? "selected" : "";
    html += `<div class="option ${selected}" onclick="select('${q.id}', ${opt.value})">
      ${opt.label}
    </div>`;
  });

  html += `</div></div>`;

  document.getElementById("questionBox").innerHTML = html;

  // Progress
  let progress = ((current + 1) / questions.length) * 100;
  document.getElementById("progress").style.width = progress + "%";
}

// -----------------------------
// SELECT OPTION
// -----------------------------
function select(id, value) {
  answers[id] = value;
  render();
}

// -----------------------------
// NAVIGATION
// -----------------------------
function next() {
  if(current < questions.length - 1) {
    current++;
    render();
  } else {
    calculate();
  }
}

function prev() {
  if(current > 0) {
    current--;
    render();
  }
}

// -----------------------------
// CALCULATE RESULTS
// -----------------------------
function calculate() {

  let u = answers;

  let affordability = (u.budget + u.exchange) / 2;
  let accessibility = (u.flight + u.booking + u.pace) / 3;
  let experience = (u.activity + u.goal) / 2;
  let family = (u.age + u.toddler + u.primary + u.teen) / 4;
  let culture = (u.culture + u.food + u.vibe) / 3;

  let results = cities.map(city => {
    let score =
      affordability * city.affordability +
      accessibility * city.accessibility +
      experience * city.experience +
      family * city.family +
      culture * city.culture;

    return { ...city, score };
  });

  results.sort((a,b) => b.score - a.score);

  let top3 = results.slice(0,3);
  let wildcard = results.slice(3,5);

  showResults(top3, wildcard, u);
}

// -----------------------------
// SHOW RESULTS
// -----------------------------
function showResults(top3, wildcard, user) {

  let div = document.getElementById("results");

  div.innerHTML = "<h2>🏆 Top 3 Destinations</h2>";

  top3.forEach(c => div.innerHTML += card(c, user));

  div.innerHTML += "<h2>🎯 Wildcards</h2>";

  wildcard.forEach(c => div.innerHTML += card(c, user));
}

// -----------------------------
// EXPLANATION
// -----------------------------
function card(city, user) {

  let reasons = [];

  if(user.flight <= 2 && city.accessibility > 6)
    reasons.push("Matches your low-flight preference");

  if(user.age >= 3 && city.family > 6)
    reasons.push("Great for kids");

  if(user.budget <= 2 && city.affordability > 6)
    reasons.push("Strong AUD value");

  if(user.activity >= 3 && city.experience > 6)
    reasons.push("High-energy destination");

  return `
  <div class="card">
    <h3>${city.name}</h3>
    <ul>${reasons.map(r => `<li>${r}</li>`).join("")}</ul>
  </div>`;
}
