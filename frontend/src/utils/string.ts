const capitalize: (s: string) => string = (s: string): string => s.split(' ').map(capitalizeWord).join(' ');

const capitalizeWord: (word: string) => string = (word: string): string => word[0].toUpperCase() + word.slice(1);

export { capitalize, capitalizeWord };
