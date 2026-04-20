const getEnv: (key: string) => string = (key: string): string => {
  const value: string | undefined = process.env[key];

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
};

export { getEnv };