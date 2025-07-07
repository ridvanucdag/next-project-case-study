import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from './Button';
import { FaPlus } from 'react-icons/fa';

afterEach(cleanup);

describe('Button Component', () => {
  test('renders with default props and children', () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('primary');
    expect(button).toHaveClass('md');
    expect(button).toHaveClass('rounded');
  });

  const variants = ['primary', 'danger', 'outline', 'ghost', 'success', 'light', 'text'] as const;
  variants.forEach((variant) => {
    test(`renders with variant: ${variant}`, () => {
      render(<Button variant={variant}>Test</Button>);
      const button = screen.getByRole('button', { name: /test/i });
      expect(button).toHaveClass(variant);
    });
  });

  const sizes = ['sm', 'md', 'lg'] as const;
  sizes.forEach((size) => {
    test(`renders with size: ${size}`, () => {
      render(<Button size={size}>Size Test</Button>);
      const button = screen.getByRole('button', { name: /size test/i });
      expect(button).toHaveClass(size);
    });
  });

  test('applies fullWidth class when fullWidth is true', () => {
    render(<Button fullWidth>Full Width</Button>);
    const button = screen.getByRole('button', { name: /full width/i });
    expect(button).toHaveClass('fullWidth');
  });

  test('disables the button when loading is true', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button', { name: /loading/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('data-loading', 'true');
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  test('displays left icon', () => {
    render(<Button icon={<FaPlus />} iconPosition="left">Left Icon</Button>);
    const button = screen.getByRole('button', { name: /left icon/i });
    const iconLeft = button.querySelector('.iconLeft');
    expect(iconLeft).toBeInTheDocument();
  });

  test('displays right icon', () => {
    render(<Button icon={<FaPlus />} iconPosition="right">Right Icon</Button>);
    const button = screen.getByRole('button', { name: /right icon/i });
    const iconRight = button.querySelector('.iconRight');
    expect(iconRight).toBeInTheDocument();
  });

  test('calls onClick when clicked and not disabled', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    const button = screen.getByRole('button', { name: /click/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Disabled</Button>);
    const button = screen.getByRole('button', { name: /disabled/i });
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  const shapes = ['rectangle', 'rounded', 'pill'] as const;
  shapes.forEach((shape) => {
    test(`applies shape class: ${shape}`, () => {
      render(<Button shape={shape}>Shape</Button>);
      const button = screen.getByRole('button', { name: /shape/i });
      expect(button).toHaveClass(shape);
    });
  });

  const effects = ['scale', 'shadow', 'slide', 'none'] as const;
  effects.forEach((effect) => {
    test(`applies hover effect class: ${effect}`, () => {
      render(<Button hoverEffect={effect}>Hover</Button>);
      const button = screen.getByRole('button', { name: /hover/i });
      if (effect !== 'none') {
        expect(button).toHaveClass(`hover-${effect}`);
      } else {
        expect(button.className).not.toContain('hover-');
      }
    });
  });
});
