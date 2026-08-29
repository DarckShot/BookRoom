export interface DatePickerProps {
  value: string;
  min: string;
  max: string;
  formattedValue: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
}

export type UseDatePickerProps = Pick<DatePickerProps, 'value' | 'min' | 'max' | 'onChange'>;
