[![CI Workflow](https://github.com/bpolaszek/meilisearch-filters/actions/workflows/ci.yml/badge.svg)](https://github.com/bpolaszek/meilisearch-filters/actions/workflows/ci.yml)

# MeiliSearch Filter Builder

This library allows you to build [Meilisearch filters](https://www.meilisearch.com/docs/learn/fine_tuning_results/filtering#filter-basics) using Javascript.

Examples:

### Comparison Filters

```js
import {field} from 'meilisearch-filters'

`${field('cat').equals("Berlioz")}` // cat = 'Berlioz'
`${field('cat').notEquals("O'Malley")}` // cat != 'O\\'Malley'
`${field('age').isGreaterThan(5)}` // age > '5'
`${field('age').isGreaterThan(5, true)}` // age >= '5'
`${field('age').isNotGreaterThan(5)}` // age <= '5'
`${field('age').isNotGreaterThan(5, true)}` // age < '5'
`${field('age').isLowerThan(10)}` // age < '10'
`${field('age').isLowerThan(10, true)}` // age <= '10'
`${field('age').isNotLowerThan(10)}` // age >= '10'
`${field('age').isNotLowerThan(10, true)}` // age > '10'
```

### Between Filter

```js
import {field} from 'meilisearch-filters'

`${field('age').isBetween(5, 10)}` // age '5' TO '10'
`${field('age').isNotBetween(5, 10)}` // NOT age '5' TO '10'
`${field('age').isBetween(5, 10, false)}` // age > '5' AND age < '10'
`${field('age').isNotBetween(5, 10, false)}` // NOT (age > '5' AND age < '10')
```

### Exists Filter

```js
import {field} from 'meilisearch-filters'

`${field('god').exists()}` // god EXISTS
`${field('god').doesNotExist()}` // god NOT EXISTS
```

### Empty Filter

```js
import {field} from 'meilisearch-filters'

`${field('glass').isEmpty()}` // glass IS EMPTY
`${field('glass').isNotEmpty()}` // glass IS NOT EMPTY
```

### Null Filter

```js
import {field} from 'meilisearch-filters'

`${field('nullish').isNull()}` // nullish IS NULL
`${field('nullish').isNotNull()}` // nullish IS NOT NULL
```

### IN Filter

```js
import {field} from 'meilisearch-filters'

const cat = field('cat')
`${cat.isIn(['Berlioz', "O'Malley"])}` // cat IN ['Berlioz', 'O\\'Malley']
`${cat.isNotIn(['Berlioz', "O'Malley"])}` // cat NOT IN ['Berlioz', 'O\\'Malley']
```

### Geographic filters

```js
import {withinGeoRadius, notWithinGeoRadius} from 'meilisearch-filters'

`${withinGeoRadius(50.35, 3.51, 3000)}` // _geoRadius(50.35, 3.51, 3000)
`${notWithinGeoRadius(50.35, 3.51, 3000)}` // NOT _geoRadius(50.35, 3.51, 3000)
```

```js
import {withinGeoBoundingBox, notWithinGeoBoundingBox} from 'meilisearch-filters'

`${withinGeoBoundingBox([50.55, 3], [50.52, 3.08])}` // _geoBoundingBox([50.55, 3], [50.52, 3.08])
`${notWithinGeoBoundingBox([50.55, 3], [50.52, 3.08])}` // NOT _geoBoundingBox([50.55, 3], [50.52, 3.08])
```

### Composite filters

```js
import {field} from 'meilisearch-filters'

const cat = field('cat')
const color = field('color')
const age = field('age')
`${cat.equals("Berlioz").and(age.between(5, 10))}` // cat = 'Berlioz' AND age '5' TO '10'
`${cat.equals("Berlioz").or(age.between(5, 10))}` // cat = 'Berlioz' OR age '5' TO '10'

// Automatic grouping
`${color.equals('ginger').or(cat.equals("Berlioz").and(age.between(5, 10)))}` // color = 'ginger' OR (cat = 'Berlioz' AND age '5' TO '10')
```

### NOT filter

```js
import {field, not} from 'meilisearch-filters'

const color = field('ginger')
`${not(color.equals('ginger'))}` // NOT color = 'ginger' 
```

### Adding parentheses

```js
import {field, group} from 'meilisearch-filters'

const color = field('ginger')
`${group(color.equals('ginger'))}` // (color = 'ginger') 
```

# Installation

```
npm install meilisearch-filters --save # If you're using NPM
yarn add meilisearch-filters # If you're using Yarn
```

# Tests

```
npm run test # If you're using NPM
yarn test # If you're using Yarn
```

# License

MIT.
