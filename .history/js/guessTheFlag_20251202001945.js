import { embedHTML } from "../util/utils.js";

// Load shared components
await embedHTML("head", "/htmlUtil/head.html");
document.title = "Flag Scape - Guess The Flag";
await embedHTML("header", "/htmlUtil/header.html");
await embedHTML("sideBar", "/htmlUtil/sideBar.html");
await embedHTML("fab", "/htmlUtil/fab.html");
document.getElementById("hekal")?.appendChild(document.createElement("span")).append("3mk Hekal");

// Game state
const state = {
    score: 0,
    streak: 0,
    question: 1,
    totalQuestions: 10,
    correctCount: 0,
    countries: []
};

const els = {
    flag: document.getElementById("gf-flag"),
    options: document.getElementById("gf-options"),
    score: document.getElementById("gf-score"),
    streak: document.getElementById("gf-streak"),
    question: document.getElementById("gf-question"),
    result: document.getElementById("gf-result"),
    finalScore: document.getElementById("gf-final-score"),
    finalCorrect: document.getElementById("gf-final-correct"),
    restart: document.getElementById("gf-restart")
};

async function fetchCountries() {
    const res = await fetch("https://restcountries.com/v3.1/all?fields=name,flags");
    const data = await res.json();
    // Filter countries that have both name and flags
    return data.filter(c => c?.name?.common && c?.flags?.png);
}

function updateStats() {
    els.score.textContent = state.score;
    els.streak.textContent = state.streak;
    els.question.textContent = `${state.question}/${state.totalQuestions}`;
}

function pickRandom(arr, n) {
    const copy = [...arr];
    const out = [];
    for (let i = 0; i < n && copy.length; i++) {
        const idx = Math.floor(Math.random() * copy.length);
        out.push(copy.splice(idx, 1)[0]);
    }
    return out;
}

function renderQuestion() {
    updateStats();
    const candidates = pickRandom(state.countries, 4);
    const correct = candidates[Math.floor(Math.random() * candidates.length)];
    els.flag.src = correct.flags.png;
    els.flag.alt = `${correct.name.common} flag`;

    els.options.innerHTML = "";
    candidates
        .map(c => ({ name: c.name.common, correct: c === correct }))
        .sort(() => Math.random() - 0.5)
        .forEach(opt => {
            const btn = document.createElement("button");
            btn.className = "option-btn";
            btn.textContent = opt.name;
            btn.onclick = () => checkAnswer(btn, opt.correct);
            els.options.appendChild(btn);
        });
}

function checkAnswer(btn, isCorrect) {
    // Disable all options during feedback
    [...els.options.children].forEach(b => (b.disabled = true));

    if (isCorrect) {
        btn.classList.add("correct");
        state.correctCount++;
        state.streak++;
        state.score += 10 + state.streak * 5;
    } else {
        btn.classList.add("incorrect");
        state.streak = 0;
    }
    updateStats();

    setTimeout(() => nextQuestion(), 800);
}

function nextQuestion() {
    if (state.question >= state.totalQuestions) {
        // Show results
        els.finalScore.textContent = state.score;
        els.finalCorrect.textContent = state.correctCount;
        els.result.classList.remove("hidden");
        return;
    }
    state.question++;
    renderQuestion();
}

function resetGame() {
    state.score = 0;
    state.streak = 0;
    state.question = 1;
    state.correctCount = 0;
    els.result.classList.add("hidden");
    renderQuestion();
}

els.restart.addEventListener("click", resetGame);

(async function init() {
    try {
        state.countries = await fetchCountries();
        renderQuestion();
    } catch (e) {
        console.error("Failed to init Guess The Flag", e);
        document.getElementById("guess-flag-game").innerHTML = `<div class="result-content"><h2>Failed to load countries</h2><p>Please check your internet connection.</p></div>`;
    }
})();
