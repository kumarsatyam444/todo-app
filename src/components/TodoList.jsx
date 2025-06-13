import React from 'react';
import TodoItem from './TodoItem';

const TodoList = ({ todos, onToggleTodo, onRemoveTodo, onEditTodo }) => {
  return (
    <div className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={() => onToggleTodo(todo.id)}
          onRemove={() => onRemoveTodo(todo.id)}
          onEdit={(newText) => onEditTodo(todo.id, newText)}
        />
      ))}
    </div>
  );
};

export default TodoList;
