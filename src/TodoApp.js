import React, { useState, useEffect } from 'react';
import {
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Tabs,
  Tab,
} from '@mui/material';

function TodoApp() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = () => {
    if (!newTodo.trim()) return;
    const todo = {
      id: Date.now(),
      text: newTodo.trim(),
      checked: false,
      created_at: new Date().toISOString(),
      completed_at: null,
    };
    setTodos(prev => [...prev, todo]);
    setNewTodo('');
  };

  const handleToggle = (id) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id
          ? {
              ...todo,
              checked: !todo.checked,
              completed_at: !todo.checked ? new Date().toISOString() : null,
            }
          : todo
      )
    );
  };

  const handleDelete = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const sortedTodos = [...todos]
  .filter(todo => {
    if (filter === 'active') return !todo.checked;
    if (filter === 'completed') return todo.checked;
    return true; // 'all'
  })
  .sort((a, b) => {
    // Same status: sort within group
    if (a.checked === b.checked) {
      return a.checked
        ? new Date(a.completed_at) - new Date(b.completed_at) // completed: ascending
        : new Date(b.created_at) - new Date(a.created_at);     // active: descending
    }
    // Ensure unchecked items (active) come first
    return a.checked - b.checked;
  });


  return (
    <div className="max-w-lg w-full mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">📝 Todo List</h1>

      {/* Input */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <TextField
          label="Add a new todo"
          variant="outlined"
          size="small"
          fullWidth
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button
          onClick={handleAddTodo}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add
        </button>
      </div>

      {/* Filter Tabs */}
      <Paper className="mb-4">
        <Tabs
          value={filter}
          onChange={(e, newValue) => setFilter(newValue)}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="All" value="all" />
          <Tab label="Active" value="active" />
          <Tab label="Completed" value="completed" />
        </Tabs>
      </Paper>

      {/* Todo List */}
      <Paper className="shadow-md">
        <List>
  {sortedTodos.length === 0 ? (
    <p className="text-center text-gray-500 py-6">No todos found.</p>
  ) : (
    sortedTodos.map(todo => (
      <ListItem
        key={todo.id}
        className={`group transition duration-200 ${
          todo.checked ? 'line-through text-gray-500' : ''
        }`}
        secondaryAction={
          <button
            onClick={() => handleDelete(todo.id)}
            className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 font-bold text-xl px-2 transition-opacity duration-200"
            aria-label="delete"
          >
            ×
          </button>
        }
      >
        <Checkbox
          edge="start"
          checked={todo.checked}
          onChange={() => handleToggle(todo.id)}
        />
        <ListItemText primary={todo.text} />
      </ListItem>
    ))
  )}
</List>

      </Paper>
    </div>
  );
}

export default TodoApp;
