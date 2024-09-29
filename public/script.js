document.getElementById('addTaskButton').addEventListener('click', addTask);

function addTask(event) {
    event.preventDefault();
    const inputTask = document.getElementById('inputTask');
    const todoval = inputTask.value.trim();

    if (todoval) {
        axios.post('http://localhost:3000/additem', { todoval })
            .then(response => {
                renderTodos(response.data);
                inputTask.value = '';
            })
            .catch(error => {
                console.error("Error adding task:", error);
            });
    } else {
        alert('Please enter a task!');
    }
}

// Load all todos on page load
window.onload = function() {
    axios.get('http://localhost:3000/todos')
        .then(response => {
            renderTodos(response.data);
        })
        .catch(error => {
            console.error("Error fetching tasks:", error);
        });
};

// Function to render todos
function renderTodos(todos) {
    const ul = document.getElementById('list');
    ul.innerHTML = ''; // Clear existing list

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.innerHTML = `
        <span>${todo.todoval}</span>
        <div>
            <button class="edit-btn" onclick="editTask(${todo.id}, '${todo.todoval}')">✏️</button>
            <button class="del-btn" onclick="deleteTask(${todo.id})">❌</button>
        </div>
    `;
    
        ul.appendChild(li);
    });
}

// Delete todo function
function deleteTask(id) {
    axios.delete(`http://localhost:3000/deleteitem/${id}`)
        .then(response => {
            renderTodos(response.data.todos);
            // alert(response.data.message);
        })
        .catch(error => {
            console.error("Error deleting task:", error);
        });
}

// Edit task function
function editTask(id, oldValue) {
    const newTask = prompt("Update the task", oldValue);
    if (newTask && newTask.trim() !== '') {
        axios.put(`http://localhost:3000/updateitem/${id}`, { todoval: newTask })
            .then(response => {
                alert(response.data.message);
                renderTodos(response.data.todos);
            })
            .catch(error => {
                console.error("Error updating task:", error);
            });
    }
}
