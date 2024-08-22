const addTaskBtn = document.getElementById('add-task-btn');
const taskModal = document.getElementById('task-modal');
const closeModalBtns = taskModal.querySelectorAll('.delete, #cancel-task-btn');
const saveTaskBtn = document.getElementById('save-task-btn');
const taskForm = document.getElementById('task-form');
const darkMode = document.getElementById('modo-oscuro');
let editingTask = null;
let mode = "Light";

// Abrir modal de nueva tarea
addTaskBtn.addEventListener('click', () => {
    editingTask = null;
    taskForm.reset();
    taskModal.classList.add('is-active');
});

// Cerrar modal
closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        taskModal.classList.remove('is-active');
    });
});

// Guardar tarea
saveTaskBtn.addEventListener('click', () => {
    const taskData = {
        title: document.getElementById('task-title').value,
        description: document.getElementById('task-description').value,
        assigned: document.getElementById('task-assigned').value,
        priority: document.getElementById('task-priority').value,
        status: document.getElementById('task-status').value,
        dueDate: document.getElementById('task-due-date').value
    };

    if (editingTask) {
        updateTask(editingTask, taskData);
    } else {
        createTask(taskData);
    }

    taskModal.classList.remove('is-active');
});


// Crear nueva tarea
function createTask(taskData) {
    const taskCard = generateTaskCard(taskData);
    const targetColumn = document.querySelector(`.column.${taskData.status.toLowerCase().replace(' ', '-')}-column .task-list`);
    targetColumn.appendChild(taskCard);
}


// Editar tarea existente
function updateTask(taskCard, taskData) {
    taskCard.querySelector('.task-title').textContent = taskData.title;
    taskCard.querySelector('.task-assigned').textContent = `Asignado a: ${taskData.assigned}`;
    taskCard.querySelector('.task-priority').textContent = `Prioridad: ${taskData.priority}`;
    taskCard.querySelector('.task-due-date').textContent = `Fecha límite: ${taskData.dueDate}`;

    // Mover la tarea a la columna correspondiente si se cambia el estado
    const currentColumn = taskCard.closest('.column').querySelector('.subtitle').textContent;
    if (currentColumn !== taskData.status) {
        const targetColumn = document.querySelector(`.column .box:has(h2.subtitle:contains("${taskData.status}")) .task-list`);
        targetColumn.appendChild(taskCard);
    }
}

// Generar la tarjeta de tarea en HTML
function generateTaskCard(taskData) {
    const taskCard = document.createElement('div');
    taskCard.className = 'task-card';
    taskCard.innerHTML = `
          <h3 class="task-title">${taskData.title}</h3>
          <p class="task-assigned">Asignado a: ${taskData.assigned}</p>
          <p class="task-priority">Prioridad: ${taskData.priority}</p>
          <p class="task-due-date">Fecha límite: ${taskData.dueDate}</p>
      `;

    taskCard.addEventListener('click', function () {
        editingTask = taskCard;
        openTaskModalForEditing(taskCard, taskData);
    });

    return taskCard;
}

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
function changeMode(btnOrigin){
    if(mode === "Light"){

        document.documentElement.style.setProperty("--background-color", "#121212");
        document.documentElement.style.setProperty("--font-color", "white");
        document.documentElement.style.setProperty("--primary-color", "rgb(52, 154, 52)");
        document.documentElement.style.setProperty("--light-background-color", "#1e1e1e");
        document.documentElement.style.setProperty("--very-light-background-color", "#333333");
        document.documentElement.style.setProperty("--create-task-button", "#99e9f2");
        document.documentElement.style.setProperty("--create-task-", "#7bbcc4");

        mode = "Dark";
        btnOrigin.textContent = "Modo Claro";
    }
    else{

        document.documentElement.style.setProperty("--background-color", "#eeeeee");
        document.documentElement.style.setProperty("--font-color", "black");
        document.documentElement.style.setProperty("--primary-color", "rgb(52, 154, 52)");
        document.documentElement.style.setProperty("--light-background-color", "#cccccc");
        document.documentElement.style.setProperty("--very-light-background-color", "#999999");
        document.documentElement.style.setProperty("--create-task-button", "#99e9f2");
        document.documentElement.style.setProperty("--create-task-hover", "#7bbcc4");

        mode = "Light";
        btnOrigin.textContent = "Modo Oscuro";
    }
}

darkMode.addEventListener('click', () => {
    changeMode(darkMode);
});

changeMode(darkMode);
