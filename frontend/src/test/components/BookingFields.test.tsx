// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { afterEach, describe, expect, it } from 'vitest';
import { BookingRecurrenceFields } from '../../components/bookings/BookingDialog/BookingForm/BookingRecurrenceFields';
import { BookingScheduleFields } from '../../components/bookings/BookingDialog/BookingForm/BookingScheduleFields';
import type { BookingFormValues } from '../../components/bookings/BookingDialog/model/types';

const defaultValues: BookingFormValues = {
  title: 'Планирование',
  date: '2026-08-30',
  startTime: '15:00',
  durationMinutes: 60,
  comment: '',
  isRecurring: true,
  occurrenceCount: 2,
};

interface BookingFieldsHarnessProps {
  values?: BookingFormValues;
  withErrors?: boolean;
}

const BookingFieldsHarness = ({
  values = defaultValues,
  withErrors,
}: BookingFieldsHarnessProps) => {
  const form = useForm<BookingFormValues>({ defaultValues: values });

  useEffect(() => {
    if (!withErrors) {
      return;
    }

    form.setError('date', { message: 'Ошибка даты' });
    form.setError('startTime', { message: 'Ошибка времени' });
    form.setError('durationMinutes', { message: 'Ошибка длительности' });
    form.setError('occurrenceCount', { message: 'Ошибка повторов' });
  }, [form, withErrors]);

  return (
    <FormProvider {...form}>
      <BookingScheduleFields minDate="2026-08-29" maxDate="2026-09-28" />
      <BookingRecurrenceFields maxDate="2026-09-28" />
    </FormProvider>
  );
};

afterEach(cleanup);

describe('booking fields', () => {
  it('показывает ошибки составных полей и позволяет изменить количество встреч', async () => {
    const user = userEvent.setup();
    render(<BookingFieldsHarness withErrors />);

    expect(await screen.findByText('Ошибка даты')).toBeVisible();
    expect(screen.getByText('Ошибка времени')).toBeVisible();
    expect(screen.getByText('Проверьте продолжительность бронирования')).toBeVisible();
    expect(screen.getByText('Ошибка повторов')).toBeVisible();

    await user.click(screen.getByRole('combobox', { name: 'Количество встреч' }));
    await user.click(screen.getByRole('option', { name: '3 встречи' }));
    expect(screen.getByRole('combobox', { name: 'Количество встреч' })).toHaveTextContent(
      '3 встречи',
    );

    await user.click(screen.getByRole('checkbox', { name: 'Повторять еженедельно' }));
    expect(screen.queryByRole('combobox', { name: 'Количество встреч' })).not.toBeInTheDocument();
  });

  it('включает повтор и блокирует его, если серия не помещается в горизонт', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <BookingFieldsHarness
        values={{ ...defaultValues, isRecurring: false, occurrenceCount: 1 }}
      />,
    );

    await user.click(screen.getByRole('checkbox', { name: 'Повторять еженедельно' }));
    expect(screen.getByRole('combobox', { name: 'Количество встреч' })).toBeVisible();

    rerender(
      <BookingFieldsHarness
        key="late-date"
        values={{
          ...defaultValues,
          date: '2026-09-28',
          isRecurring: false,
          occurrenceCount: 1,
        }}
      />,
    );

    expect(screen.getByRole('checkbox', { name: 'Повторять еженедельно' })).toBeDisabled();
    expect(screen.getByText('Для этой даты повтор недоступен')).toBeVisible();
  });
});
