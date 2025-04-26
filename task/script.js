const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const filterTasks = document.getElementById('filterTasks');
const sortNewestBtn = document.getElementById('sortNewestBtn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let newestFirst = false;

window.onload = renderTasks;

addTaskBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (text) {
      const task = {
        id: Date.now(),
        text,
        completed: (filterTasks.value === 'completed') ? true : false // 👈 smart fix!
      };
      tasks.push(task);
      saveTasks();
      renderTasks();
      taskInput.value = '';
    }
  });
  

function createTaskElement(task) {
    const li = document.createElement('li');
    li.dataset.id = task.id;
  
    const emoji = task.completed ? '✅' : '🕒';
  
    li.innerHTML = `
      <span class="task-text">${task.text}</span>
      <div class="task-actions">
        <span class="task-status">${emoji}</span>
        <button class="deleteBtn">Delete</button>
      </div>
    `;
  
    if (task.completed) li.classList.add('completed');
  
    // Toggle completed when clicking on text
    li.querySelector('.task-text').addEventListener('click', () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });
  
    // Delete task
    li.querySelector('.deleteBtn').addEventListener('click', (e) => {
      e.stopPropagation();
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    });
  
    return li;
  }
  
  
  function renderTasks() {
    taskList.innerHTML = '';
  
    let filteredTasks = [...tasks]; // copy the tasks array
  
    // Proper filtering based on task.completed value
    if (filterTasks.value === 'completed') {
      filteredTasks = filteredTasks.filter(task => task.completed === true);
    } else if (filterTasks.value === 'pending') {
      filteredTasks = filteredTasks.filter(task => task.completed === false);
    }
  
    if (newestFirst) {
      filteredTasks.sort((a, b) => b.id - a.id); // Newest first
    }
  
    filteredTasks.forEach(task => {
      const li = createTaskElement(task);
      taskList.appendChild(li);
    });
  }
  

filterTasks.addEventListener('change', renderTasks);

sortNewestBtn.addEventListener('click', () => {
  newestFirst = !newestFirst;
  renderTasks();
});

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
