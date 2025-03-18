import {
  field,
  filterBuilder,
  group,
  notWithinGeoBoundingBox,
  notWithinGeoRadius,
  withinGeoBoundingBox,
  withinGeoRadius,
} from '@'
import {And, EmptyExpression} from '@/expression'
import exp from 'node:constants'
import {describe, it, expect} from 'vitest'

describe('EQUALS filter', () => {
  it('stringifies the filter', () => {
    const expression = field('cat').equals('Berlioz')
    expect(`${expression}`).toEqual(`cat = 'Berlioz'`)
  })

  it('stringifies the negated filter', () => {
    const expression = field('cat').notEquals('Berlioz')
    expect(`${expression}`).toEqual(`cat != 'Berlioz'`)
  })
})

describe('GreaterThan filter', () => {
  it('stringifies the filter', () => {
    const expression = field('age').isGreaterThan(5)
    expect(`${expression}`).toEqual(`age > '5'`)
  })

  it('stringifies the negated filter', () => {
    const expression = field('age').isNotGreaterThan(5)
    expect(`${expression}`).toEqual(`age <= '5'`)
  })
})

describe('GreaterThanOrEquals filter', () => {
  it('stringifies the filter', () => {
    const expression = field('age').isGreaterThan(5, true)
    expect(`${expression}`).toEqual(`age >= '5'`)
  })

  it('stringifies the negated filter', () => {
    const expression = field('age').isNotGreaterThan(5, true)
    expect(`${expression}`).toEqual(`age < '5'`)
  })
})

describe('LowerThan filter', () => {
  it('stringifies the filter', () => {
    const expression = field('age').isLowerThan(5)
    expect(`${expression}`).toEqual(`age < '5'`)
  })

  it('stringifies the negated filter', () => {
    const expression = field('age').isNotLowerThan(5)
    expect(`${expression}`).toEqual(`age >= '5'`)
  })
})

describe('LowerThanOrEquals filter', () => {
  it('stringifies the filter', () => {
    const expression = field('age').isLowerThan(5, true)
    expect(`${expression}`).toEqual(`age <= '5'`)
  })

  it('stringifies the negated filter', () => {
    const expression = field('age').isNotLowerThan(5, true)
    expect(`${expression}`).toEqual(`age > '5'`)
  })
})

describe('BETWEEN filter, boundaries included', () => {
  it('stringifies the filter', () => {
    const expression = field('age').isBetween(5, 10)
    expect(`${expression}`).toEqual(`age '5' TO '10'`)
  })

  it('stringifies the negated filter', () => {
    const expression = field('age').isNotBetween(5, 10)
    expect(`${expression}`).toEqual(`NOT age '5' TO '10'`)
  })
})

describe('BETWEEN filter, boundaries excluded', () => {
  it('stringifies the filter', () => {
    const expression = field('age').isBetween(5, 10, false)
    expect(`${expression}`).toEqual(`age > '5' AND age < '10'`)
  })

  it('stringifies the negated filter', () => {
    const expression = field('age').isNotBetween(5, 10, false)
    expect(`${expression}`).toEqual(`NOT (age > '5' AND age < '10')`)
  })
})

describe('EXISTS filter', () => {
  it('stringifies the filter', () => {
    const expression = field('god').exists()
    expect(`${expression}`).toEqual(`god EXISTS`)
  })

  it('stringifies the negated filter', () => {
    const expression = field('god').doesNotExist()
    expect(`${expression}`).toEqual(`god NOT EXISTS`)
  })
})

describe('EMPTY filter', () => {
  it('stringifies the filter', () => {
    const expression = field('glass').isEmpty()
    expect(`${expression}`).toEqual(`glass IS EMPTY`)
  })

  it('stringifies the negated filter', () => {
    const expression = field('glass').isNotEmpty()
    expect(`${expression}`).toEqual(`glass IS NOT EMPTY`)
  })
})

describe('NULL filter', () => {
  it('stringifies the filter', () => {
    const expression = field('nullish').isNull()
    expect(`${expression}`).toEqual(`nullish IS NULL`)
  })

  it('stringifies the negated filter', () => {
    const expression = field('nullish').isNotNull()
    expect(`${expression}`).toEqual(`nullish IS NOT NULL`)
  })
})

describe('IN filter', () => {
  const cat = field('cat')

  it('stringifies the filter', () => {
    const expression = cat.isIn(['Berlioz', "O'Malley"])
    expect(`${expression}`).toEqual(`cat IN ['Berlioz', 'O\\'Malley']`)
  })

  it('stringifies the negated filter', () => {
    const expression = cat.isNotIn(['Berlioz', "O'Malley"])
    expect(`${expression}`).toEqual(`cat NOT IN ['Berlioz', 'O\\'Malley']`)
  })
})

describe('hasAll / hasNone filter', () => {
  const color = field('color')

  it('stringifies the filter', () => {
    const expression = color.hasAll(['blue', 'green'])
    expect(`${expression}`).toEqual(`color = 'blue' AND color = 'green'`)
  })

  it('stringifies the negated filter', () => {
    const expression = color.hasNone(['blue', 'green'])
    expect(`${expression}`).toEqual(`NOT (color = 'blue' AND color = 'green')`)
  })
})

describe('CONTAINS Filter', () => {
  it('stringifies the filter', () => {
    const expression = field('cat').contains('Berlioz')
    expect(`${expression}`).toEqual(`cat CONTAINS 'Berlioz'`)
  })

  it('stringifies the negated filter', () => {
    const expression = field('cat').doesNotContain('Berlioz')
    expect(`${expression}`).toEqual(`cat NOT CONTAINS 'Berlioz'`)
  })
})

describe('STARTS WITH Filter', () => {
  it('stringifies the filter', () => {
    const expression = field('cat').startsWith('Berlioz')
    expect(`${expression}`).toEqual(`cat STARTS WITH 'Berlioz'`)
  })

  it('stringifies the negated filter', () => {
    const expression = field('cat').doesNotStartWith('Berlioz')
    expect(`${expression}`).toEqual(`cat NOT STARTS WITH 'Berlioz'`)
  })
})

describe('OR filter', () => {
  const cat = field('cat')
  const expression = cat.equals('Berlioz').or(cat.equals("O'Malley"))

  it('stringifies the filter', () => {
    expect(`${expression}`).toEqual(`cat = 'Berlioz' OR cat = 'O\\'Malley'`)
  })

  it('stringifies the negated filter', () => {
    expect(`${expression.negate()}`).toEqual(`NOT (cat = 'Berlioz' OR cat = 'O\\'Malley')`)
  })
})

describe('AND filter', () => {
  const cat = field('cat')
  const expression = cat.equals('Berlioz').and(cat.equals("O'Malley"))

  it('stringifies the filter', () => {
    expect(`${expression}`).toEqual(`cat = 'Berlioz' AND cat = 'O\\'Malley'`)
  })

  it('stringifies the negated filter', () => {
    expect(`${expression.negate()}`).toEqual(`NOT (cat = 'Berlioz' AND cat = 'O\\'Malley')`)
  })
})

describe('GeoRadius filter', () => {
  it('stringifies the filter', () => {
    const expression = withinGeoRadius(50.35, 3.51, 3000)
    expect(`${expression}`).toEqual(`_geoRadius(50.35, 3.51, 3000)`)
  })

  it('stringifies the negated filter', () => {
    const expression = notWithinGeoRadius(50.35, 3.51, 3000)
    expect(`${expression}`).toEqual(`NOT _geoRadius(50.35, 3.51, 3000)`)
  })
})

describe('GeoBoundingBox filter', () => {
  it('stringifies the filter', () => {
    const expression = withinGeoBoundingBox([50.55, 3], [50.52, 3.08])
    expect(`${expression}`).toEqual(`_geoBoundingBox([50.55, 3], [50.52, 3.08])`)
  })

  it('stringifies the negated filter', () => {
    const expression = notWithinGeoBoundingBox([50.55, 3], [50.52, 3.08])
    expect(`${expression}`).toEqual(`NOT _geoBoundingBox([50.55, 3], [50.52, 3.08])`)
  })
})

describe('Empty expression', () => {
  let expression = filterBuilder()
  it('stringifies the filter', () => {
    expect(expression).toBeInstanceOf(EmptyExpression)
    expect(`${expression}`).toBe('')
    let result = expression.and(field('foo').equals('bar'))
    expect(`${result}`).toBe("foo = 'bar'")
    result = expression.or(field('foo').equals('bar'))
    expect(`${result}`).toBe("foo = 'bar'")
    result = expression.group()
    expect(result).toBe(expression)
  })

  it('can be built with several filters', () => {
    const expression = filterBuilder(
      field('foo').equals('bar'),
      new EmptyExpression(),
      field('fruit').equals('banana'),
      field('vegetable').equals('potato')
    ).and(new EmptyExpression())

    expect(expression).toBeInstanceOf(And)
    expect(`${expression}`).toBe("(foo = 'bar' AND fruit = 'banana' AND vegetable = 'potato')")
  })
})

describe('Group expression', () => {
  it('groups an expression', () => {
    const expression = field('fruit').equals('banana').and(field('vegetable').equals('eggplant'))
    expect(`${group(expression)}`).toBe("(fruit = 'banana' AND vegetable = 'eggplant')")
  })
  it('groups several expressions', () => {
    const expressions = [field('fruit').equals('banana'), field('vegetable').equals('eggplant')]
    expect(`${group(...expressions)}`).toBe("(fruit = 'banana' AND vegetable = 'eggplant')")
  })
})

describe('Literal expression', () => {
  it('creates a literal expression from a string', () => {
    const expression = field('fruit').equals('banana').and('vegetable = potato')
    expect(`${expression}`).toBe("fruit = 'banana' AND vegetable = potato")
  })
})
