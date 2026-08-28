import type { ReactNode } from 'react';
import type { SelectOption } from '../../../types/select';

export interface CustomSelectProps {
  ariaLabel: string;
  value: string;
  options: readonly SelectOption[];
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  prefix?: ReactNode;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  placeholderClassName?: string;
  chevronVisibility?: 'always' | 'enabled';
}

export type UseCustomSelectProps = Pick<
  CustomSelectProps,
  'value' | 'options' | 'onChange' | 'disabled'
>;
