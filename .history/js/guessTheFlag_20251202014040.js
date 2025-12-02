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
    const mode = MODES[state.mode];
    els.score.textContent = state.score;
    els.streak.textContent = state.streak;
    
    if (mode?.suddenDeath) {
        els.question.textContent = state.question;
    } else {
        els.question.textContent = `${state.question}/${state.totalQuestions}`;
    }
    
    if (mode?.useReserve) {
        els.reserveValue.textContent = state.timer.reserve;
    }
    
    if (mode?.suddenDeath) {
        els.livesValue.textContent = "❤️";
    }
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
    const mode = MODES[state.mode];
    updateStats();
    
    const candidates = pickRandom(state.countries, 4);
    state.currentCountry = candidates[Math.floor(Math.random() * candidates.length)];
    
    els.flag.onload = () => startTimer();
    els.flag.onerror = () => startTimer();
    els.flag.src = state.currentCountry.flags.png;
    els.flag.alt = `${state.currentCountry.name.common} flag`;

    if (mode.typing) {
        // Typing mode
        els.typeInput.value = "";
        els.typeInput.disabled = false;
        els.typeInput.style.borderColor = "";
        els.typeInput.focus();
        els.autocomplete.innerHTML = "";
        setupTypingMode();
    } else {
        // Multiple choice mode
        els.options.innerHTML = "";
        candidates
            .map(c => ({ name: c.name.common, correct: c === state.currentCountry }))
            .sort(() => Math.random() - 0.5)
            .forEach(opt => {
                const btn = document.createElement("button");
                btn.className = "option-btn";
                btn.textContent = opt.name;
                btn.onclick = () => checkAnswer(btn, opt.correct);
                els.options.appendChild(btn);
            });
    }
}

function checkAnswer(btn, isCorrect) {
    const mode = MODES[state.mode];
    stopTimer();
    
    // Disable interaction
    if (!mode.typing) {
        [...els.options.children].forEach(b => (b.disabled = true));
    } else {
        els.typeInput.disabled = true;
    }

    if (isCorrect) {
        if (btn) btn.classList.add("correct");
        state.correctCount++;
        state.streak++;
        
        // Scoring
        let points = 10 + state.streak * 5;
        
        // Time bonus
        if (mode.useGlobalTimer) {
            points += Math.floor(state.timer.globalRemaining / 2);
        } else if (state.timer.remaining) {
            points += Math.floor(state.timer.remaining / 2);
        }
        
        state.score += points;
        
        // Reserve management (hybrid mode)
        if (mode.useReserve && state.timer.remaining >= 6) {
            state.timer.reserve = Math.min(mode.maxReserve, state.timer.reserve + 2);
        } else if (mode.useReserve && state.timer.remaining >= 3) {
            state.timer.reserve = Math.min(mode.maxReserve, state.timer.reserve + 1);
        }
    } else {
        if (btn) btn.classList.add("incorrect");
        else if (mode.typing) {
            els.typeInput.style.borderColor = "#dc3545";
        }
        
        state.streak = 0;
        
        // Sudden death - game over
        if (mode.suddenDeath) {
            setTimeout(() => endGame("💀 Game Over!", `You survived ${state.question} question${state.question !== 1 ? 's' : ''}!`), 1000);
            return;
        }
        
        // Show correct answer
        if (!mode.typing) {
            [...els.options.children].forEach(b => {
                if (b.textContent === state.currentCountry.name.common) {
                    b.classList.add("correct");
                }
            });
        }
    }
    
    updateStats();
    setTimeout(() => nextQuestion(), 800);
}

function nextQuestion() {
    const mode = MODES[state.mode];
    
    // Check win condition
    if (!mode.suddenDeath && state.question >= state.totalQuestions) {
        let title = "🎉 Congratulations!";
        let message = `You completed ${mode.name}!`;
        
        if (state.correctCount === state.totalQuestions) {
            title = "🏆 Perfect Score!";
            message = "Flawless victory! You're a geography master!";
        }
        
        endGame(title, message);
        return;
    }
    
    state.question++;
    renderQuestion();
}

function endGame(title, message) {
    const mode = MODES[state.mode];
    stopTimer();
    
    els.resultTitle.textContent = title;
    els.resultMessage.textContent = message;
    els.finalScore.textContent = state.score;
    els.finalCorrect.textContent = state.correctCount;
    
    // Show time remaining for speed run
    if (mode.useGlobalTimer) {
        els.finalTimeStat.classList.remove("hidden");
        els.finalTime.textContent = state.timer.globalRemaining + "s";
    } else {
        els.finalTimeStat.classList.add("hidden");
    }
    
    els.gameArea.classList.add("hidden");
    els.gameHeader.classList.add("hidden");
    els.result.classList.remove("hidden");
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
els.changeMode?.addEventListener("click", showModeSelection);
els.backToModes?.addEventListener("click", showModeSelection);

// Mode selection handlers
document.querySelectorAll(".mode-card").forEach(card => {
    card.addEventListener("click", () => {
        const mode = card.dataset.mode;
        startMode(mode);
    });
});

function showModeSelection() {
    stopTimer();
    els.modeSelection.classList.remove("hidden");
    els.gameHeader.classList.add("hidden");
    els.gameArea.classList.add("hidden");
    els.result.classList.add("hidden");
}

async function startMode(modeKey) {
    const mode = MODES[modeKey];
    if (!mode) return;

    state.mode = modeKey;
    state.score = 0;
    state.streak = 0;
    state.question = 1;
    state.correctCount = 0;
    state.totalQuestions = mode.totalQuestions;
    state.timer.reserve = 0;
    state.timer.basePerQuestion = mode.basePerQuestion || 12;
    state.timer.maxPerQuestionBonus = mode.maxPerQuestionBonus || 0;
    state.timer.maxReserve = mode.maxReserve || 0;
    state.timer.globalRemaining = mode.globalTime || 0;

    // Fetch countries if needed
    if (!state.countries.length) {
        try {
            state.countries = await fetchCountries();
        } catch (e) {
            console.error("Failed to fetch countries", e);
            alert("Failed to load countries. Please check your internet connection.");
            showModeSelection();
            return;
        }
    }

    // UI setup
    els.modeSelection.classList.add("hidden");
    els.gameHeader.classList.remove("hidden");
    els.gameArea.classList.remove("hidden");
    els.result.classList.add("hidden");
    els.modeName.textContent = mode.name;

    // Show/hide relevant stats
    els.reserveStat.classList.toggle("hidden", !mode.useReserve);
    els.livesStat.classList.toggle("hidden", !mode.suddenDeath);
    els.timerStat.classList.toggle("hidden", mode.typing && !mode.useGlobalTimer);

    // Show/hide input methods
    if (mode.typing) {
        els.options.classList.add("hidden");
        els.typingInput.classList.remove("hidden");
    } else {
        els.options.classList.remove("hidden");
        els.typingInput.classList.add("hidden");
    }

    renderQuestion();
}

(async function init() {
    // Show mode selection on load
    showModeSelection();
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
