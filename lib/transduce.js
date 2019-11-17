const pipe = (...fns) => value => fns.reduce((result, current) => current(result), value)

const curry = fn => function accumulate () {
  return arguments.length < fn.length
    ? accumulate.bind(this, ...arguments)
    : fn.apply(this, arguments)
}

/**
 * Append values to an array
 * @param {T[]} array
 * @param {...T} values
 * @returns {T[]}
 * @template T
 */
const append = (array, ...values) => array.concat(values)

/**
 * Append values to an array, provided they are not
 * contained in that array yet
 * @param {T[]} array
 * @param {...T} values
 * @returns {T[]}
 * @template T
 */
const appendUnique = (array, ...values) =>
  array.concat(
    values.filter(value =>
      array.indexOf(value) === -1
    )
  )

const makeFilterReducer = curry(
  (predicate, combine) =>
    (result, current) =>
      predicate(current)
        ? combine(result, current)
        : result
)

const makeMapReducer = curry(
  (mapper, combine) =>
    (result, current) =>
      combine(result, mapper(current))
)

const makeTapTransducer = curry(
  (tapper, combine) =>
    (result, current, index, input) => {
      tapper(current, index, input)
      return combine(result, current)
    }
)

const deepFlatTransducer = combine =>
  (result, current) =>
    current != null && current[Symbol.iterator]
      ? transduce(deepFlatTransducer, combine, result)(current)
      : combine(result, current)

const transduce = curry(
  (transducer, transformer, initial, values) =>
    values.reduce(transducer(transformer), initial)
)

module.exports = {
  pipe,
  append,
  appendUnique,
  makeFilterReducer,
  makeMapReducer,
  makeTapTransducer,
  deepFlatTransducer,
  transduce
}
