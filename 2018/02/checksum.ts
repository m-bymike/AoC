// @ts-ignore
const process = require('process')
// @ts-ignore
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
})

const collector = {
  numberOfLinesWithExactlyTwo: 0,
  numberOfLinesWithExactlyThree: 0,
}

rl.on('line', (line: string): void => {
  const m: CharCountMap = countLetters(line)
  collector.numberOfLinesWithExactlyTwo += hasExactlyTwoOfAnyLetters(m) ? 1 : 0
  collector.numberOfLinesWithExactlyThree += hasExactlyThreeOfAnyLetters(m) ? 1 : 0
})

rl.on('close', () => {
  const sum: number = collector.numberOfLinesWithExactlyTwo * collector.numberOfLinesWithExactlyThree
  const res: string = `Checksum: ${sum}`

  console.log(res)
});

function countLetters (serial: string): CharCountMap {
  return serial.split('').reduce((a, c) => ({
    ...a,
    [c]: (a[c] || 0) + 1
  }), {})
}


function hasExactlyTwoOfAnyLetters(m: CharCountMap): boolean {
  return containsNumberCb(2)(m)
}

function hasExactlyThreeOfAnyLetters(m: CharCountMap): boolean {
  return containsNumberCb(3)(m)
}

function containsNumberCb(n: number): (m: CharCountMap) => boolean {
  return (m: CharCountMap) => Object.keys(m).some((c: string): boolean => m[c] === n)
}

interface CharCountMap {
  [key: string]: number
}
