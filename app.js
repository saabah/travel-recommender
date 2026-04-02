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
  document.getElementById("hero").style.display = "none";
  document.getElementById("app").style.display = "block";
}

function startQuiz() {
  document.getElementById("intro").style.display = "none";
  document.getElementById("quizSection").style.display = "block";
  render();
}

// ----------------
// QUESTIONS (SHORT VERSION FOR STABILITY)
// ----------------
const questions = [
{
  id: "budget",
  text: "Your budget?",
  options: [
    { label: "Low", value: 1 },
    { label: "Medium", value: 2 },
    { label: "High", value: 3 }
  ]
},
{
  id: "flight",
  text: "Flight tolerance?",
  options: [
    { label: "Short", value: 1 },
    { label: "Medium", value: 2 },
    { label: "Long", value: 3 }
  ]
},
{
  id: "activity",
  text: "Activity level?",
  options: [
    { label: "Relax", value: 1 },
    { label: "Balanced", value: 2 },
    { label: "Busy", value: 3 }
  ]
},
{
  id: "family",
  text: "Travelling with kids?",
  options: [
    { label: "No", value: 1 },
    { label: "Yes", value: 3 }
  ]
},
{
  id: "culture",
  text: "Cultural preference?",
  options: [
    { label: "Familiar", value: 1 },
    { label: "Mixed", value: 2 },
    { label: "Adventure", value: 3 }
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

  let results = cities.map(c => {

    let score =
      (answers.budget || 1) * c.affordability +
      (answers.flight || 1) * c.accessibility +
      (answers.activity || 1) * c.experience +
      (answers.family || 1) * c.family +
      (answers.culture || 1) * c.culture;

    return { ...c, score };
  });

  results.sort((a,b)=>b.score-a.score);

  showResults(results.slice(0,3), results.slice(3,5));
}

// ----------------
// RESULTS
// ----------------
function showResults(top3, wildcard){

  let div = document.getElementById("results");

  div.innerHTML = "<h2>Top Destinations</h2>";

  top3.forEach(c=>{
    div.innerHTML += `<div class="card">
      <h3>${c.name}</h3>
      <p>Great match based on your preferences.</p>
    </div>`;
  });

  div.innerHTML += "<h2>Wildcard Picks</h2>";

  wildcard.forEach(c=>{
    div.innerHTML += `<div class="card">
      <h3>${c.name}</h3>
    </div>`;
  });
}
