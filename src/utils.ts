type Stringable = string | number | boolean

const addslashes = (str: string): string => (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0')

export const escape = (str: Stringable) => {
  if ('string' !== typeof str) {
    str = `${str}`
  }
  return str.includes("'") ? `'${addslashes(str)}'` : str
}
