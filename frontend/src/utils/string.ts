const capitalizeWord: (word: string) => string = (word: string): string =>
  word.charAt(0).toUpperCase() + word.slice(1);

const capitalize: (s: string) => string = (s: string): string =>
  s.split(' ').map(capitalizeWord).join(' ');

export { capitalize };
