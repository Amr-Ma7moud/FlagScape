import { embedHTML } from "../util/utils.js"

// Load HTML components
async function initializePage() {
  await embedHTML("head", "/htmlUtil/head.html");
  document.title = "FlagScape - Guess the Flag";
  await embedHTML("header", "/htmlUtil/header.html");
  await embedHTML("sideBar", "/htmlUtil/sideBar.html");
  await embedHTML("fab", "/htmlUtil/fab.html");
  document.getElementById("hekal")?.appendChild(document.createElement("span")).innerHTML = "3mk Hekal";
  
  startGame();
}

// Game state
let gameState = {
  score: 0,
  currentQuestion: 0,
  totalQuestions: 10,
  streak: 0,
  bestStreak: 0,
  correctAnswers: 0,
  countries: [],
  currentCountry: null
};

async function fetchCountries() {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();
    // Filter out countries without flags and shuffle
    gameState.countries = data
      .filter(c => c.flags?.svg && c.name?.common)
      .sort(() => Math.random() - 0.5);
  } catch (error) {
    console.error('Error fetching countries:', error);
  }
}

function getRandomCountries(correct, count = 4) {
  const options = [correct];
  const available = gameState.countries.filter(c => c.cca3 !== correct.cca3);
  
  while (options.length < count && available.length > 0) {
    const randomIndex = Math.floor(Math.random() * available.length);
    options.push(available.splice(randomIndex, 1)[0]);
  }
  
  return options.sort(() => Math.random() - 0.5);
}

function loadQuestion() {
  if (gameState.currentQuestion >= gameState.totalQuestions) {
    showResults();
    return;
  }

  gameState.currentCountry = gameState.countries[gameState.currentQuestion];
  const options = getRandomCountries(gameState.currentCountry);

  // Update UI
  document.getElementById('flag-image').src = gameState.currentCountry.flags.svg;
  document.getElementById('question-num').textContent = `${gameState.currentQuestion + 1}/${gameState.totalQuestions}`;

  const optionsGrid = document.getElementById('options-grid');
  optionsGrid.innerHTML = '';

  options.forEach(country => {
    const button = document.createElement('button');
    button.className = 'option-btn';
    button.textContent = country.name.common;
    button.onclick = () => checkAnswer(country.cca3 === gameState.currentCountry.cca3, button);
    optionsGrid.appendChild(button);
  });
}

function checkAnswer(isCorrect, button) {
  const allButtons = document.querySelectorAll('.option-btn');
  allButtons.forEach(btn => btn.disabled = true);

  if (isCorrect) {
    button.classList.add('correct');
    gameState.score += 10 + (gameState.streak * 5);
    gameState.correctAnswers++;
    gameState.streak++;
    gameState.bestStreak = Math.max(gameState.bestStreak, gameState.streak);
  } else {
    button.classList.add('incorrect');
    gameState.streak = 0;
    // Show correct answer
    allButtons.forEach(btn => {
      if (btn.textContent === gameState.currentCountry.name.common) {
        btn.classList.add('correct');
      }
    });
  }

  updateStats();

  setTimeout(() => {
    gameState.currentQuestion++;
    loadQuestion();
  }, 1500);
}

function updateStats() {
  document.getElementById('score').textContent = gameState.score;
  document.getElementById('streak').textContent = gameState.streak + '🔥';
}

function showResults() {
  document.getElementById('game-area').classList.add('hidden');
  const resultScreen = document.getElementById('result-screen');
  resultScreen.classList.remove('hidden');

  document.getElementById('final-score').textContent = gameState.score;
  document.getElementById('correct-answers').textContent = `${gameState.correctAnswers}/10`;
  document.getElementById('best-streak').textContent = gameState.bestStreak;

  document.getElementById('play-again-btn').onclick = () => location.reload();
  document.getElementById('back-home-btn').onclick = () => location.href = 'index.html';
}

async function startGame() {
  await fetchCountries();
  loadQuestion();
  
  // Setup sidebar navigation
  document.querySelectorAll('#sideBar button[id]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.id === 'GF') return;
      if (btn.id === 'CC') location.href = 'capitalChallenge.html';
      if (btn.id === 'SQ') location.href = 'speedQuiz.html';
    });
  });
}

initializePage();
