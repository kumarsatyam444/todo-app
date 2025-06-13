import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoForm from '../TodoForm';

describe('TodoForm', () => {
  const mockOnAddTodo = jest.fn();

  beforeEach(() => {
    mockOnAddTodo.mockClear();
  });

  test('renders form elements', () => {
    render(<TodoForm onAddTodo={mockOnAddTodo} />);
    
    expect(screen.getByPlaceholderText('Enter a new task...')).toBeInTheDocument();
    expect(screen.getByText('Add Task')).toBeInTheDocument();
    expect(screen.getByText('0/100 characters')).toBeInTheDocument();
  });

  test('updates character count', () => {
    render(<TodoForm onAddTodo={mockOnAddTodo} />);
    
    const input = screen.getByPlaceholderText('Enter a new task...');
    fireEvent.change(input, { target: { value: 'Hello' } });
    
    expect(screen.getByText('5/100 characters')).toBeInTheDocument();
  });

  test('validates minimum length', () => {
    render(<TodoForm onAddTodo={mockOnAddTodo} />);
    
    const input = screen.getByPlaceholderText('Enter a new task...');
    const button = screen.getByText('Add Task');
    
    fireEvent.change(input, { target: { value: 'Hi' } });
    fireEvent.click(button);
    
    expect(screen.getByText('Task must be at least 3 characters long')).toBeInTheDocument();
    expect(mockOnAddTodo).not.toHaveBeenCalled();
  });

  test('calls onAddTodo with valid input', () => {
    render(<TodoForm onAddTodo={mockOnAddTodo} />);
    
    const input = screen.getByPlaceholderText('Enter a new task...');
    const button = screen.getByText('Add Task');
    
    fireEvent.change(input, { target: { value: 'Valid todo item' } });
    fireEvent.click(button);
    
    expect(mockOnAddTodo).toHaveBeenCalledWith('Valid todo item');
    expect(input.value).toBe('');
  });
});
