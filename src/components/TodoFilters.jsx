import React from 'react';

const TodoFilters = ({ filter, sortBy, onFilterChange, onSortChange, totalTodos }) => {
  return (
    <div className="todo-filters">
      <div className="filter-group">
        <label>Filter:</label>
        <select value={filter} onChange={(e) => onFilterChange(e.target.value)}>
          <option value="all">All Tasks</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      
      <div className="filter-group">
        <label>Sort by:</label>
        <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
          <option value="date">Date Created</option>
          <option value="alphabetical">Alphabetical</option>
          <option value="completed">Completion Status</option>
        </select>
      </div>
      
      <div className="total-count">
        Total: {totalTodos} tasks
      </div>
    </div>
  );
};

export default TodoFilters;
