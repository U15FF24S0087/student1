const taskForm = document.getElementById('taskForm');
const taskNameInput = document.getElementById('taskName');
const taskDueInput = document.getElementById('taskDue');
const taskList = document.getElementById('taskList');
const timerDisplay = document.getElementById('timerDisplay');
const startTimer = document.getElementById('startTimer');
const resetTimer = document.getElementById('resetTimer');
const gpaForm = document.getElementById('gpaForm');
const gpaResult = document.getElementById('gpaResult');
const notesInput = document.getElementById('notesInput');
const saveNotes = document.getElementById('saveNotes');

let tasks = JSON.parse(localStorage.getItem('studentProTasks') || '[]');
let notesText = localStorage.getItem('studentProNotes') || '';
let timerSeconds = 25 * 60;
let timerInterval = null;

function saveTasks() {
  localStorage.setItem('studentProTasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';
  if (tasks.length === 0) {
    taskList.innerHTML = '<li class="task-item"><span>No tasks yet. Add one to stay on track.</span></li>';
    return;
  }

  tasks.forEach((task, index) => {
    const item = document.createElement('li');
    item.className = 'task-item';
    item.innerHTML = `
      <div>
        <span>${task.name}</span>
        <small>${task.due ? 'Due ' + task.due : 'No due date'}</small>
      </div>
      <button type="button" data-index="${index}">Remove</button>
    `;

    taskList.appendChild(item);
  });
}

function updateTimerDisplay() {
  const minutes = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
  const seconds = String(timerSeconds % 60).padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

function startStudyTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      timerDisplay.textContent = '00:00';
      startTimer.textContent = 'Start';
      return;
    }
    timerSeconds -= 1;
    updateTimerDisplay();
  }, 1000);
  startTimer.textContent = 'Running';
}

function resetStudyTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timerSeconds = 25 * 60;
  updateTimerDisplay();
  startTimer.textContent = 'Start';
}

function calculateGPA(values) {
  const grades = values.filter((value) => value !== '');
  if (grades.length === 0) {
    return '-';
  }
  const total = grades.reduce((sum, grade) => sum + Number(grade), 0);
  const average = total / grades.length;
  return (average / 20).toFixed(2);
}

function loadNotes() {
  notesInput.value = notesText;
}

function initialize() {
  renderTasks();
  updateTimerDisplay();
  loadNotes();
}

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const taskName = taskNameInput.value.trim();
  const taskDue = taskDueInput.value;
  if (!taskName) return;

  tasks.unshift({ name: taskName, due: taskDue });
  saveTasks();
  renderTasks();
  taskForm.reset();
  taskNameInput.focus();
});

taskList.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  const index = Number(button.dataset.index);
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
});

startTimer.addEventListener('click', startStudyTimer);
resetTimer.addEventListener('click', resetStudyTimer);

gpaForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const grades = [
    document.getElementById('grade1').value,
    document.getElementById('grade2').value,
    document.getElementById('grade3').value,
  ];
  gpaResult.textContent = calculateGPA(grades);
});

saveNotes.addEventListener('click', () => {
  notesText = notesInput.value.trim();
  localStorage.setItem('studentProNotes', notesText);
  saveNotes.textContent = 'Saved';
  setTimeout(() => {
    saveNotes.textContent = 'Save Notes';
  }, 1400);
});

initialize();
