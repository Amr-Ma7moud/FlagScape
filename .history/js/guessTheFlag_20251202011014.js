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
    countries: [],
    timer: {
        basePerQuestion: 12, // seconds
        maxPerQuestionBonus: 3, // seconds max pulled from reserve per question
        maxReserve: 9, // cap the pool
        reserve: 0, // pooled seconds earned from fast correct answers
        remaining: 0,
        totalThisQuestion: 0,
        intervalId: null
    }
};

const els = {
    flag: document.getElementById("gf-flag"),
    options: document.getElementById("gf-options"),
    score: document.getElementById("gf-score"),
    streak: document.getElementById("gf-streak"),
    question: document.getElementById("gf-question"),
    gameArea: document.querySelector(".game-area"),
    gameHeader: document.querySelector(".game-header"),
    timerValue: document.getElementById("gf-timer"),
    timerFill: document.getElementById("gf-timer-fill"),
    reserveValue: document.getElementById("gf-reserve"),
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
    els.reserveValue.textContent = state.timer.reserve;
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
    
    // Load flag image and start timer only after it loads
    els.flag.onload = () => startTimer();
    els.flag.onerror = () => startTimer(); // Start even if image fails to load
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
    // Stop timer
    stopTimer();
    // Disable all options during feedback
    [...els.options.children].forEach(b => (b.disabled = true));

    if (isCorrect) {
        btn.classList.add("correct");
        state.correctCount++;
        state.streak++;
        // Base + streak bonus + time bonus
        state.score += 10 + state.streak * 5 + Math.floor(state.timer.remaining / 2);
        // Earn reserve based on speed
        if (state.timer.remaining >= 6) state.timer.reserve = Math.min(state.timer.maxReserve, state.timer.reserve + 2);
        else if (state.timer.remaining >= 3) state.timer.reserve = Math.min(state.timer.maxReserve, state.timer.reserve + 1);
    } else {
        if (btn) btn.classList.add("incorrect");
        state.streak = 0;
    }
    updateStats();

    setTimeout(() => nextQuestion(), 800);
}

function nextQuestion() {
    if (state.question >= state.totalQuestions) {
        stopTimer();
        // Show results
        els.finalScore.textContent = state.score;
        els.finalCorrect.textContent = state.correctCount;
        // Hide gameplay UI, show result card
        els.gameArea.classList.add("hidden");
        els.gameHeader.classList.add("hidden");
        els.result.classList.remove("hidden");
        return;
    }
    state.question++;
    renderQuestion();
}

function resetGame() {
    stopTimer();
    state.score = 0;
    state.streak = 0;
    state.question = 1;
    state.correctCount = 0;
    state.timer.reserve = 0;
    state.timer.remaining = 0;
    state.timer.totalThisQuestion = 0;
    // Show gameplay UI, hide result card
    els.result.classList.add("hidden");
    els.gameArea.classList.remove("hidden");
    els.gameHeader.classList.remove("hidden");
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

// Timer helpers
function startTimer() {
    stopTimer();
    const bonus = Math.min(state.timer.reserve, state.timer.maxPerQuestionBonus);
    state.timer.reserve -= bonus;
    state.timer.totalThisQuestion = state.timer.basePerQuestion + bonus;
    state.timer.remaining = state.timer.totalThisQuestion;
    updateTimerUI();
    state.timer.intervalId = setInterval(() => {
        state.timer.remaining -= 1;
        updateTimerUI();
        if (state.timer.remaining <= 0) {
            stopTimer();
            // Auto mark incorrect on timeout
            checkAnswer(null, false);
        }
    }, 1000);
}

function stopTimer() {
    if (state.timer.intervalId) {
        clearInterval(state.timer.intervalId);
        state.timer.intervalId = null;
    }
}

function updateTimerUI() {
    // Text
    els.timerValue.textContent = Math.max(0, state.timer.remaining);
    els.timerValue.classList.remove("timer-warning", "timer-critical");
    if (state.timer.remaining <= 3) {
        els.timerValue.classList.add("timer-critical");
    } else if (state.timer.remaining <= 5) {
        els.timerValue.classList.add("timer-warning");
    }
    // Bar
    const pct = state.timer.totalThisQuestion
        ? Math.max(0, Math.min(100, (state.timer.remaining / state.timer.totalThisQuestion) * 100))
        : 0;
    if (els.timerFill) els.timerFill.style.width = `${pct}%`;
}
