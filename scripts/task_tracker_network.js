document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('tasks-preloader');
    const errorContainer = document.getElementById('tasks-error-container');
    const taskList = document.getElementById('task-list');
    const taskListTitle = document.getElementById('task-list-title');
    const loadApiTasksButton = document.getElementById('load-api-tasks');
    const API_URL = 'https://jsonplaceholder.typicode.com/todos';
    let filterFlag = JSON.parse(localStorage.getItem('filterFlag')) || null;
    function getFilterFlag() {
        if (filterFlag === null) {
            filterFlag = Math.random() > 0.5 ? 'gt50' : 'le50';
            localStorage.setItem('filterFlag', JSON.stringify(filterFlag));
        }
        return filterFlag;
    }
    function resetFilterFlag() {
        filterFlag = null;
        localStorage.removeItem('filterFlag');
    }
    function showPreloader() {
        preloader.style.display = 'flex';
    }
    function hidePreloader() {
        preloader.style.display = 'none';
    }
    function showError() {
        errorContainer.style.display = 'flex';
    }
    function hideError() {
        errorContainer.style.display = 'none';
    }
    function renderFetchedTasks(tasks) {
        tasks.forEach(task => {
            const template = document.getElementById('task-card-template');
            const taskCardContent = template.content.cloneNode(true);
            const taskCard = taskCardContent.querySelector('.task-card');
            taskCard.querySelector('h3').textContent = task.title;
            const priorityElement = taskCard.querySelector('.priority');
            priorityElement.textContent = `Приоритет: ${task.completed ? 'Высокий' : 'Низкий'}`;
            priorityElement.classList.add(task.completed ? 'high' : 'low');
            const deadlineElement = taskCard.querySelector('.deadline');
            const randomDays = Math.floor(Math.random() * 30) + 1;
            const deadlineDate = new Date();
            deadlineDate.setDate(deadlineDate.getDate() + randomDays);
            const deadlineStr = deadlineDate.toISOString().split('T')[0];
            deadlineElement.textContent = `Дедлайн: ${deadlineStr}`;
            const descriptionElement = taskCard.querySelector('.description');
            descriptionElement.textContent = `Описание задачи: ${task.title}`;
            const deleteButton = taskCard.querySelector('.delete-task');
            deleteButton.addEventListener('click', () => {
                taskCard.remove();
                toggleTaskListTitle();
            });
            taskList.appendChild(taskCard);
        });
        toggleTaskListTitle();
    }
    function loadTasksFromAPI() {
        showPreloader();
        hideError();
    
        let url = API_URL;
        const flag = getFilterFlag();
        if (flag === 'gt50') {
            url += '?id_gte=51';
        } else if (flag === 'le50') {
            url += '?id_lte=50';
        }
    
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Сетевая ошибка: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                hidePreloader();
                const shuffledTasks = data.sort(() => Math.random() - 0.5);
                const halfTasks = shuffledTasks.slice(0, Math.ceil(shuffledTasks.length / 2));
                renderFetchedTasks(halfTasks);
            })
            .catch(error => {
                hidePreloader();
                showError();
                console.error('Ошибка при загрузке задач:', error);
            });
    }    
    function toggleTaskListTitle() {
        if (taskList.children.length > 0) {
            taskListTitle.style.display = 'block';
        } else {
            taskListTitle.style.display = 'none';
        }
    }
    loadApiTasksButton.addEventListener('click', loadTasksFromAPI);
});