document.getElementById('addTaskButton').addEventListener('click', addTask);

function addTask(event) {
    event.preventDefault();
    const inputTask = document.getElementById('inputTask');
    const todoval = inputTask.value.trim();

    if (todoval) {
        axios.post('/additem', { todoval })
            .then(response => {
                renderTodos(response.data);
                inputTask.value = '';
            })
            .catch(error => {
                console.error("Error adding task:", error);
                alert("Failed to add task. Please try again.");
            });
    } else {
        alert('Please enter a task!');
    }
}

//Load all todos on page load
window.onload = function () {
    axios.get('/todos')
        .then(response => {
            renderTodos(response.data);
        })
        .catch(error => {
            console.error("Error fetching tasks:", error);
            alert("Failed to fetch tasks. Please try again.");
        });
};

function renderTodos(todos) {
    const ul = document.getElementById('list');
    ul.innerHTML = '';

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="todo-content">
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} onclick="toggleComplete(${todo.id})">
                <span class="${todo.completed ? 'completed' : ''}">${todo.todoval}</span>
            </div>
            <div class="buttons">
                <button class="edit-btn" onclick="editTask(${todo.id}, '${todo.todoval}')">✎</button>
                <button class="del-btn" onclick="deleteTask(${todo.id})">✕</button>
            </div>
        `;
        ul.appendChild(li);
    });
}


function toggleComplete(id) {
    // Get the checkbox and determine if it's checked
    const checkbox = document.querySelector(`input[type="checkbox"][onclick="toggleComplete(${id})"]`);
    const completed = checkbox.checked;

    // Find the corresponding <span> element (the sibling of the checkbox)
    const todoItem = checkbox.nextElementSibling;

    // Add or remove the 'completed' class based on checkbox state
    if (completed) {
        todoItem.classList.add('completed');
    } else {
        todoItem.classList.remove('completed');
    }
}


function deleteTask(id) {
    axios.delete(`/deleteitem/${id}`)
        .then(response => {
            renderTodos(response.data.todos);
        })
        .catch(error => {
            console.error("Error deleting task:", error);
            alert("Failed to delete task. Please try again.");
        });
}

function editTask(id, oldValue) {
    const newTask = prompt("Update the task", oldValue);
    if (newTask && newTask.trim() !== '') {
        axios.put(`/updateitem/${id}`, { todoval: newTask })
            .then(response => {
                renderTodos(response.data.todos);
            })
            .catch(error => {
                console.error("Error updating task:", error);
                alert("Failed to update task. Please try again.");
            });
    }
}
