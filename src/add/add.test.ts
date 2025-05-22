import { add } from '@/add/add'

describe('add', () => {
  it('should add two numbers and return the result', () => {
    const num1 = 1
    const num2 = 2

    const expected = 3
    const actual = add(num1, num2)

    expect(actual).toBe(expected)
  })
})
