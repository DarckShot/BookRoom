// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import App from '../App';

afterEach(cleanup);

describe('App layout', () => {
  it.each(['/rooms', '/rooms/everest', '/bookings', '/missing'])(
    'показывает хедер на маршруте %s',
    (path) => {
      render(
        <MemoryRouter initialEntries={[path]}>
          <App />
        </MemoryRouter>,
      );

      expect(screen.getByRole('banner')).toBeVisible();
      expect(screen.getByRole('navigation', { name: 'Основная навигация' })).toBeVisible();
    },
  );
});
