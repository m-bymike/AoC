const process = require('process')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
})

const serialNumbers: string[] = []

rl.on('line', (line: string): void => {
  serialNumbers.push(line)
})

rl.on('close', () => {
  const withOneCharDifference: string[] = serialNumbers
    .filter((i: string) => serialNumbers.some((v) => hasDistanceOne(i, v)))

  if (withOneCharDifference.length !== 2) console.log('did not find two results')

  const similarChars: string = filterSimilarChars(
    withOneCharDifference[0],
    withOneCharDifference[1]
  )

  console.log(`Resulting string: ${similarChars}`)
});

function filterSimilarChars(a: string, b: string): string {
  let res: string = ''
  for (let i = 0; i < a.length; ++i) {
    if (a[i] === b[i]) res += a[i]
  }

  return res
}

function hasDistanceOne(a: string, b: string):boolean {
  if (a === b) return false
  if (Math.abs(a.length - b.length) > 1) return false

  let diffCount = 0
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) diffCount++
    if (diffCount > 1) return false
  }

  return true
}
