let cities = [];

// LOAD DATA FROM JSON
fetch("data/cities.json")
    .then(res => res.json())
    .then(data => {
        cities = data;
    });

// QUESTIONS
const questions = [
    { id: "budget", text: "Budget (1–4)", options: [1,2,3,4] },
    { id: "flight", text: "Flight tolerance (1–4)", options: [1,2,3,4] },
    { id: "activity", text: "Activity level (1–3)", options: [1,2,3] },
    { id: "kids", text: "Kids factor (1–4)", options: [1,2,3,4] },
    { id: "culture", text: "Cultural comfort (1–3)", options: [1,2,3] }
];

// RENDER QUESTIONS
const quiz = document.getElementById("quiz");

questions.forEach(q => {
    let html = `<div class="question">
        <label>${q.text}</label>
        <select id="${q.id}">`;

    q.options.forEach(o => {
        html += `<option value="${o}">${o}</option>`;
    });

    html += `</select></div>`;
    quiz.innerHTML += html;
});

// CALCULATE
function calculate() {

    let user = {};
    questions.forEach(q => {
        user[q.id] = parseInt(document.getElementById(q.id).value);
    });

    let results = cities.map(city => {

        let score =
            (user.budget * city.affordability) +
            (user.flight * city.accessibility) +
            (user.activity * city.experience) +
            (user.kids * city.family) +
            (user.culture * city.culture);

        return { ...city, score };
    });

    results.sort((a,b) => b.score - a.score);

    let top3 = results.slice(0,3);
    let wildcard = results.slice(3,5);

    showResults(top3, wildcard, user);
}

// DISPLAY
function showResults(top3, wildcard, user) {

    let div = document.getElementById("results");

    div.innerHTML = "<h2>Top 3 Destinations</h2>";
    top3.forEach(c => div.innerHTML += card(c, user));

    div.innerHTML += "<h2>Wildcard Picks</h2>";
    wildcard.forEach(c => div.innerHTML += card(c, user));
}

// EXPLANATION ENGINE
function card(city, user) {

    let reasons = [];

    if(user.flight <= 2 && city.accessibility > 6)
        reasons.push("Matches your low-flight preference");

    if(user.kids >= 3 && city.family > 6)
        reasons.push("Great for toddlers");

    if(user.budget <= 2 && city.affordability > 6)
        reasons.push("Strong AUD value");

    if(user.activity >= 3 && city.experience > 6)
        reasons.push("High activity destination");

    return `
    <div class="card">
        <h3>${city.name}</h3>
        <ul>${reasons.map(r => `<li>${r}</li>`).join("")}</ul>
    </div>`;
}
