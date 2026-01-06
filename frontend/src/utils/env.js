export default class Env {
  // Get a required environment variable as a string
  static getString(key) {
    const value = import.meta.env[key]
    if (!value) throw new Error(`Missing environment variable: ${key}`)
    return value
  }

  // Get a required environment variable as a number
  static getNumber(key) {
    const value = import.meta.env[key]
    if (!value) throw new Error(`Missing environment variable: ${key}`)

    const num = Number(value)
    if (isNaN(num)) throw new Error(`Invalid number for environment variable: ${key}`)

    return num
  }

  // Get an optional environment variable as a string
  static getOptionalString(key, defaultValue) {
    const value = import.meta.env[key]
    return value ?? defaultValue
  }

  // Get an optional environment variable as a number
  static getOptionalNumber(key, defaultValue) {
    const value = import.meta.env[key]
    if (value === undefined) return defaultValue

    const num = Number(value)
    if (isNaN(num)) throw new Error(`Invalid number for environment variable: ${key}`)

    return num
  }
}
