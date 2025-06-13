import React, { useState } from 'react';

const TodoItem = ({ todo, onToggle, onRemove, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleEdit = () => {
    if (editText.trim() && editText.trim() !== todo.text) {
      onEdit(editText);
    }
    setIsEditing(false);
    setEditText(todo.text);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEdit();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(todo.text);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={onToggle}
        className="todo-checkbox"
      />
      
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleEdit}
          onKeyDown={handleKeyPress}
          className="edit-input"
          autoFocus
        />
      ) : (
        <span
          className="todo-text"
          onDoubleClick={() => !todo.completed && setIsEditing(true)}
          title="Double-click to edit"
        >
          {todo.text}
        </span>
      )}
      
      <div className="todo-actions">
        <span className="todo-date">{formatDate(todo.createdAt)}</span>
        {!isEditing && (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="edit-button"
              disabled={todo.completed}
              title="Edit task"
            >
              ✏️
            </button>
            <button
              onClick={onRemove}
              className="remove-button"
              title="Delete task"
            >
              🗑️
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TodoItem;
