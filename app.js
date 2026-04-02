function enterApp() {
  document.getElementById("hero").style.display = "none";
  document.getElementById("app").style.display = "block";
}

function startQuiz() {
  document.getElementById("intro").style.display = "none";
  document.getElementById("quizSection").style.display = "block";
  render();
}
