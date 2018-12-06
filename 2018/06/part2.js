// @ts-ignore
const process = require('process')
// @ts-ignore
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
})

const points = []
rl.on('line', (line) => {
  points.push(line.split(',').map((n) => parseInt(n.trim())))
})

rl.on('close', async () => {
  console.log(await calc(points))
});

const calc = (points) => {
  const borders = {
    br: {
      x: points.reduce((a, [x,]) => Math.max(a, x), 0),
      y: points.reduce((a, [, y]) => Math.max(a, y), 0),
    },
    tl: {
      x: points.reduce((a, [x,]) => Math.min(a, x), points.reduce((a, [x,]) => Math.max(a, x), 0)),
      y: points.reduce((a, [, y]) => Math.min(a, y), points.reduce((a, [, y]) => Math.max(a, y), 0)),
    },
  }
  const mDist = (x, y, curX, curY) => Math.abs(curX - x) + Math.abs(curY - y)
  const grid = new Array(borders.br.y).fill(undefined).map(() => new Array(borders.br.x).fill(undefined))
  return Promise.all(grid.map(async (row, curY) =>
    row
      .map((_, curX) => points.reduce((a, [x, y]) => a + mDist(x, y, curX, curY), 0))
      .reduce((a, c) => c < 10000 ? a + 1 : a, 0)
  ))
    .then((rows) => rows.reduce((a, row) => a + row, 0))
}

