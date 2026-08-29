export interface TimeInputProps {
  value: string;
  min: string;
  max: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
}

export type UseTimeInputProps = Pick<TimeInputProps, 'value' | 'min' | 'max' | 'onChange'>;
