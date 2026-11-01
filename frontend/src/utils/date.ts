const isoToDisplay: (isoDate: string) => string = (isoDate: string): string => {
  if (!isoDate) {
    return '';
  }
  const [year, month, day]: string[] = isoDate.split('-');
  return `${day}/${month}/${year}`;
};

export { isoToDisplay };
