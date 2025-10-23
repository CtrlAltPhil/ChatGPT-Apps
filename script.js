let currentQuestion = 0;
let score = 0;
let artifacts = [];

async function loadArtifacts() {
  const response = await fetch('artifacts.json');
  artifacts = await response.json();
  showQuestion();
}

function showQuestion() {
  const artifact = artifacts[currentQuestion];
  const img = document.getElementById('artifact-image');
  const optionsDiv = document.getElementById('options');
  const feedback = document.getElementById('feedback');
  const nextBtn = document.getElementById('next-btn');
  
  img.src = artifact.image;
  optionsDiv.innerHTML = '';
  feedback.textContent = '';
  nextBtn.classList.add('hidden');
  
  artifact.options.forEach(option => {
    const btn = document.createElement('button');
    btn.textContent = option;
    btn.onclick = () => checkAnswer(option, artifact.name);
    optionsDiv.appendChild(btn);
  });
}

function checkAnswer(selected, correct) {
  const feedback = document.getElementById('feedback');
  if (selected === correct) {
    feedback.textContent = '✅ Correct!';
    feedback.style.color = 'green';
    score++;
  } else {
    feedback.textContent = `❌ Incorrect! It was ${correct}.`;
    feedback.style.color = 'red';
  }
  document.getElementById('next-btn').classList.remove('hidden');
}

document.getElementById('next-btn').addEventListener('click', () => {
  currentQuestion++;
  if (currentQuestion < artifacts.length) {
    showQuestion();
  } else {
    endGame();
  }
});

function endGame() {
  document.getElementById('question-container').classList.add('hidden');
  document.getElementById('next-btn').classList.add('hidden');
  document.getElementById('score').classList.remove('hidden');
  document.getElementById('score').textContent = `You scored ${score} out of ${artifacts.length}!`;
}

loadArtifacts();
