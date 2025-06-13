import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import TodoFilters from './TodoFilters';
import './TodoApp.css';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Add new todo
  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodos([...todos, newTodo]);
  };

  // Remove todo
  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Toggle todo completion
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // Edit todo
  const editTodo = (id, newText) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: newText.trim() } : todo
    ));
  };

  // Filter todos
  const getFilteredTodos = () => {
    let filtered = todos;
    
    switch (filter) {
      case 'active':
        filtered = todos.filter(todo => !todo.completed);
        break;
      case 'completed':
        filtered = todos.filter(todo => todo.completed);
        break;
      default:
        filtered = todos;
    }

    // Sort todos
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'alphabetical':
          return a.text.localeCompare(b.text);
        case 'completed':
          return a.completed - b.completed;
        case 'date':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  };

  const filteredTodos = getFilteredTodos();
  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="todo-app">
      <header className="todo-header">
        <h1>React To-Do List</h1>
        <div className="todo-stats">
          <span>{completedCount}/{totalCount} completed</span>
        </div>
      </header>

      <TodoForm onAddTodo={addTodo} />
      
      <TodoFilters
        filter={filter}
        sortBy={sortBy}
        onFilterChange={setFilter}
        onSortChange={setSortBy}
        totalTodos={totalCount}
      />

      <TodoList
        todos={filteredTodos}
        onToggleTodo={toggleTodo}
        onRemoveTodo={removeTodo}
        onEditTodo={editTodo}
      />

      {filteredTodos.length === 0 && totalCount > 0 && (
        <div className="no-todos">
          No todos match the current filter.
        </div>
      )}

      {totalCount === 0 && (
        <div className="no-todos">
          No todos yet. Add one above!
        </div>
      )}
    </div>
  );
};

export default TodoApp;
