const {
  append,
  makeMapReducer,
  makeFilterReducer,
  makeTapTransducer,
  deepFlatTransducer,
  transduce
} = require('./transduce')

describe('transduce', () => {
  let input

  beforeEach(() => {
    input = [1, 2, 3]
  })

  describe('::makeMapReducer', () => {
    it('should map values', () => {
      const double = makeMapReducer(value => value * 2)
      const result = transduce(double, append, [], input)

      expect(result).toEqual([2, 4, 6])
    })
  })

  describe('::makeFilterReducer', () => {
    it('should filter values', () => {
      const noone = makeFilterReducer(value => value !== 1)
      const result = transduce(noone, append, [], input)

      expect(result).toEqual([2, 3])
    })
  })

  describe('::makeTapTransducer', () => {
    it('should tap values', () => {
      const spy = jest.fn()
      const tap = makeTapTransducer(spy)
      const result = transduce(tap, append, [], input)
      const [first, second, third] = spy.mock.calls

      expect(result).toEqual([1, 2, 3])
      expect(first).toEqual([1, 0, input])
      expect(second).toEqual([2, 1, input])
      expect(third).toEqual([3, 2, input])
      expect(spy.mock.calls.length).toBe(3)
    })
  })

  describe('::deepFlatTransducer', () => {
    it('should deep flatten values', () => {
      const input = [1, [2, [3, 4], [5]], 6]
      const result = transduce(deepFlatTransducer, append, [], input)

      expect(result).toEqual([1, 2, 3, 4, 5, 6])
    })
  })
})
