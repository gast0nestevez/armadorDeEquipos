const isoToDisplay: (isoDate: string) => string = (isoDate: string): string => {
  if (!isoDate) {
    return '';
  }
  const [year, month, day]: string[] = isoDate.split('-');
  return `${day}/${month}/${year}`;
};

const maskDisplayDate: (raw: string) => string = (raw: string): string => {
  const digits: string = raw.replaceAll(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

const displayToIso: (display: string) => string = (display: string): string => {
  const match: RegExpExecArray | null = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(display);
  if (!match) {
    return '';
  }
  const day: number = Number(match[1]);
  const month: number = Number(match[2]);
  const year: number = Number(match[3]);
  const parsed: Date = new Date(Date.UTC(year, month - 1, day));
  const isValid: boolean =
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day;
  return isValid ? `${match[3]}-${match[2]}-${match[1]}` : '';
};

export { displayToIso, isoToDisplay, maskDisplayDate };
