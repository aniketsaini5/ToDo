const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware for CORS
app.use(cors({
    origin: ['https://my-todo-s.vercel.app', 'http://localhost:3000']
}));

// Middleware to serve static files from the "public" folder
app.use(express.static('public'));

// Middleware to parse JSON data
app.use(express.json());

// Initialize an array to store todos
let todos = [
    { id: 1, todoval: "Buy Milk" },
    { id: 2, todoval: "Complete the project" },
    { id: 3, todoval: "Play Game" }
];

// // Route to serve the HTML page
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// Route to get all todos
app.get('/todos', (req, res) => {
    res.send(todos);
});

// Route to add a new todo (Create)
app.post('/additem', (req, res) => {
    const newTodoVal = req.body.todoval;
    if (!newTodoVal || typeof newTodoVal !== 'string') {
        return res.status(400).send({ message: "Invalid input" });
    }

    const newTodo = {
        id: todos.length + 1,
        todoval: newTodoVal
    };
    todos.push(newTodo);
    res.status(201).send(todos);
});

// Route to delete a todo (Delete)
app.delete('/deleteitem/:id', (req, res) => {
    const todoId = parseInt(req.params.id);
    todos = todos.filter(todo => todo.id !== todoId);
    res.send({ message: "Todo deleted successfully", todos });
});

// Route to update a todo (Update)
app.put('/updateitem/:id', (req, res) => {
    const todoId = parseInt(req.params.id);
    const updatedTodoVal = req.body.todoval;

    if (!updatedTodoVal || typeof updatedTodoVal !== 'string') {
        return res.status(400).send({ message: "Invalid input" });
    }

    const todoIndex = todos.findIndex(todo => todo.id === todoId);
    
    if (todoIndex !== -1) {
        todos[todoIndex].todoval = updatedTodoVal;
        res.send({ message: "Todo updated successfully", todos });
    } else {
        res.status(404).send({ message: "Todo not found" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
