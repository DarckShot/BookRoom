// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import { getRequiredElement } from '../../utils/dom';

afterEach(() => {
  document.body.replaceChildren();
});

describe('getRequiredElement', () => {
  it('возвращает обязательный DOM-элемент', () => {
    const element = document.createElement('div');
    element.id = 'root';
    document.body.append(element);

    expect(getRequiredElement('root')).toBe(element);
  });

  it('явно сообщает об отсутствии обязательного элемента', () => {
    expect(() => getRequiredElement('missing')).toThrow('Element with id "missing" was not found');
  });
});
