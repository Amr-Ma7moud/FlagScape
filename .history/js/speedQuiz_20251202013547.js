import { embedHTML } from "../util/utils.js"

async function initializePage() {
  await embedHTML("head", "/htmlUtil/head.html");
  document.title = "FlagScape - Speed Quiz";
  await embedHTML("header", "/htmlUtil/header.html");
  await embedHTML("sideBar", "/htmlUtil/sideBar.html");
  await embedHTML("fab", "/htmlUtil/fab.html");
  document.getElementById("hekal")?.appendChild(document.createElement("span")).innerHTML = "3mk Hekal";
  
  startGame();
}

let gameState = {
  score: 0,
  timeLeft: 60,
  combo: 1,
  maxCombo: 1,
  correctAnswers: 0,
  totalAnswered: 0,
  countries: [],
  timer: null,
  questionTypes: ['flag', 'capital', 'region', 'population', 'language']
};

async function fetchCountries() {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();
    gameState.countries = data
      .filter(c => c.name?.common && c.capital)
      .sort(() => Math.random() - 0.5);
  } catch (error) {
    console.error('Error fetching countries:', error);
  }
}

function startTimer() {
  updateTimerBar();
  gameState.timer = setInterval(() => {
    gameState.timeLeft--;
    document.getElementById('timer').textContent = gameState.timeLeft + 's';
    updateTimerBar();
    
    const timerEl = document.getElementById('timer');
    if (gameState.timeLeft <= 10) {
      timerEl.classList.add('timer-critical');
    } else if (gameState.timeLeft <= 30) {
      timerEl.classList.add('timer-warning');
    }
    
    if (gameState.timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function updateTimerBar() {
  const percentage = (gameState.timeLeft / 60) * 100;
  document.getElementById('timer-fill').style.width = percentage + '%';
}

function getQuestionType() {
  return gameState.questionTypes[Math.floor(Math.random() * gameState.questionTypes.length)];
}

function generateQuestion() {
  const questionType = getQuestionType();
  const correctCountry = gameState.countries[Math.floor(Math.random() * gameState.countries.length)];
  let questionText = '';
  let correctAnswer = '';
  let options = [];

  switch (questionType) {
    case 'flag':
      questionText = `Which country has this flag: ${correctCountry.flag || '🏳️'}?`;
      correctAnswer = correctCountry.name.common;
      options = getRandomCountryNames(correctCountry, 4);
      break;
    
    case 'capital':
      questionText = `What is the capital of ${correctCountry.name.common}?`;
      correctAnswer = correctCountry.capital[0];
      options = getRandomCapitals(correctCountry, 4);
      break;
    
    case 'region':
      questionText = `Which region is ${correctCountry.name.common} located in?`;
      correctAnswer = correctCountry.region;
      options = getRandomRegions(correctCountry);
      break;
    
    case 'population':
      questionText = `Approximately how many people live in ${correctCountry.name.common}?`;
      correctAnswer = formatPopulation(correctCountry.population);
      options = getPopulationOptions(correctCountry.population);
      break;
    
    case 'language':
      if (correctCountry.languages) {
        const langs = Object.values(correctCountry.languages);
        questionText = `Which language is spoken in ${correctCountry.name.common}?`;
        correctAnswer = langs[0];
        options = getRandomLanguages(correctCountry, 4);
      } else {
        return generateQuestion(); // Retry with different country
      }
      break;
  }

  return { questionText, correctAnswer, options };
}

function getRandomCountryNames(correct, count) {
  const options = [correct.name.common];
  const available = gameState.countries.filter(c => c.cca3 !== correct.cca3);
  
  while (options.length < count && available.length > 0) {
    const randomIndex = Math.floor(Math.random() * available.length);
    options.push(available.splice(randomIndex, 1)[0].name.common);
  }
  
  return options.sort(() => Math.random() - 0.5);
}

function getRandomCapitals(correct, count) {
  const options = [correct.capital[0]];
  const available = gameState.countries.filter(c => c.cca3 !== correct.cca3 && c.capital);
  
  while (options.length < count && available.length > 0) {
    const randomIndex = Math.floor(Math.random() * available.length);
    options.push(available.splice(randomIndex, 1)[0].capital[0]);
  }
  
  return options.sort(() => Math.random() - 0.5);
}

function getRandomRegions(correct) {
  const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  if (!regions.includes(correct.region)) {
    regions.push(correct.region);
  }
  return regions.sort(() => Math.random() - 0.5).slice(0, 4);
}

function formatPopulation(pop) {
  if (pop < 1000000) return 'Under 1 million';
  if (pop < 10000000) return '1-10 million';
  if (pop < 50000000) return '10-50 million';
  if (pop < 100000000) return '50-100 million';
  return 'Over 100 million';
}

function getPopulationOptions(correctPop) {
  const options = [
    'Under 1 million',
    '1-10 million',
    '10-50 million',
    '50-100 million',
    'Over 100 million'
  ];
  return options.sort(() => Math.random() - 0.5).slice(0, 4);
}

function getRandomLanguages(correct, count) {
  const correctLangs = correct.languages ? Object.values(correct.languages) : [];
  if (correctLangs.length === 0) return [];
  
  const options = [correctLangs[0]];
  const allLanguages = [];
  
  gameState.countries.forEach(c => {
    if (c.languages && c.cca3 !== correct.cca3) {
      allLanguages.push(...Object.values(c.languages));
    }
  });
  
  const uniqueLangs = [...new Set(allLanguages)];
  while (options.length < count && uniqueLangs.length > 0) {
    const randomIndex = Math.floor(Math.random() * uniqueLangs.length);
    options.push(uniqueLangs.splice(randomIndex, 1)[0]);
  }
  
  return options.sort(() => Math.random() - 0.5);
}

function loadQuestion() {
  const question = generateQuestion();
  
  document.getElementById('question-text').textContent = question.questionText;

  const optionsGrid = document.getElementById('options-grid');
  optionsGrid.innerHTML = '';

  question.options.forEach(option => {
    const button = document.createElement('button');
    button.className = 'option-btn';
    button.textContent = option;
    button.onclick = () => checkAnswer(option === question.correctAnswer, button, question.correctAnswer);
    optionsGrid.appendChild(button);
  });
}

function checkAnswer(isCorrect, button, correctAnswer) {
  const allButtons = document.querySelectorAll('.option-btn');
  allButtons.forEach(btn => btn.disabled = true);

  gameState.totalAnswered++;

  if (isCorrect) {
    button.classList.add('correct');
    const points = 10 * gameState.combo;
    gameState.score += points;
    gameState.correctAnswers++;
    gameState.combo++;
    gameState.maxCombo = Math.max(gameState.maxCombo, gameState.combo);
    gameState.timeLeft += 2; // Bonus time
  } else {
    button.classList.add('incorrect');
    gameState.combo = 1;
    allButtons.forEach(btn => {
      if (btn.textContent === correctAnswer) {
        btn.classList.add('correct');
      }
    });
  }

  document.getElementById('score').textContent = gameState.score;
  document.getElementById('combo').textContent = 'x' + gameState.combo;

  setTimeout(() => {
    loadQuestion();
  }, 800);
}

function endGame() {
  clearInterval(gameState.timer);
  document.getElementById('game-area').classList.add('hidden');
  const resultScreen = document.getElementById('result-screen');
  resultScreen.classList.remove('hidden');

  document.getElementById('final-score').textContent = gameState.score;
  document.getElementById('correct-answers').textContent = `${gameState.correctAnswers}/${gameState.totalAnswered}`;
  document.getElementById('max-combo').textContent = 'x' + gameState.maxCombo;

  document.getElementById('play-again-btn').onclick = () => location.reload();
  document.getElementById('back-home-btn').onclick = () => location.href = 'index.html';
}

async function startGame() {
  await fetchCountries();
  loadQuestion();
  startTimer();
}

initializePage();
