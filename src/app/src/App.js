import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [description, setDescription] = useState("");

  // Fetch TODOs from the backend
  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://localhost:8000/todos/");
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching TODOs:", error);
    }
  };

  // Handle form submission to create a new TODO
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/todos/", { description });
      setDescription("");
      fetchTodos();
    } catch (error) {
      console.error("Error creating TODO:", error);
    }
  };

  // Fetch TODOs on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="App">
      <div>
        <h1>List of TODOs</h1>
        {todos.length === 0 ? (
          <p>No todos till now</p>
        ) : (
          <div>
            {todos.map((todo) => (
              <p key={todo.id}>{todo.description}</p>
            ))}
          </div>
        )}
      </div>

      <div>
        <h1>Create a ToDo</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="todo">ToDo: </label>
            <input
              type="text"
              id="todo"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter TODO description"
              required
            />
          </div>
          <div style={{ marginTop: "5px" }}>
            <button type="submit">Add TODO</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
