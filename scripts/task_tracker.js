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

        const taskName = taskNameInput.value.trim();
        const taskPriority = taskPriorityInput.value;
        const taskDeadline = taskDeadlineInput.value;
        const taskDescription = taskDescriptionInput.value.trim();

        // Валидация ввода
        if (!validateTaskName(taskName)) {
            alert('Название задачи не должно содержать специальных символов и не может быть пустым.');
            return;
        }

        if (!validateDate(taskDeadline)) {
            alert('Пожалуйста, введите корректную дату дедлайна.');
            return;
        }

        addTask(taskName, taskPriority, taskDeadline, taskDescription);

        form.reset();

        localStorage.removeItem('taskFormParams');
    });

    // used with outer lib
    function validateTaskName(name) {
        if (!name || name.length === 0) {
            return false;
        }
        return validator.isLength(name, { min: 1, max: 100 }) && 
               validator.matches(name, /^[a-zA-Zа-яА-Я0-9\s.,!?()\-]+$/u);
    }

    // used with outer lib
    function validateDate(dateString) {
        if (!dateString) {
            return false;
        }
        const currentDate = new Date();
        const inputDate = new Date(dateString);
        return validator.isDate(dateString) && inputDate >= currentDate.setHours(0, 0, 0, 0);
    }

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
        const template = document.getElementById('task-card-template');
        const taskCard = template.content.cloneNode(true);

        taskCard.querySelector('h3').textContent = name;
        const priorityElement = taskCard.querySelector('.priority');
        priorityElement.textContent = `Приоритет: ${priority}`;
        priorityElement.classList.add(priority);

        taskCard.querySelector('.deadline').textContent = `Дедлайн: ${deadline}`;
        taskCard.querySelector('.description').textContent = description;

        const deleteButton = taskCard.querySelector('.delete-task');
        deleteButton.addEventListener('click', () => {
            deleteButton.closest('.task-card').remove();
            saveTasksToLocalStorage();
            toggleTaskListTitle();
        });

        taskList.appendChild(taskCard);

        toggleTaskListTitle();
        saveTasksToLocalStorage();
    }

    function addTask(name, priority, deadline, description) {
        const template = document.getElementById('task-card-template');
        const taskCardContent = template.content.cloneNode(true);

        const taskCard = taskCardContent.querySelector('.task-card');

        taskCard.querySelector('h3').textContent = name;

        const priorityElement = taskCard.querySelector('.priority');
        priorityElement.textContent = `Приоритет: ${priority}`;
        priorityElement.classList.add(priority);

        const deadlineElement = taskCard.querySelector('.deadline');
        deadlineElement.textContent = `Дедлайн: ${deadline}`;

        taskCard.querySelector('.description').textContent = description;

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
            const priorityElement = taskCard.querySelector('.priority');
            const priority = priorityElement.textContent.replace('Приоритет: ', '');
            const deadline = taskCard.querySelector('.deadline').textContent.replace('Дедлайн: ', '');
            const description = taskCard.querySelector('.description').textContent;

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
