import type {Stringable} from './expression.ts'

export const escape = (str: Stringable) => {
  const escaped = `${str}`.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0')
  return `'${escaped}'`
}
