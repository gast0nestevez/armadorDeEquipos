type DateInputProps = {
  value: string;
  onChange: (isoDate: string) => void;
  className?: string;
};

const DateInput = ({ value, onChange, className }: DateInputProps) => (
  <input
    type='date'
    aria-label='Fecha del partido'
    value={value}
    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    }}
    className={className}
  />
);

export { DateInput };
