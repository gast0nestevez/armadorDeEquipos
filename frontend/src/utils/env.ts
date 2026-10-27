const getString: (key: string) => string = (key: string): string => {
  const value: string | undefined = import.meta.env[key] as string | undefined;
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
};

const Env = {
  getString,
};

export { Env };
