import React, { useState, useEffect } from "react";
import "./App.css";

export function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  // Fetch todos from the backend
  const fetchTodos = async () => {
    try {
      const response = await fetch("http://localhost:8000/todos");
      const data = await response.json();
      console.log(data); // Log the response to verify it's an array
      setTodos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      try {
        const response = await fetch("http://localhost:8000/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ description: newTodo }),
        });
        if (response.ok) {
          setNewTodo("");
          fetchTodos(); // Refresh the todo list after adding a new todo
        } else {
          console.error("Failed to add todo");
        }
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  };

  return (
    <div className="App">
      <div>
        <h1>List of TODOs</h1>
        <ul>
          {todos.length > 0 ? (
            todos.map((todo) => <li key={todo._id}>{todo.description}</li>)
          ) : (
            <li>No todos available</li>
          )}
        </ul>
      </div>
      <div>
        <h1>Create a ToDo</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="todo">ToDo: </label>
            <input
              type="text"
              id="todo"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
          </div>
          <div style={{ marginTop: "5px" }}>
            <button type="submit">Add ToDo!</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
