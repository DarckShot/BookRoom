// @vitest-environment jsdom

import { act, cleanup, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form';
import { afterEach, describe, expect, it } from 'vitest';
import type { BookingFormValues } from '../../components/bookings/BookingDialog/model/types';
import { useBookingScheduleFields } from '../../components/bookings/BookingDialog/model/useBookingScheduleFields';

interface FormHarness {
  current?: UseFormReturn<BookingFormValues>;
}

const defaultValues: BookingFormValues = {
  title: '',
  date: '2026-08-30',
  startTime: '15:00',
  durationMinutes: 60,
  comment: '',
  isRecurring: false,
  occurrenceCount: 1,
};

const createWrapper = (values: BookingFormValues, harness: FormHarness) => {
  const Wrapper = ({ children }: { children: ReactNode }) => {
    const form = useForm<BookingFormValues>({ defaultValues: values });
    harness.current = form;

    return <FormProvider {...form}>{children}</FormProvider>;
  };

  return Wrapper;
};

afterEach(cleanup);

describe('useBookingScheduleFields', () => {
  it('сохраняет длительность при выборе обычного времени', () => {
    const harness: FormHarness = {};
    const { result } = renderHook(() => useBookingScheduleFields('2026-09-28'), {
      wrapper: createWrapper(defaultValues, harness),
    });

    act(() => result.current.actions.changeStartTime('16:00'));

    expect(harness.current?.getValues('startTime')).toBe('16:00');
    expect(harness.current?.getValues('durationMinutes')).toBe(60);
  });

  it('сокращает длительность, если новое время близко к концу рабочего дня', () => {
    const harness: FormHarness = {};
    const { result } = renderHook(() => useBookingScheduleFields('2026-09-28'), {
      wrapper: createWrapper({ ...defaultValues, durationMinutes: 120 }, harness),
    });

    act(() => result.current.actions.changeStartTime('19:30'));

    expect(harness.current?.getValues('startTime')).toBe('19:30');
    expect(harness.current?.getValues('durationMinutes')).toBe(30);
    expect(result.current.data.durationOptions).toHaveLength(2);
  });

  it('отключает повтор, если для новой даты не осталось полного недельного интервала', () => {
    const harness: FormHarness = {};
    const { result } = renderHook(() => useBookingScheduleFields('2026-09-28'), {
      wrapper: createWrapper({ ...defaultValues, isRecurring: true, occurrenceCount: 3 }, harness),
    });

    act(() => result.current.actions.changeDate('2026-09-22'));

    expect(harness.current?.getValues('date')).toBe('2026-09-22');
    expect(harness.current?.getValues('isRecurring')).toBe(false);
    expect(harness.current?.getValues('occurrenceCount')).toBe(1);
  });

  it('уменьшает число повторов до доступного для новой даты', () => {
    const harness: FormHarness = {};
    const { result } = renderHook(() => useBookingScheduleFields('2026-09-28'), {
      wrapper: createWrapper({ ...defaultValues, isRecurring: true, occurrenceCount: 5 }, harness),
    });

    act(() => result.current.actions.changeDate('2026-09-14'));

    expect(harness.current?.getValues('isRecurring')).toBe(true);
    expect(harness.current?.getValues('occurrenceCount')).toBe(3);
  });

  it('меняет дату без побочных изменений для одиночной встречи', () => {
    const harness: FormHarness = {};
    const { result } = renderHook(() => useBookingScheduleFields('2026-09-28'), {
      wrapper: createWrapper(defaultValues, harness),
    });

    act(() => result.current.actions.changeDate('2026-09-01'));

    expect(harness.current?.getValues()).toMatchObject({
      date: '2026-09-01',
      isRecurring: false,
      occurrenceCount: 1,
    });
  });
});
