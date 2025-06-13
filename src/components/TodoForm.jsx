import React, { useState } from 'react';

const TodoForm = ({ onAddTodo }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const validateInput = (text) => {
    if (!text.trim()) {
      return 'Task cannot be empty';
    }
    if (text.trim().length < 3) {
      return 'Task must be at least 3 characters long';
    }
    if (text.trim().length > 100) {
      return 'Task must be less than 100 characters';
    }
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationError = validateInput(input);
    if (validationError) {
      setError(validationError);
      return;
    }

    onAddTodo(input);
    setInput('');
    setError('');
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (error) {
      setError('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <div className="input-group">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter a new task..."
          className={`todo-input ${error ? 'error' : ''}`}
          maxLength={100}
        />
        <button type="submit" className="add-button">
          Add Task
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="character-count">
        {input.length}/100 characters
      </div>
    </form>
  );
};

export default TodoForm;
