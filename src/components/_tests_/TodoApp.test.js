import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoApp from '../TodoApp';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('TodoApp', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  test('renders todo app with header', () => {
    render(<TodoApp />);
    expect(screen.getByText('React To-Do List')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter a new task...')).toBeInTheDocument();
  });

  test('adds a new todo', async () => {
    render(<TodoApp />);
    
    const input = screen.getByPlaceholderText('Enter a new task...');
    const addButton = screen.getByText('Add Task');
    
    fireEvent.change(input, { target: { value: 'Test todo item' } });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText('Test todo item')).toBeInTheDocument();
    });
  });

  test('validates empty input', async () => {
    render(<TodoApp />);
    
    const addButton = screen.getByText('Add Task');
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText('Task cannot be empty')).toBeInTheDocument();
    });
  });

  test('toggles todo completion', async () => {
    render(<TodoApp />);
    
    // Add a todo first
    const input = screen.getByPlaceholderText('Enter a new task...');
    fireEvent.change(input, { target: { value: 'Test todo' } });
    fireEvent.click(screen.getByText('Add Task'));
    
    await waitFor(() => {
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
      
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    });
  });

  test('removes todo', async () => {
    render(<TodoApp />);
    
    // Add a todo first
    const input = screen.getByPlaceholderText('Enter a new task...');
    fireEvent.change(input, { target: { value: 'Test todo to remove' } });
    fireEvent.click(screen.getByText('Add Task'));
    
    await waitFor(() => {
      expect(screen.getByText('Test todo to remove')).toBeInTheDocument();
    });
    
    // Remove the todo
    const removeButton = screen.getByTitle('Delete task');
    fireEvent.click(removeButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Test todo to remove')).not.toBeInTheDocument();
    });
  });

  test('filters todos correctly', async () => {
    render(<TodoApp />);
    
    // Add completed and active todos
    const input = screen.getByPlaceholderText('Enter a new task...');
    
    fireEvent.change(input, { target: { value: 'Active todo' } });
    fireEvent.click(screen.getByText('Add Task'));
    
    fireEvent.change(input, { target: { value: 'Completed todo' } });
    fireEvent.click(screen.getByText('Add Task'));
    
    await waitFor(() => {
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[1]); // Complete second todo
    });
    
    // Test active filter
    const filterSelect = screen.getByDisplayValue('All Tasks');
    fireEvent.change(filterSelect, { target: { value: 'active' } });
    
    await waitFor(() => {
      expect(screen.getByText('Active todo')).toBeInTheDocument();
      expect(screen.queryByText('Completed todo')).not.toBeInTheDocument();
    });
  });
});
