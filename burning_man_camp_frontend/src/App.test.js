import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

test('renders HME Camp title', () => {
  render(<App />);
  const header = screen.getByText(/HME Camp/i);
  expect(header).toBeInTheDocument();
});

test('navigates to People when clicking sidebar item', async () => {
  render(<App />);
  const peopleLink = screen.getByRole('link', { name: /people/i });
  fireEvent.click(peopleLink);
  await waitFor(() => {
    expect(screen.getByText(/Camp Members/i)).toBeInTheDocument();
  });
});

test('navigates to Dues when clicking sidebar item', async () => {
  render(<App />);
  const duesLink = screen.getByRole('link', { name: /dues & payment/i });
  fireEvent.click(duesLink);
  await waitFor(() => {
    expect(screen.getByText(/Dues & Payments/i)).toBeInTheDocument();
  });
});

test('navigates to Calendar when clicking sidebar item', async () => {
  render(<App />);
  const calendarLink = screen.getByRole('link', { name: /calendar/i });
  fireEvent.click(calendarLink);
  await waitFor(() => {
    expect(screen.getByText(/Camp Calendar/i)).toBeInTheDocument();
  });
});
