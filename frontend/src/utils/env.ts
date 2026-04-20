class Env {
  static getString(key: string): string {
    const value: string | undefined = import.meta.env[key];
    if (!value) {
      throw new Error(`Missing environment variable: ${key}`);
    }

    return value;
  }

  static getNumber(key: string): number {
    const value: string | undefined = import.meta.env[key];
    if (!value) {
      throw new Error(`Missing environment variable: ${key}`);
    }

    const num: number = Number.parseInt(value);
    if (Number.isNaN(num)) {
      throw new Error(`Invalid number for environment variable: ${key}`);
    }

    return num;
  }

  static getOptionalString(key: string, defaultValue: string): string {
    const value: string | undefined = import.meta.env[key];
    return value ?? defaultValue;
  }

  static getOptionalNumber(key: string, defaultValue: number): number {
    const value: string | undefined = import.meta.env[key]
    if (!value) {
      return defaultValue;
    }

    const num: number = Number.parseInt(value);
    if (Number.isNaN(num)) {
      throw new Error(`Invalid number for environment variable: ${key}`);
    }

    return num;
  }
}

export { Env };
