// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import { Header } from '../../components/layout/Header/Header';

afterEach(cleanup);

const renderHeader = (path: string) => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Header />
    </MemoryRouter>,
  );
};

describe('Header', () => {
  it('показывает основную навигацию и профиль', () => {
    renderHeader('/rooms');

    expect(screen.getByRole('link', { name: 'Переговорные' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Мои бронирования' })).toBeVisible();
    expect(screen.getByText('Константин К.')).toBeVisible();
  });

  it('сохраняет активной вкладку переговорных на странице комнаты', () => {
    renderHeader('/rooms/everest');

    expect(screen.getByRole('link', { name: 'Переговорные' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('отмечает вкладку бронирований на соответствующем маршруте', () => {
    renderHeader('/bookings');

    expect(screen.getByRole('link', { name: 'Мои бронирования' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });
});
