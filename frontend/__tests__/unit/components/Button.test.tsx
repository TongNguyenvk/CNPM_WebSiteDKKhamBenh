import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock Button component (you'll need to adjust this based on your actual Button component)
const Button = ({ children, onClick, disabled = false, variant = 'primary' }: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`btn btn-${variant}`}
    data-testid="button"
  >
    {children}
  </button>
);

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByTestId('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByTestId('button')).toBeDisabled();
  });

  it('applies correct variant class', () => {
    render(<Button variant="secondary">Click me</Button>);
    expect(screen.getByTestId('button')).toHaveClass('btn-secondary');
  });
});
