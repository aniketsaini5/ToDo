// Add event listener to the "Add Task" button
document.getElementById('addTaskButton').addEventListener('click', addTask);

// Function to add a new task
function addTask(event) {
    event.preventDefault(); // Prevent the default form submission
    const inputTask = document.getElementById('inputTask');
    const todoval = inputTask.value.trim(); // Get the task value

    if (todoval) {
        axios.post('/additem', { todoval }) // Use relative path for the deployed environment
            .then(response => {
                renderTodos(response.data); // Render the updated todo list
                inputTask.value = ''; // Clear the input field
            })
            .catch(error => {
                console.error("Error adding task:", error);
                alert("Failed to add task. Please try again."); // User feedback on error
            });
    } else {
        alert('Please enter a task!'); // Alert if input is empty
    }
}

// Load all todos on page load
window.onload = function() {
    axios.get('/todos') // Use relative path for the deployed environment
        .then(response => {
            renderTodos(response.data); // Render the todo list
        })
        .catch(error => {
            console.error("Error fetching tasks:", error);
            alert("Failed to fetch tasks. Please try again."); // User feedback on error
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
        ul.appendChild(li); // Append the new list item to the ul
    });
}

// Delete todo function
function deleteTask(id) {
    axios.delete(`/deleteitem/${id}`) // Use relative path for the deployed environment
        .then(response => {
            renderTodos(response.data.todos); // Render the updated todo list
            alert(response.data.message); // Notify user of successful deletion
        })
        .catch(error => {
            console.error("Error deleting task:", error);
            alert("Failed to delete task. Please try again."); // User feedback on error
        });
}

// Edit task function
function editTask(id, oldValue) {
    const newTask = prompt("Update the task", oldValue); // Prompt user for new task value
    if (newTask && newTask.trim() !== '') {
        axios.put(`/updateitem/${id}`, { todoval: newTask }) // Use relative path for the deployed environment
            .then(response => {
                alert(response.data.message); // Notify user of successful update
                renderTodos(response.data.todos); // Render the updated todo list
            })
            .catch(error => {
                console.error("Error updating task:", error);
                alert("Failed to update task. Please try again."); // User feedback on error
            });
    }
}
