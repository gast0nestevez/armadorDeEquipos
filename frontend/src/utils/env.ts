const getString: (key: string) => string = (key: string): string => {
  const value: string | undefined = import.meta.env[key] as string | undefined;
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
};

const getNumber: (key: string) => number = (key: string): number => {
  const value: string | undefined = import.meta.env[key] as string | undefined;
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  const num: number = Number.parseInt(value);
  if (Number.isNaN(num)) {
    throw new Error(`Invalid number for environment variable: ${key}`);
  }

  return num;
};

const getOptionalString: (key: string, defaultValue: string) => string = (
  key: string,
  defaultValue: string
): string => {
  const value: string | undefined = import.meta.env[key] as string | undefined;
  return value ?? defaultValue;
};

const getOptionalNumber: (key: string, defaultValue: number) => number = (
  key: string,
  defaultValue: number
): number => {
  const value: string | undefined = import.meta.env[key] as string | undefined;
  if (!value) {
    return defaultValue;
  }

  const num: number = Number.parseInt(value);
  if (Number.isNaN(num)) {
    throw new Error(`Invalid number for environment variable: ${key}`);
  }

  return num;
};

const Env = {
  getString,
  getNumber,
  getOptionalString,
  getOptionalNumber,
};

export { Env };
