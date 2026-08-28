export interface DatePickerProps {
  value: string;
  min: string;
  max: string;
  formattedValue: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export type UseDatePickerProps = Pick<DatePickerProps, 'value' | 'min' | 'max' | 'onChange'>;
