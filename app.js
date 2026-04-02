body {
  margin:0;
  font-family: Arial;
}

/* HERO */
#hero {
  height:100vh;
  background: linear-gradient(120deg,#0077cc,#00c6ff);
  display:flex;
  align-items:center;
  justify-content:center;
}

.overlay {
  text-align:center;
  color:white;
}

.overlay h1 {
  font-size:40px;
}

.overlay button {
  padding:12px 20px;
  margin-top:20px;
}

/* APP */
.container {
  max-width:600px;
  margin:auto;
  padding:20px;
}

/* PROGRESS */
.progress-bar {
  height:8px;
  background:#ddd;
  border-radius:10px;
}

#progress {
  height:100%;
  width:0%;
  background:#0077cc;
  transition:0.4s;
}

/* OPTIONS */
.option {
  padding:12px;
  margin:10px 0;
  background:#eef3f8;
  border-radius:8px;
  cursor:pointer;
}

.selected {
  background:#0077cc;
  color:white;
}

/* NAV */
.nav {
  display:flex;
  justify-content:space-between;
  margin-top:20px;
}

/* RESULTS */
.card {
  background:#eef3f8;
  padding:15px;
  margin-top:10px;
  border-radius:8px;
}
