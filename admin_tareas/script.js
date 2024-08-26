const addTaskBtn = document.getElementById('add-task-btn');
const addTaskDesktop = document.getElementById('btn-desktop');
const taskModal = document.getElementById('task-modal');
const closeModalBtns = taskModal.querySelectorAll('.delete, #cancel-task-btn');
const saveTaskBtn = document.getElementById('save-task-btn');
const taskForm = document.getElementById('task-form');
const darkMode = document.getElementById('modo-oscuro');
// Variables globales
let tasks = []; // Arreglo para almacenar las tareas
let editingTask = null;
let mode = "Light";

// Renderizar las tareas automáticamente
function renderTasks() {
    // Limpiar todas las columnas pero mantener los títulos
    document.querySelectorAll('.box').forEach(box => {
        const title = box.querySelector('h2.subtitle').textContent.trim(); // Guardar el título de la columna
        box.innerHTML = `<h2 class="subtitle">${title}</h2>`; // Limpiar la columna
    });

    // Agregar las tareas a las columnas
    tasks.forEach(task => {
        const taskCard = generateTaskCard(task);

        // Encontrar la columna adecuada basándonos en el estado de la tarea
        const columns = document.querySelectorAll('.column');
        columns.forEach(column => {
            const subtitle = column.querySelector('h2.subtitle').textContent.trim();
            if (subtitle === task.status) {
                column.querySelector('.box').appendChild(taskCard);
            }
        });
    });

    // Asegúrate de no añadir múltiples veces los mismos event listeners
    document.querySelectorAll('.column .box').forEach(box => {
        box.removeEventListener('dragover', handleDragOver);
        box.removeEventListener('dragleave', handleDragLeave);
        box.removeEventListener('drop', handleDrop);

        box.addEventListener('dragover', handleDragOver);
        box.addEventListener('dragleave', handleDragLeave);
        box.addEventListener('drop', handleDrop);
    });
}


function handleDragOver(e) {
    e.preventDefault(); // Permitir soltar
    e.currentTarget.classList.add('drag-over'); // Agregar clase para retroalimentación visual
}

function handleDragLeave(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over'); // Quitar la retroalimentación visual cuando se sale de la columna
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over'); // Quitar la retroalimentación visual cuando se suelta la tarea
    const id = e.dataTransfer.getData('text/plain');
    const task = tasks.find(task => task.id == id);

    // Cambiar el estado de la tarea al de la columna actual
    const newStatus = e.currentTarget.closest('.column').querySelector('h2.subtitle').textContent.trim();
    if (task && task.status !== newStatus) {
        task.status = newStatus;
        renderTasks();
    }
}

function generateTaskCard(taskData) {
    const taskCard = document.createElement('div');
    taskCard.className = 'task';
    taskCard.draggable = true; // Hacer que la tarea sea draggable
    taskCard.dataset.taskId = taskData.id; // Almacenar el ID de la tarea en el dataset
    taskCard.innerHTML = `
        <div class="task-title">${taskData.title}</div>
        <p class="task-assigned">Asignado a: ${taskData.assigned}</p>
        <p class="task-priority">Prioridad: ${taskData.priority}</p>
        <p class="task-due-date">Fecha límite: ${taskData.dueDate}</p>
    `;

    // Evento dragstart para manejar el inicio del arrastre
    taskCard.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', taskData.id);
        setTimeout(() => {
            taskCard.style.display = 'none'; // Ocultar la tarjeta temporalmente
        }, 0);
    });

    // Mostrar la tarjeta nuevamente al finalizar el arrastre
    taskCard.addEventListener('dragend', (e) => {
        taskCard.style.display = 'block'; // Mostrar nuevamente el elemento arrastrado
    });

    // Añadir evento de clic para editar la tarea
    taskCard.addEventListener('click', function () {
        editingTask = tasks.find(task => task.id === taskData.id);
        openTaskModalForEditing(taskCard, taskData);
    });

    return taskCard;
}


// Crear nueva tarea
function createTask(taskData) {
    tasks.push(taskData); // Agregar la nueva tarea a la estructura de datos
    renderTasks(); // Renderizar nuevamente las tareas
}


// Editar tarea existente
function updateTask(taskIndex, taskData) {
    tasks[taskIndex] = taskData; // Actualizar la tarea en la estructura de datos
    renderTasks(); // Renderizar nuevamente las tareas
}


// Event listeners para abrir/cerrar modal y guardar tarea
addTaskBtn.addEventListener('click', () => {
    editingTask = false;
    taskForm.reset();
    taskModal.classList.add('is-active');
});

addTaskDesktop.addEventListener('click', () => {
    editingTask = false;
    taskForm.reset();
    taskModal.classList.add('is-active');
});

closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        taskModal.classList.remove('is-active');
    });
});

saveTaskBtn.addEventListener('click', () => {
    const taskData = {
        id: editingTask ? editingTask.id : Date.now(), // Generar un ID único si es una nueva tarea
        title: document.getElementById('task-title').value,
        description: document.getElementById('task-description').value,
        assigned: document.getElementById('task-assigned').value,
        priority: document.getElementById('task-priority').value,
        status: document.getElementById('task-status').value,
        dueDate: document.getElementById('task-due-date').value
    };
    if (editingTask) {
        // Actualizar tarea existente
        tasks = tasks.map(task => task.id === editingTask.id ? taskData : task);
    } else {
        // Crear nueva tarea
        tasks.push(taskData);
    }

    taskModal.classList.remove('is-active');
    renderTasks();
});


// Abrir modal para editar tarea
function openTaskModalForEditing(taskCard, taskData) {
    
    taskModal.classList.add('is-active');
    document.querySelector('.modal-card-title').textContent = 'Editar Tarea';
    document.getElementById('task-title').value = taskData.title;
    document.getElementById('task-description').value = taskData.description;
    document.getElementById('task-assigned').value = taskData.assigned;
    document.getElementById('task-priority').value = taskData.priority;
    document.getElementById('task-status').value = taskData.status;
    document.getElementById('task-due-date').value = taskData.dueDate;
}


// Modo Oscuro
function changeMode() {
    if (mode === "Light") {
        document.documentElement.style.setProperty("--background-color", "#121212");
        document.documentElement.style.setProperty("--font-color", "white");
        document.documentElement.style.setProperty("--primary-color", "rgb(52, 154, 52)");
        document.documentElement.style.setProperty("--light-background", "#1e1e1e");
        document.documentElement.style.setProperty("--very-light-background", "#333333");
        document.documentElement.style.setProperty("--create-task-button", "#99e9f2");
        document.documentElement.style.setProperty("--create-task-hover", "#7bbcc4");
        mode = "Dark";
    } 
    else 
    {
        document.documentElement.style.setProperty("--background-color", "#e8e8e8");
        document.documentElement.style.setProperty("--font-color", "black");
        document.documentElement.style.setProperty("--primary-color", "rgb(52, 52, 154)");
        document.documentElement.style.setProperty("--light-background", "#efefef");
        document.documentElement.style.setProperty("--very-light-background", "#f8f8f8");
        document.documentElement.style.setProperty("--create-task-button", "#99e9f2");
        document.documentElement.style.setProperty("--create-task-hover", "#7bbcc4");
        mode = "Light";
    }
}

darkMode.addEventListener('click', () => {
    changeMode();
});

// Inicializar el sistema
renderTasks();
changeMode();