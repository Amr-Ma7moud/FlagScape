import { embedHTML } from "../util/utils.js"

async function initializePage() {
  await embedHTML("head", "/htmlUtil/head.html");
  document.title = "FlagScape - Capital Challenge";
  await embedHTML("header", "/htmlUtil/header.html");
  await embedHTML("sideBar", "/htmlUtil/sideBar.html");
  await embedHTML("fab", "/htmlUtil/fab.html");
  document.getElementById("hekal").appendChild(document.createElement("span")).innerHTML = "3mk Hekal";
  
  startGame();
}

let gameState = {
  score: 0,
  timeLeft: 30,
  level: 1,
  correctAnswers: 0,
  maxLevel: 1,
  countries: [],
  currentCountry: null,
  timer: null
};

async function fetchCountries() {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();
    gameState.countries = data
      .filter(c => c.capital && c.capital[0] && c.name?.common)
      .sort(() => Math.random() - 0.5);
  } catch (error) {
    console.error('Error fetching countries:', error);
  }
}

function startTimer() {
  gameState.timer = setInterval(() => {
    gameState.timeLeft--;
    document.getElementById('timer').textContent = gameState.timeLeft + 's';
    
    if (gameState.timeLeft <= 10) {
      document.getElementById('timer').classList.add('timer-critical');
    }
    
    if (gameState.timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function getRandomCapitals(correct, count = 4) {
  const options = [correct.capital[0]];
  const available = gameState.countries.filter(c => c.cca3 !== correct.cca3);
  
  while (options.length < count && available.length > 0) {
    const randomIndex = Math.floor(Math.random() * available.length);
    const country = available.splice(randomIndex, 1)[0];
    if (country.capital && country.capital[0]) {
      options.push(country.capital[0]);
    }
  }
  
  return options.sort(() => Math.random() - 0.5);
}

function loadQuestion() {
  const index = Math.floor(Math.random() * gameState.countries.length);
  gameState.currentCountry = gameState.countries[index];
  const options = getRandomCapitals(gameState.currentCountry);

  document.getElementById('country-name').textContent = gameState.currentCountry.name.common;

  const optionsGrid = document.getElementById('options-grid');
  optionsGrid.innerHTML = '';

  options.forEach(capital => {
    const button = document.createElement('button');
    button.className = 'option-btn';
    button.textContent = capital;
    button.onclick = () => checkAnswer(capital === gameState.currentCountry.capital[0], button);
    optionsGrid.appendChild(button);
  });
}

function checkAnswer(isCorrect, button) {
  const allButtons = document.querySelectorAll('.option-btn');
  allButtons.forEach(btn => btn.disabled = true);

  if (isCorrect) {
    button.classList.add('correct');
    const points = 10 * gameState.level;
    gameState.score += points;
    gameState.correctAnswers++;
    gameState.timeLeft += 3; // Bonus time
    
    // Level up every 5 correct answers
    if (gameState.correctAnswers % 5 === 0) {
      gameState.level++;
      gameState.maxLevel = Math.max(gameState.maxLevel, gameState.level);
      document.getElementById('level').textContent = gameState.level;
    }
  } else {
    button.classList.add('incorrect');
    gameState.timeLeft -= 5; // Time penalty
    allButtons.forEach(btn => {
      if (btn.textContent === gameState.currentCountry.capital[0]) {
        btn.classList.add('correct');
      }
    });
  }

  document.getElementById('score').textContent = gameState.score;

  setTimeout(() => {
    loadQuestion();
  }, 1000);
}

function endGame() {
  clearInterval(gameState.timer);
  document.getElementById('game-area').classList.add('hidden');
  document.querySelector('.game-header').classList.add('hidden');
  const resultScreen = document.getElementById('result-screen');
  resultScreen.classList.remove('hidden');

  document.getElementById('final-score').textContent = gameState.score;
  document.getElementById('correct-answers').textContent = gameState.correctAnswers;
  document.getElementById('max-level').textContent = gameState.maxLevel;

  document.getElementById('play-again-btn').onclick = () => location.reload();
  document.getElementById('back-home-btn').onclick = () => location.href = 'index.html';
}

async function startGame() {
  await fetchCountries();
  loadQuestion();
  startTimer();
}

initializePage();
