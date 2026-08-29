// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DatePicker } from '../../components/rooms/DatePicker/DatePicker';
import { RoomCard } from '../../components/rooms/RoomCard/RoomCard';
import { TimeInput } from '../../components/rooms/TimeInput/TimeInput';
import { CustomSelect } from '../../components/ui/CustomSelect/CustomSelect';
import { Modal } from '../../components/ui/Modal/Modal';
import { RoomFeatureIcon } from '../../pages/RoomPage/components/RoomFeatureIcon';
import type { Room } from '../../types/room';

afterEach(() => {
  cleanup();
  document.body.style.overflow = '';
});

const selectOptions = [
  { value: 'one', label: 'Первый' },
  { value: 'two', label: 'Второй', displayLabel: 'Выбран второй' },
  { value: 'three', label: 'Третий' },
];

describe('interactive controls', () => {
  it('переключает месяцы календаря, выбирает дату и закрывается по Escape', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DatePicker
        value="2026-08-29"
        min="2026-08-29"
        max="2026-10-05"
        formattedValue="29 Августа, Сб"
        onChange={onChange}
      />,
    );

    const trigger = screen.getByRole('button', { name: 'Дата бронирования' });
    await user.click(trigger);
    expect(screen.getByRole('button', { name: 'Предыдущий месяц' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Следующий месяц' }));
    expect(screen.getByText('Сентябрь 2026')).toBeVisible();
    await user.click(screen.getByRole('button', { name: '5 сентября 2026' }));

    expect(onChange).toHaveBeenCalledWith('2026-09-05');
    expect(screen.queryByRole('dialog', { name: 'Выбор даты' })).not.toBeInTheDocument();

    await user.click(trigger);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'Выбор даты' })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('отображает disabled-состояние календаря с placeholder', () => {
    render(
      <DatePicker
        value=""
        min="2026-08-29"
        max="2026-09-28"
        formattedValue=""
        placeholder="Выберите дату"
        disabled
        ariaInvalid
        ariaDescribedBy="date-error"
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Дата бронирования' })).toBeDisabled();
    expect(screen.getByText('Выберите дату')).toBeVisible();
  });

  it('поддерживает мышь и клавиатуру в кастомном select', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <CustomSelect
        ariaLabel="Тестовый список"
        value=""
        options={selectOptions}
        placeholder="Выберите"
        onChange={onChange}
      />,
    );
    const trigger = screen.getByRole('combobox', { name: 'Тестовый список' });

    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: 'Второй' }));
    expect(onChange).toHaveBeenCalledWith('two');
    await waitFor(() => expect(trigger).toHaveFocus());

    rerender(
      <CustomSelect
        ariaLabel="Тестовый список"
        value="two"
        options={selectOptions}
        placeholder="Выберите"
        onChange={onChange}
      />,
    );
    expect(trigger).toHaveTextContent('Выбран второй');

    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('option', { name: 'Третий' })).toHaveFocus();
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenLastCalledWith('one');

    await user.click(trigger);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    await user.click(trigger);
    await user.click(trigger);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    await user.click(trigger);
    fireEvent.keyDown(trigger, { key: ' ' });
    expect(onChange).toHaveBeenLastCalledWith('two');

    await user.click(trigger);
    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('не открывает отключённый или пустой select', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <CustomSelect
        ariaLabel="Пустой список"
        value=""
        options={[]}
        placeholder="Нет вариантов"
        onChange={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('combobox', { name: 'Пустой список' }));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    rerender(
      <CustomSelect
        ariaLabel="Пустой список"
        value=""
        options={selectOptions}
        placeholder="Нет вариантов"
        disabled
        chevronVisibility="enabled"
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByRole('combobox', { name: 'Пустой список' })).toBeDisabled();
  });

  it('маскирует время, коммитит валидное значение и откатывает ошибочное', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TimeInput value="09:00" min="09:00" max="19:45" onChange={onChange} />);
    const input = screen.getByRole<HTMLInputElement>('textbox', { name: 'Время начала' });

    await user.clear(input);
    await user.type(input, '1015');
    expect(input).toHaveValue('10:15');
    expect(onChange).toHaveBeenCalledWith('10:15');
    await user.keyboard('{Enter}');

    await user.clear(input);
    await user.type(input, '1001');
    await user.tab();
    expect(input).toHaveValue('09:00');
  });

  it('управляет фокусом и закрытием модального окна', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { unmount } = render(
      <>
        <button type="button">Открыть</button>
        <Modal ariaLabelledBy="modal-title" onClose={onClose}>
          <h2 id="modal-title">Подтверждение</h2>
          <button type="button">Действие</button>
          <button type="button">Закрыть</button>
        </Modal>
      </>,
    );

    expect(screen.getByRole('button', { name: 'Действие' })).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'Закрыть' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Действие' })).toHaveFocus();
    expect(document.body.style.overflow).toBe('hidden');
    fireEvent.mouseDown(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.mouseDown(screen.getByRole('dialog').parentElement ?? document.body);
    expect(onClose).toHaveBeenCalledOnce();
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(2);

    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('фокусирует панель модального окна без интерактивных элементов', async () => {
    const user = userEvent.setup();
    render(
      <Modal ariaLabelledBy="empty-modal-title" onClose={vi.fn()}>
        <h2 id="empty-modal-title">Информация</h2>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Информация' });
    expect(dialog).toHaveFocus();
    await user.tab();
    expect(dialog).toHaveFocus();
  });

  it('показывает недоступную комнату без действия бронирования', () => {
    const room: Room = {
      id: 'room-everest',
      officeId: 'office-moscow',
      name: 'Эверест',
      floor: 4,
      capacity: 12,
      features: [],
      available: false,
      office: {
        id: 'office-moscow',
        name: 'Офис Москва',
        address: 'Москва, ул. Лесная, 7',
        timezone: 'Europe/Moscow',
      },
    };

    render(
      <MemoryRouter>
        <RoomCard room={room} search="date=2026-08-30" />
      </MemoryRouter>,
    );

    expect(screen.getByText('Недоступно на выбранное время')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Забронировать' })).toBeDisabled();
  });

  it('использует fallback-иконку для неизвестной возможности комнаты', () => {
    const { container } = render(<RoomFeatureIcon code="coffee-machine" />);

    expect(container.querySelector('svg')).not.toBeNull();
  });
});
