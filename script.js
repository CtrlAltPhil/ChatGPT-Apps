let currentQuestion = 0;
let score = 0;
let artifacts = [];

const img = document.getElementById('artifact-image');
const optionsDiv = document.getElementById('options');
const feedback = document.getElementById('feedback');
const nextBtn = document.getElementById('next-btn');
const progress = document.getElementById('progress');
const scoreboard = document.getElementById('scoreboard');
const finalScore = document.getElementById('final-score');

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function loadArtifacts() {
  const response = await fetch('artifacts.json');
  artifacts = await response.json();
  showQuestion();
}

function showQuestion() {
  const artifact = artifacts[currentQuestion];
  progress.textContent = `Question ${currentQuestion + 1} of ${artifacts.length}`;
  scoreboard.textContent = `Score: ${score}`;
  img.src = artifact.image;
  img.alt = artifact.name;
  optionsDiv.innerHTML = '';
  feedback.textContent = '';
  feedback.classList.remove('correct', 'incorrect');
  nextBtn.classList.add('hidden');

  const options = shuffle(artifact.options);
  options.forEach(option => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'option-btn';
    btn.textContent = option;
    btn.addEventListener('click', () => checkAnswer(btn, artifact));
    optionsDiv.appendChild(btn);
  });
}

function checkAnswer(selectedBtn, artifact) {
  const buttons = optionsDiv.querySelectorAll('button');
  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === artifact.name) {
      btn.classList.add('correct');
    }
  });

  feedback.classList.remove('correct', 'incorrect');

  if (selectedBtn.textContent === artifact.name) {
    score++;
    selectedBtn.classList.add('correct');
    feedback.classList.add('correct');
    feedback.innerHTML = `✅ Correct! <span class="fact">${artifact.fact}</span>`;
  } else {
    selectedBtn.classList.add('incorrect');
    feedback.classList.add('incorrect');
    feedback.innerHTML = `❌ Not quite. It was <strong>${artifact.name}</strong>. <span class="fact">${artifact.fact}</span>`;
  }

  scoreboard.textContent = `Score: ${score}`;
  nextBtn.classList.remove('hidden');
}

nextBtn.addEventListener('click', () => {
  currentQuestion++;
  if (currentQuestion < artifacts.length) {
    showQuestion();
  } else {
    endGame();
  }
});

function endGame() {
  document.getElementById('question-container').classList.add('hidden');
  progress.classList.add('hidden');
  nextBtn.classList.add('hidden');
  feedback.textContent = 'Quiz complete! Great exploration!';
  feedback.classList.remove('incorrect');
  feedback.classList.add('correct');
  finalScore.classList.remove('hidden');
  finalScore.textContent = `Final Score: ${score} out of ${artifacts.length}`;
}

loadArtifacts();
