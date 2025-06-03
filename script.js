let tabCount = 0;
let timeLeft = 60;
let timer = null;
let isRunning = false;
let tabHistory = [];
let chart = null;

const durationInput = document.getElementById('durationInput');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const timeDisplay = document.getElementById('timeDisplay');
const countDisplay = document.getElementById('countDisplay');
const tabChart = document.getElementById('tabChart');

function updateDisplay() {
  timeDisplay.textContent = timeLeft;
  countDisplay.textContent = tabCount;
}

function showChart() {
  tabChart.style.display = 'block';
  const labels = Array.from({ length: tabHistory.length }, (_, i) => i + 1);
  if (chart) chart.destroy();
  chart = new Chart(tabChart, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Tab Presses per Second',
        data: tabHistory,
        backgroundColor: '#1976d2',
      }]
    },
    options: {
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true, precision: 0 }
      }
    }
  });
}

function startTimer() {
  if (isRunning) return;
  tabCount = 0;
  tabHistory = [];
  timeLeft = parseInt(durationInput.value) || 60;
  updateDisplay();
  isRunning = true;
  startBtn.disabled = true;
  stopBtn.disabled = false;
  durationInput.disabled = true;
  tabChart.style.display = 'none';

  let lastTabCount = 0;
  timer = setInterval(() => {
    tabHistory.push(tabCount - lastTabCount);
    lastTabCount = tabCount;
    timeLeft--;
    updateDisplay();
    if (timeLeft <= 0) {
      stopTimer();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
  isRunning = false;
  startBtn.disabled = false;
  stopBtn.disabled = true;
  durationInput.disabled = false;
  showChart();
}

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);

// Listen for Tab key globally so focus doesn't matter
window.addEventListener('keydown', (e) => {
  if (isRunning && e.key === 'Tab') {
    e.preventDefault();
    tabCount++;
    updateDisplay();
    countDisplay.classList.remove('pop');
    void countDisplay.offsetWidth;
    countDisplay.classList.add('pop');
  }
});
