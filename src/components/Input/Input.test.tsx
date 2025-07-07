
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Input from './Input';

describe('Input Component', () => {
  test('renders with required props', () => {
    render(<Input value="test" onChange={() => {}} />);
    const input = screen.getByDisplayValue('test');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  test('calls onChange when typing', () => {
    const handleChange = jest.fn();
    render(<Input value="" onChange={handleChange} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'a' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('calls onBlur when input loses focus', () => {
    const handleBlur = jest.fn();
    render(<Input value="blur" onChange={() => {}} onBlur={handleBlur} />);
    const input = screen.getByDisplayValue('blur');

    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  test('calls onKeyDown when a key is pressed', () => {
    const handleKeyDown = jest.fn();
    render(<Input value="key" onChange={() => {}} onKeyDown={handleKeyDown} />);
    const input = screen.getByDisplayValue('key');

    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
  });

  test('applies additional className', () => {
    render(<Input value="" onChange={() => {}} className="custom-class" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-class');
  });

  test('renders placeholder correctly', () => {
    render(<Input value="" onChange={() => {}} placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
  });

  test('renders correct inputMode', () => {
    render(<Input value="" onChange={() => {}} inputMode="numeric" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('inputmode', 'numeric');
  });

  test('renders with provided id and type', () => {
    render(<Input value="id-test" id="custom-input" type="email" onChange={() => {}} />);
    const input = screen.getByDisplayValue('id-test');
    expect(input).toHaveAttribute('id', 'custom-input');
    expect(input).toHaveAttribute('type', 'email');
  });
});
