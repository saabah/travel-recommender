document.addEventListener("DOMContentLoaded", () => {
  console.log("App loaded");
});

let cities = [];
let current = 0;
let answers = {};

// SAFE LOAD (fixes GitHub issues)
async function loadCities() {
  try {
    const res = await fetch("./data/cities.json");
    cities = await res.json();
    console.log("Cities loaded:", cities.length);
  } catch (err) {
    alert("Error loading city data. Check file path.");
    console.error(err);
  }
}
loadCities();

// ----------------
// NAVIGATION
// ----------------
function enterApp() {

  const hero = document.getElementById("hero");
  const app = document.getElementById("app");

  if (!hero || !app) {
    console.error("Missing hero/app");
    return;
  }

  hero.style.display = "none";
  app.style.display = "block";
}

function startQuiz() {

  const intro = document.getElementById("intro");
  const quiz = document.getElementById("quizSection");

  if (!intro || !quiz) {
    console.error("Missing HTML elements");
    return;
  }

  intro.style.display = "none";
  quiz.style.display = "block";

  render();
}

const questions = [

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
    { label: "Primary school kids", value: 3 },
    { label: "Teenagers", value: 2 }
  ]
},
{
  id: "pace",
  text: "Preferred travel pace?",
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
    { label: "Picky eater", value: 1 },
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
    { label: "Very important", value: 3 },
    { label: "Somewhat", value: 2 },
    { label: "Not relevant", value: 1 }
  ]
},
{
  id: "primary",
  text: "Primary school needs?",
  options: [
    { label: "High (theme parks etc.)", value: 3 },
    { label: "Moderate", value: 2 },
    { label: "Not important", value: 1 }
  ]
},
{
  id: "teen",
  text: "Teenager needs?",
  options: [
    { label: "High thrill", value: 3 },
    { label: "Moderate", value: 2 },
    { label: "Not relevant", value: 1 }
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

// ----------------
// RENDER
// ----------------
function render() {

  let q = questions[current];

  let html = `<h2>${q.text}</h2>`;

  q.options.forEach(opt => {
    let selected = answers[q.id] === opt.value ? "selected" : "";
    html += `<div class="option ${selected}" onclick="select('${q.id}',${opt.value})">
      ${opt.label}
    </div>`;
  });

  document.getElementById("questionBox").innerHTML = html;

  let progress = ((current + 1)/questions.length)*100;
  document.getElementById("progress").style.width = progress + "%";
}

// ----------------
// SELECT
// ----------------
function select(id,val) {
  answers[id] = val;
  render();
}

// ----------------
// NEXT / PREV
// ----------------
function next() {
  if(current < questions.length-1){
    current++;
    render();
  } else {
    calculate();
  }
}

function prev() {
  if(current > 0){
    current--;
    render();
  }
}

// ----------------
// CALCULATE
// ----------------
function calculate() {

  let u = answers;

  // --- BUILD INDICES ---
  let affordability = (u.budget + u.exchange) / 2;

  let accessibility = (u.flight + u.booking + u.pace) / 3;

  let experience = (u.activity + u.goal) / 2;

  let family = (u.age + u.toddler + u.primary + u.teen) / 4;

  let culture = (u.culture + u.food + u.vibe) / 3;

  let results = cities.map(c => {

    let score =
      affordability * c.affordability +
      accessibility * c.accessibility +
      experience * c.experience +
      family * c.family +
      culture * c.culture;

    return { ...c, score };
  });

  results.sort((a,b)=>b.score-a.score);

  showResults(results.slice(0,3), results.slice(3,5), u);
}

// ----------------
// RESULTS
// ----------------
function calculate() {

  let u = answers;

  // --- BUILD INDICES ---
  let affordability = (u.budget + u.exchange) / 2;

  let accessibility = (u.flight + u.booking + u.pace) / 3;

  let experience = (u.activity + u.goal) / 2;

  let family = (u.age + u.toddler + u.primary + u.teen) / 4;

  let culture = (u.culture + u.food + u.vibe) / 3;

  let results = cities.map(c => {

    let score =
      affordability * c.affordability +
      accessibility * c.accessibility +
      experience * c.experience +
      family * c.family +
      culture * c.culture;

    return { ...c, score };
  });

  results.sort((a,b)=>b.score-a.score);

  showResults(results.slice(0,3), results.slice(3,5), u);
}

function showResults(top3, wildcard, user){

  let div = document.getElementById("results");

  div.innerHTML = "<h2>🏆 Top Destinations</h2>";

  top3.forEach(c=>{
    div.innerHTML += card(c, user);
  });

  div.innerHTML += "<h2>🎯 Wildcard Picks</h2>";

  wildcard.forEach(c=>{
    div.innerHTML += card(c, user);
  });
}

function card(city, user){

  let reasons = [];

  if(user.flight <= 2 && city.accessibility > 6)
    reasons.push("short and convenient travel");

  if(user.age >= 3 && city.family > 6)
    reasons.push("excellent family-friendly infrastructure");

  if(user.budget <= 2 && city.affordability > 6)
    reasons.push("great value for Australian travellers");

  if(user.activity >= 3 && city.experience > 6)
    reasons.push("high-energy experiences");

  if(user.vibe >= 2 && city.culture > 6)
    reasons.push("rich cultural experiences");

  let explanation = `Based on your preferences, ${city.name} is a strong match because it offers ${reasons.join(", ")}.`;

  return `
  <div class="card">
    <h3>${city.name}</h3>
    <p>${explanation}</p>
  </div>`;
}
