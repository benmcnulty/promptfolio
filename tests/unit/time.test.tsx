import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Time from '@/components/Time';

describe('Time demo', () => {
  const originalFetch = globalThis.fetch;
  afterEach(() => { globalThis.fetch = originalFetch; });

  it('renders validated server and local values', async () => {
    const time = '2026-09-12T12:00:00.000Z';
    globalThis.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ time, message: 'Hello from the edge!' }) } as Response);
    render(<Time />);
    await userEvent.click(screen.getByRole('button', { name: 'Update time' }));
    await waitFor(() => expect(screen.getByText(new Date(time).toLocaleTimeString())).toBeInTheDocument());
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it.each([
    () => Promise.reject(new Error('offline')),
    () => Promise.resolve({ ok: false, json: async () => ({}) } as Response),
    () => Promise.resolve({ ok: true, json: async () => ({ time: 'invalid', message: 4 }) } as Response),
  ])('shows a retry state for request and response failures', async (response) => {
    globalThis.fetch = jest.fn().mockImplementation(response as typeof fetch);
    render(<Time />);
    await userEvent.click(screen.getByRole('button', { name: 'Update time' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('did not return a valid response');
    expect(screen.getByRole('button', { name: 'Try again' })).toBeEnabled();
  });
});
