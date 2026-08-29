// @vitest-environment jsdom

import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { useOfficeSelection } from '../../hooks/useOfficeSelection';
import type { Office } from '../../types/office';

const offices: Office[] = [
  {
    id: 'office-moscow',
    name: 'Офис Москва',
    address: 'Москва, ул. Лесная, 7',
    timezone: 'Europe/Moscow',
  },
  {
    id: 'office-spb',
    name: 'Офис Санкт-Петербург',
    address: 'Санкт-Петербург, наб. реки Карповки, 5',
    timezone: 'Europe/Moscow',
  },
];

const wrapper = ({ children }: { children: ReactNode }) => (
  <MemoryRouter
    initialEntries={[
      '/rooms?officeId=office-moscow&date=2026-08-30&start=15%3A00&duration=60&minCapacity=8',
    ]}
  >
    {children}
  </MemoryRouter>
);

describe('useOfficeSelection', () => {
  it('заменяет офис вместе с зависимыми фильтрами и позволяет очистить выбор', () => {
    const { result } = renderHook(
      () => ({ selection: useOfficeSelection(offices), location: useLocation() }),
      { wrapper },
    );

    expect(result.current.selection.selectedOffice?.id).toBe('office-moscow');

    act(() => result.current.selection.selectOffice('office-spb'));
    expect(result.current.location.search).toBe('?officeId=office-spb');
    expect(result.current.selection.selectedOffice?.id).toBe('office-spb');

    act(() => result.current.selection.selectOffice(''));
    expect(result.current.location.search).toBe('');
    expect(result.current.selection.selectedOffice).toBeUndefined();
  });
});
