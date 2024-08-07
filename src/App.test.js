import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import App from './App';

beforeAll(() => {
  global.alert = jest.fn();
});

describe('App Component', () => {
  test('opens and closes the popup', () => {
    render(<App />);
    
    // Check if popup is initially not in the document
    expect(screen.queryByText('Saving Segment')).not.toBeInTheDocument();
    
    // Click "Save segment" button
    fireEvent.click(screen.getByText('Save segment'));
    
    // Check if popup is now in the document
    expect(screen.getByText('Saving Segment')).toBeInTheDocument();
    
    // Click "Cancel" button
    fireEvent.click(screen.getByText('Cancel'));
    
    // Check if popup is not in the document again
    expect(screen.queryByText('Saving Segment')).not.toBeInTheDocument();
  });

  test('adds and removes schemas', () => {
    render(<App />);
    
    // Open the popup
    fireEvent.click(screen.getByText('Save segment'));
    
    // Add a schema
    fireEvent.change(screen.getByLabelText('Add schema to segment'), { target: { value: 'first_name' } });
    fireEvent.click(screen.getByText('+Add new schema'));
    
    // Check if the schema is added
    expect(screen.getByText('First Name')).toBeInTheDocument();
    
    // Remove the schema
    fireEvent.click(screen.getAllByText('Remove')[0]);
    
    // Check if the schema is removed
    expect(screen.queryByText('First Name')).not.toBeInTheDocument();
  });

  test('saves the segment', () => {
    render(<App />);
    
    // Open the popup
    fireEvent.click(screen.getByText('Save segment'));
    
    // Enter segment name
    fireEvent.change(screen.getByPlaceholderText('Name of the segment'), { target: { value: 'Test Segment' } });
    
    // Add schemas
    fireEvent.change(screen.getByLabelText('Add schema to segment'), { target: { value: 'first_name' } });
    fireEvent.click(screen.getByText('+Add new schema'));
    
    // Enter value for first schema
    fireEvent.change(screen.getByPlaceholderText('Enter First Name'), { target: { value: 'John' } });
    
    // Add another schema
    fireEvent.change(screen.getByLabelText('Add schema to segment'), { target: { value: 'last_name' } });
    fireEvent.click(screen.getByText('+Add new schema'));
    
    // Enter value for second schema
    fireEvent.change(screen.getByPlaceholderText('Enter Last Name'), { target: { value: 'Doe' } });
    
    // Save the segment
    fireEvent.click(screen.getByText('Save the segment'));
    
    // Check if alert is called with correct data
    expect(global.alert).toHaveBeenCalledWith(JSON.stringify({
      segment_name: 'Test Segment',
      schema: [
        { first_name: 'John' },
        { last_name: 'Doe' }
      ]
    }, null, 2));
  });

  test('clears data when cancel is clicked', () => {
    render(<App />);
    
    // Open the popup
    fireEvent.click(screen.getByText('Save segment'));
    
    // Enter segment name
    fireEvent.change(screen.getByPlaceholderText('Name of the segment'), { target: { value: 'Test Segment' } });
    
    // Add a schema
    fireEvent.change(screen.getByLabelText('Add schema to segment'), { target: { value: 'first_name' } });
    fireEvent.click(screen.getByText('+Add new schema'));
    
    // Enter value for schema
    fireEvent.change(screen.getByPlaceholderText('Enter First Name'), { target: { value: 'John' } });
    
    // Click "Cancel" button
    fireEvent.click(screen.getByText('Cancel'));
    
    // Open the popup again
    fireEvent.click(screen.getByText('Save segment'));
    
    // Check if segment name and schemas are cleared
    expect(screen.getByPlaceholderText('Name of the segment').value).toBe('');
    expect(screen.queryByText('First Name')).not.toBeInTheDocument();
  });
});
