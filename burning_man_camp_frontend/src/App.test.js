import { render, screen } from '@testing-library/react';
import App from './App';

test('renders HME Camp title', () => {
  render(<App />);
  const header = screen.getByText(/HME Camp/i);
  expect(header).toBeInTheDocument();
});
