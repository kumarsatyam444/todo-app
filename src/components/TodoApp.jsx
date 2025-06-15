import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './TodoApp.css';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [error, setError] = useState('');
  const [priority, setPriority] = useState('medium');

  // Character limit
  const MAX_CHARS = 100;

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (error) {
        console.error('Error loading todos:', error);
        setTodos([]);
      }
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Clear error after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Add new todo
  const addTodo = useCallback(() => {
    const trimmedValue = inputValue.trim();
    
    if (!trimmedValue) {
      setError('Please enter a todo item');
      return;
    }

    if (trimmedValue.length > MAX_CHARS) {
      setError(`Todo must be ${MAX_CHARS} characters or less`);
      return;
    }

    // Check for duplicates
    if (todos.some(todo => todo.text.toLowerCase() === trimmedValue.toLowerCase())) {
      setError('This todo already exists');
      return;
    }

    const newTodo = {
      id: Date.now(),
      text: trimmedValue,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      priority: priority
    };

    setTodos(prev => [newTodo, ...prev]);
    setInputValue('');
    setPriority('medium');
    setError('');
  }, [inputValue, todos, priority]);

  // Toggle todo completion
  const toggleTodo = useCallback((id) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { 
            ...todo, 
            completed: !todo.completed,
            updatedAt: new Date().toISOString()
          }
        : todo
    ));
  }, []);

  // Delete todo
  const deleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  // Start editing
  const startEdit = useCallback((id, text) => {
    setEditingId(id);
    setEditValue(text);
  }, []);

  // Save edit
  const saveEdit = useCallback(() => {
    const trimmedValue = editValue.trim();
    
    if (!trimmedValue) {
      setError('Todo cannot be empty');
      return;
    }

    if (trimmedValue.length > MAX_CHARS) {
      setError(`Todo must be ${MAX_CHARS} characters or less`);
      return;
    }

    setTodos(prev => prev.map(todo => 
      todo.id === editingId 
        ? { 
            ...todo, 
            text: trimmedValue,
            updatedAt: new Date().toISOString()
          }
        : todo
    ));
    
    setEditingId(null);
    setEditValue('');
    setError('');
  }, [editingId, editValue]);

  // Cancel edit
  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditValue('');
    setError('');
  }, []);

  // Clear completed todos
  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  }, []);

  // Handle key press
  const handleKeyPress = useCallback((e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  }, []);

  // Filter and sort todos
  const filteredAndSortedTodos = useMemo(() => {
    let filtered = todos;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(todo =>
        todo.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    switch (filter) {
      case 'active':
        filtered = filtered.filter(todo => !todo.completed);
        break;
      case 'completed':
        filtered = filtered.filter(todo => todo.completed);
        break;
      case 'high':
        filtered = filtered.filter(todo => todo.priority === 'high');
        break;
      case 'medium':
        filtered = filtered.filter(todo => todo.priority === 'medium');
        break;
      case 'low':
        filtered = filtered.filter(todo => todo.priority === 'low');
        break;
      default:
        break;
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'alphabetical':
          return a.text.localeCompare(b.text);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'completed':
          return a.completed - b.completed;
        case 'date':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  }, [todos, filter, sortBy, searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const active = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, active, completionRate };
  }, [todos]);

    // Character count styling
  const getCharCountClass = () => {
    const length = inputValue.length;
    if (length > MAX_CHARS) return 'danger';
    if (length > MAX_CHARS * 0.8) return 'warning';
    return '';
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get priority label
  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return '🔴 High';
      case 'medium': return '🟡 Medium';
      case 'low': return '🟢 Low';
      default: return '🟡 Medium';
    }
  };

  return (
    <div className="todo-app">
      {/* Header */}
      <header className="todo-header glass">
        <h1>✨ Todo Master</h1>
        <div className="todo-stats">
          <span>📊 {stats.active} active, {stats.completed} completed</span>
          <span className="completion-rate">({stats.completionRate}% done)</span>
        </div>
      </header>

      {/* Add Todo Form */}
      <section className="todo-form glass">
        <div className="input-group">
          <input
            type="text"
            className={`todo-input ${error ? 'error' : ''}`}
            placeholder="What needs to be done? ✍️"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyUp={(e) => handleKeyPress(e, addTodo)}
            maxLength={MAX_CHARS + 10}
          />
          <select
            className="priority-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
          <button 
            className="add-button" 
            onClick={addTodo}
            disabled={!inputValue.trim() || inputValue.length > MAX_CHARS}
          >
            <span>➕</span>
            Add Task
          </button>
        </div>
        
        <div className={`character-count ${getCharCountClass()}`}>
          {inputValue.length}/{MAX_CHARS} characters
        </div>
        
        {error && <div className="error-message">⚠️ {error}</div>}
      </section>

      {/* Filters and Search */}
      <section className="todo-filters glass">
        <div className="search-group">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search todos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-controls">
          <div className="filter-group">
            <label>📋 Filter:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Tasks</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>🔄 Sort:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="date">Date Created</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="priority">Priority</option>
              <option value="completed">Status</option>
            </select>
          </div>
        </div>
        
        <div className="stats-summary">
          <div className="stat-item">
            <span className="stat-label">Total:</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${stats.completionRate}%` }}
            ></div>
            <div className="progress-text">{stats.completionRate}%</div>
          </div>
        </div>
      </section>

      {/* Todo List */}
      <main className="todo-list">
        {filteredAndSortedTodos.length === 0 ? (
          <div className="no-todos glass">
            {searchTerm ? (
              <>
                <div className="no-results-icon">🔍</div>
                <p>No todos found matching "{searchTerm}"</p>
                <button 
                  className="clear-search-btn"
                  onClick={() => setSearchTerm('')}
                >
                  Clear Search
                </button>
              </>
            ) : filter !== 'all' ? (
              <>
                <div className="filter-empty-icon">📂</div>
                <p>No todos in "{filter}" category</p>
              </>
            ) : (
              <>
                <div className="empty-state-icon">📝</div>
                <p>No todos yet. Add one above to get started!</p>
              </>
            )}
          </div>
        ) : (
          filteredAndSortedTodos.map((todo) => (
            <article 
              key={todo.id} 
              className={`todo-item glass ${todo.completed ? 'completed' : ''} priority-${todo.priority}`}
            >
              <input
                type="checkbox"
                className="todo-checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
              />
              
              {editingId === todo.id ? (
                <>
                  <input
                    type="text"
                    className="edit-input"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, saveEdit)}
                    maxLength={MAX_CHARS + 10}
                    autoFocus
                  />
                  <div className="todo-actions">
                    <button
                      className="save-button"
                      onClick={saveEdit}
                      disabled={!editValue.trim() || editValue.length > MAX_CHARS}
                      title="Save changes"
                    >
                      ✅
                    </button>
                    <button
                      className="cancel-button"
                      onClick={cancelEdit}
                      title="Cancel editing"
                    >
                      ❌
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span 
                    className="todo-text"
                    onClick={() => toggleTodo(todo.id)}
                    title="Click to toggle completion"
                  >
                    {todo.text}
                  </span>
                  
                  <div className="todo-meta">
                    <span className="todo-date" title="Created">
                      📅 {formatDate(todo.createdAt)}
                    </span>
                    {todo.updatedAt !== todo.createdAt && (
                      <span className="todo-updated" title="Last updated">
                        🔄 Updated
                      </span>
                    )}
                    <span className="priority-badge" title="Priority">
                      {getPriorityLabel(todo.priority)}
                    </span>
                  </div>
                  
                  <div className="todo-actions">
                    <button
                      className="edit-button"
                      onClick={() => startEdit(todo.id, todo.text)}
                      disabled={todo.completed}
                      title="Edit todo"
                    >
                      ✏️
                    </button>
                    <button
                      className="remove-button"
                      onClick={() => deleteTodo(todo.id)}
                      title="Delete todo"
                    >
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </article>
          ))
        )}
      </main>

      {/* Footer Stats */}
      {todos.length > 0 && (
        <footer className="todo-footer glass">
          <div className="footer-stats">
            <div className="stat-card">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.active}</div>
              <div className="stat-label">Active</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.completed}</div>
              <div className="stat-label">Done</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.completionRate}%</div>
              <div className="stat-label">Progress</div>
            </div>
          </div>
          
          {stats.completed > 0 && (
            <button 
              className="clear-completed-btn"
              onClick={clearCompleted}
              title="Remove all completed todos"
            >
              🧹 Clear Completed ({stats.completed})
            </button>
          )}
        </footer>
      )}

      {/* Floating Action Button */}
      <button 
        className="fab"
        onClick={() => document.querySelector('.todo-input').focus()}
        title="Add new todo"
      >
        ➕
      </button>
    </div>
  );
};

export default TodoApp;
