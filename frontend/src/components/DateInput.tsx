import { useState } from 'react';

import { displayToIso, isoToDisplay, maskDisplayDate } from '#utils/date.ts';

type DateInputProps = {
  value: string;
  onChange: (isoDate: string) => void;
  className?: string;
  ariaLabel?: string;
};

const DateInput = ({
  value,
  onChange,
  className,
  ariaLabel = 'Fecha del partido',
}: DateInputProps) => {
  const [text, setText] = useState<string>(isoToDisplay(value));

  return (
    <input
      type='text'
      inputMode='numeric'
      autoComplete='off'
      placeholder='dd/mm/aaaa'
      aria-label={ariaLabel}
      maxLength={10}
      value={text}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        const masked: string = maskDisplayDate(e.target.value);
        setText(masked);
        onChange(displayToIso(masked));
      }}
      className={className}
    />
  );
};

export { DateInput };
