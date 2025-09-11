let todos = [];
let todoId = 0;

// Load todos from localStorage
function loadTodos() {
    const savedTodos = localStorage.getItem('awsmTodos');
    if (savedTodos) {
        todos = JSON.parse(savedTodos);
        todoId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 0;
    }
}

// Save todos to localStorage
function saveTodos() {
    localStorage.setItem('awsmTodos', JSON.stringify(todos));
}

const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const clearCompleted = document.getElementById('clearCompleted');
const stats = document.getElementById('stats');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Add todo
function addTodo() {
    const text = todoInput.value.trim();
    if (!text) return;
    
    const todo = {
        id: todoId++,
        text: text,
        completed: false
    };
    
    todos.push(todo);
    todoInput.value = '';
    saveTodos();
    renderTodos();
}

// Toggle todo completion
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

// Delete todo
function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveTodos();
    renderTodos();
}

// Clear completed todos
function clearCompletedTodos() {
    todos = todos.filter(t => !t.completed);
    saveTodos();
    renderTodos();
}

// Render todos
function renderTodos() {
    todoList.innerHTML = '';
    
    if (todos.length === 0) {
        todoList.innerHTML = '<li class="empty-state">No tasks yet. Add one above!</li>';
    } else {
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} 
                       onchange="toggleTodo(${todo.id})">
                <span class="todo-text">${todo.text}</span>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
            `;
            
            todoList.appendChild(li);
        });
    }
    
    updateStats();
}

// Update statistics
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const remaining = total - completed;
    
    stats.innerHTML = `<span>${total} tasks total • ${completed} completed • ${remaining} remaining</span>`;
    
    // Show/hide clear button based on completed tasks
    if (completed > 0) {
        clearCompleted.style.display = 'block';
    } else {
        clearCompleted.style.display = 'none';
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

// Event listeners
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});
clearCompleted.addEventListener('click', clearCompletedTodos);
hamburger.addEventListener('click', toggleMobileMenu);

// Initialize app
loadTodos();
renderTodos();