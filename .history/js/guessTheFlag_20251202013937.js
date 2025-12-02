import { embedHTML } from "../util/utils.js";

// Load shared components
await embedHTML("head", "/htmlUtil/head.html");
document.title = "Flag Scape - Guess The Flag";
await embedHTML("header", "/htmlUtil/header.html");
await embedHTML("sideBar", "/htmlUtil/sideBar.html");
await embedHTML("fab", "/htmlUtil/fab.html");
document.getElementById("hekal")?.appendChild(document.createElement("span")).append("3mk Hekal");

// Game modes configuration
const MODES = {
    hybrid: {
        name: "⚡ Hybrid Timer",
        totalQuestions: 10,
        basePerQuestion: 12,
        maxPerQuestionBonus: 3,
        maxReserve: 9,
        useReserve: true,
        useGlobalTimer: false,
        suddenDeath: false,
        typing: false
    },
    "speed-run": {
        name: "🏃 Speed Run",
        totalQuestions: 10,
        globalTime: 120,
        useGlobalTimer: true,
        useReserve: false,
        suddenDeath: false,
        typing: false
    },
    "sudden-death": {
        name: "💀 Sudden Death",
        totalQuestions: 999,
        basePerQuestion: 12,
        useReserve: false,
        useGlobalTimer: false,
        suddenDeath: true,
        typing: false
    },
    typing: {
        name: "⌨️ Type It!",
        totalQuestions: 10,
        basePerQuestion: 20,
        useReserve: false,
        useGlobalTimer: false,
        suddenDeath: false,
        typing: true
    },
    blitz: {
        name: "⚡💨 Blitz Mode",
        totalQuestions: 10,
        basePerQuestion: 7,
        useReserve: false,
        useGlobalTimer: false,
        suddenDeath: false,
        typing: false
    },
    marathon: {
        name: "🏅 Marathon",
        totalQuestions: 20,
        basePerQuestion: 15,
        useReserve: false,
        useGlobalTimer: false,
        suddenDeath: false,
        typing: false
    }
};

// Game state
const state = {
    mode: null,
    score: 0,
    streak: 0,
    question: 1,
    totalQuestions: 10,
    correctCount: 0,
    countries: [],
    currentCountry: null,
    timer: {
        basePerQuestion: 12,
        maxPerQuestionBonus: 3,
        maxReserve: 9,
        reserve: 0,
        remaining: 0,
        totalThisQuestion: 0,
        globalRemaining: 0,
        intervalId: null
    }
};

const els = {
    modeSelection: document.getElementById("mode-selection"),
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
    reserveStat: document.getElementById("reserve-stat"),
    timerStat: document.getElementById("timer-stat"),
    livesStat: document.getElementById("lives-stat"),
    livesValue: document.getElementById("gf-lives"),
    result: document.getElementById("gf-result"),
    resultTitle: document.getElementById("gf-result-title"),
    resultMessage: document.getElementById("gf-result-message"),
    finalScore: document.getElementById("gf-final-score"),
    finalCorrect: document.getElementById("gf-final-correct"),
    finalTimeStat: document.getElementById("gf-time-stat"),
    finalTime: document.getElementById("gf-final-time"),
    restart: document.getElementById("gf-restart"),
    changeMode: document.getElementById("gf-change-mode"),
    backToModes: document.getElementById("back-to-modes"),
    modeName: document.getElementById("mode-name"),
    typingInput: document.getElementById("gf-typing-input"),
    typeInput: document.getElementById("gf-type-input"),
    autocomplete: document.getElementById("gf-autocomplete")
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

    // Start per-question timer with hybrid reserve
    startTimer();
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
