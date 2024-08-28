const addTaskBtn = document.getElementById('add-task-btn');
const addTaskDesktop = document.getElementById('btn-desktop');
const taskModal = document.getElementById('task-modal');
const closeModalBtns = taskModal.querySelectorAll('.delete, #cancel-task-btn');
const saveTaskBtn = document.getElementById('save-task-btn');
const taskForm = document.getElementById('task-form');
const darkMode = document.getElementById('modo-oscuro');
let editingTask = null;
let mode = "Light";

// Abrir modal de nueva tarea
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

// Agregamos un event listener para el botón de modo oscuro
document.getElementById("modo-oscuro").addEventListener("click", function () {
    // Alterna entre las clases 'light-mode' y 'dark-mode' (por defecto sin la clase es modo oscuro)
    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {
        this.classList.add("light-mode");  // Cambia la imagen del botón para modo claro
    } else {
        this.classList.remove("light-mode");  // Cambia la imagen del botón para modo oscuro
    }
});

// Crear nueva tarea
function createTask(taskData) {
    const taskCard = generateTaskCard(taskData);

    // Seleccionar la columna correcta según el estado de la tarea
    const targetColumn = document.querySelector(`.column .box h2.subtitle`).closest('.columns-container').querySelectorAll('.box');
    for (let box of targetColumn) {
        if (box.querySelector('h2.subtitle').textContent === taskData.status) {
            box.appendChild(taskCard);
            break;
        }
    }
}

// Editar tarea existente
function updateTask(taskCard, taskData) {
    taskCard.querySelector('.task-title').textContent = taskData.title;
    taskCard.querySelector('.task-assigned').textContent = `Asignado a: ${taskData.assigned}`;
    taskCard.querySelector('.task-priority').textContent = `Prioridad: ${taskData.priority}`;
    taskCard.querySelector('.task-due-date').textContent = `Fecha límite: ${taskData.dueDate}`;

    // Obtener todas las columnas
    const columns = document.querySelectorAll('.column');

    // Buscar la columna que contiene el subtítulo correspondiente al estado de la tarea
    let targetColumn = null;
    columns.forEach(column => {
        const subtitle = column.querySelector('.subtitle');
        if (subtitle && subtitle.textContent.trim() === taskData.status) {
            targetColumn = column.querySelector('.box');
        }
    });

    // Mover la tarjeta de la tarea a la columna encontrada
    if (targetColumn) {
        targetColumn.appendChild(taskCard);
    }
}

// Generar la tarjeta de tarea en HTML
function generateTaskCard(taskData) {
    const taskCard = document.createElement('div');
    taskCard.className = 'task';
    taskCard.innerHTML = `
        <div class="task-title">${taskData.title}</div>
        <p class="task-assigned">Asignado a: ${taskData.assigned}</p>
        <p class="task-priority">Prioridad: ${taskData.priority}</p>
        <p class="task-due-date">Fecha límite: ${taskData.dueDate}</p>
        <button class="deleteButton"></button>
    `;

    // Añadir evento de clic para editar la tarea
    taskCard.addEventListener('click', function () {
        editingTask = taskCard;
        openTaskModalForEditing(taskCard, taskData);
    });

    taskCard.querySelector('.deleteButton').addEventListener('click', function (event) {
        event.stopPropagation(); // Prevenir que se dispare el evento de editar tarea
        taskCard.remove(); // Eliminar la tarjeta de tarea del DOM
    });

    taskCard.querySelector('.deleteButton').addEventListener('mouseenter', function () {
        taskCard.querySelector('.deleteButton').style.backgroundColor = 'red';
    });

    taskCard.querySelector('.deleteButton').addEventListener('mouseout', function () {
        taskCard.querySelector('.deleteButton').style.backgroundColor = 'gray';
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

//Funcion Drag and Drop
function drag(ev) {
    ev.preventDefault();
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    let id = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(id));
}

function allowDrop(ev) {
    ev.preventDefault();
}

// Modo Oscuro
function changeMode(btnOrigin) {
    if (mode === "Light") {

        document.documentElement.style.setProperty("--background-color", "#121212");
        document.documentElement.style.setProperty("--font-color", "white");
        document.documentElement.style.setProperty("--primary-color", "rgb(52, 154, 52)");
        document.documentElement.style.setProperty("--light-background", "#1e1e1e");
        document.documentElement.style.setProperty("--very-light-background", "#333333");
        document.documentElement.style.setProperty("--create-task-button", "#99e9f2");
        document.documentElement.style.setProperty("--create-task-", "#7bbcc4");

        mode = "Dark";
    }
    else {

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
    changeMode(darkMode);
});

changeMode(darkMode);