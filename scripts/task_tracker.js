document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const taskListTitle = document.getElementById('task-list-title');

    const taskNameInput = form['task-name'];
    const taskPriorityInput = form['task-priority'];
    const taskDeadlineInput = form['task-deadline'];
    const taskDescriptionInput = form['task-description'];

    loadFormParams();

    taskNameInput.addEventListener('input', saveFormParams);
    taskPriorityInput.addEventListener('change', saveFormParams);
    taskDeadlineInput.addEventListener('change', saveFormParams);
    taskDescriptionInput.addEventListener('input', saveFormParams);

    loadTasksFromLocalStorage();

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const taskName = taskNameInput.value;
        const taskPriority = taskPriorityInput.value;
        const taskDeadline = taskDeadlineInput.value;
        const taskDescription = taskDescriptionInput.value;

        addTask(taskName, taskPriority, taskDeadline, taskDescription);

        form.reset();

        localStorage.removeItem('taskFormParams');
    });

    function saveFormParams() {
        const formParams = {
            taskName: taskNameInput.value,
            taskPriority: taskPriorityInput.value,
            taskDeadline: taskDeadlineInput.value,
            taskDescription: taskDescriptionInput.value
        };
        localStorage.setItem('taskFormParams', JSON.stringify(formParams));
    }

    function loadFormParams() {
        const savedParams = JSON.parse(localStorage.getItem('taskFormParams'));
        if (savedParams) {
            taskNameInput.value = savedParams.taskName || '';
            taskPriorityInput.value = savedParams.taskPriority || 'medium';
            taskDeadlineInput.value = savedParams.taskDeadline || '';
            taskDescriptionInput.value = savedParams.taskDescription || '';
        }
    }

    function addTask(name, priority, deadline, description) {
        const taskCard = document.createElement('div');
        taskCard.classList.add('task-card');

        taskCard.innerHTML = `
            <h3>${name}</h3>
            <p class="priority ${priority}">Приоритет: ${priority}</p>
            <p>Дедлайн: ${deadline}</p>
            <p>${description}</p>
            <button class="delete-task">Удалить задачу</button>
        `;

        const deleteButton = taskCard.querySelector('.delete-task');
        deleteButton.addEventListener('click', () => {
            taskCard.remove();
            saveTasksToLocalStorage();
            toggleTaskListTitle();
        });

        taskList.appendChild(taskCard);

        toggleTaskListTitle();
        saveTasksToLocalStorage();
    }

    function toggleTaskListTitle() {
        if (taskList.children.length > 0) {
            taskListTitle.style.display = 'block';
        } else {
            taskListTitle.style.display = 'none';
        }
    }

    function saveTasksToLocalStorage() {
        const tasks = [];
        taskList.querySelectorAll('.task-card').forEach(taskCard => {
            const name = taskCard.querySelector('h3').textContent;
            const priority = taskCard.querySelector('.priority').textContent.replace('Приоритет: ', '');
            const deadline = taskCard.querySelector('p:nth-of-type(2)').textContent.replace('Дедлайн: ', '');
            const description = taskCard.querySelector('p:nth-of-type(3)').textContent;

            tasks.push({ name, priority, deadline, description });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            addTask(task.name, task.priority, task.deadline, task.description);
        });
    }
});
