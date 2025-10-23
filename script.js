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

function escapeForSvg(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function wrapLabel(text) {
  const words = text.split(' ');
  const lines = [];
  let current = '';

  words.forEach(word => {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > 12 && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  });

  if (current) {
    lines.push(current);
  }

  if (lines.length > 3) {
    const first = lines.shift();
    const merged = lines.join(' ');
    return [first, merged];
  }

  return lines;
}

function createArtifactGraphic(artifact) {
  const background = artifact.backgroundColor || '#fdf2d0';
  const accent = artifact.accentColor || '#8b5e3c';
  const emoji = artifact.emoji || '🏺';
  const labelLines = wrapLabel(artifact.name);
  const lineGap = 44;
  const startY = 320 - ((labelLines.length - 1) * lineGap) / 2;
  const labelSvg = labelLines
    .map((line, index) => {
      const dy = index === 0 ? 0 : lineGap;
      return `<tspan x="50%" dy="${dy}" xml:space="preserve">${escapeForSvg(line)}</tspan>`;
    })
    .join('');

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480" role="img" aria-labelledby="title">
    <title id="title">${escapeForSvg(artifact.name)}</title>
    <defs>
      <linearGradient id="shadow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#000000" stop-opacity="0.08" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0.18" />
      </linearGradient>
    </defs>
    <rect x="24" y="36" width="432" height="408" rx="42" fill="url(#shadow)" opacity="0.3" />
    <rect x="16" y="16" width="448" height="408" rx="48" fill="${escapeForSvg(background)}" />
    <text x="50%" y="48%" text-anchor="middle" font-size="180" dominant-baseline="middle">${escapeForSvg(emoji)}</text>
    <text x="50%" y="${startY}" text-anchor="middle" font-size="48" fill="${escapeForSvg(accent)}" font-family="'Segoe UI', 'Helvetica Neue', sans-serif" font-weight="600">${labelSvg}</text>
  </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

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
  if (!artifact.generatedImage) {
    artifact.generatedImage = createArtifactGraphic(artifact);
  }
  const imageSource = artifact.image && artifact.image.trim() ? artifact.image : artifact.generatedImage;
  img.src = imageSource;
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
