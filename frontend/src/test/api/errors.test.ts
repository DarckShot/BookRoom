import { describe, expect, it } from 'vitest';
import { getApiErrorMessage, isApiError } from '../../api/errors';

const apiError = {
  isAxiosError: true,
  response: {
    status: 409,
    data: {
      error: {
        code: 'BOOKING_CONFLICT',
        message: 'Время уже занято',
      },
    },
  },
};

describe('API errors', () => {
  it('проверяет HTTP-статус и программный код ошибки', () => {
    expect(isApiError(apiError, 409)).toBe(true);
    expect(isApiError(apiError, 409, 'BOOKING_CONFLICT')).toBe(true);
    expect(isApiError(apiError, 409, 'OTHER_CODE')).toBe(false);
    expect(isApiError(apiError, 400)).toBe(false);
    expect(isApiError(new Error('Network error'), 409)).toBe(false);
  });

  it('использует сообщение backend или безопасный fallback', () => {
    expect(getApiErrorMessage(apiError, 'Ошибка')).toBe('Время уже занято');
    expect(
      getApiErrorMessage(
        { isAxiosError: true, response: { status: 500, data: { error: {} } } },
        'Ошибка',
      ),
    ).toBe('Ошибка');
    expect(getApiErrorMessage(new Error('Network error'), 'Ошибка')).toBe('Ошибка');
  });
});
