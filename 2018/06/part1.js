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
  const ooB = (x, y) => x <= borders.tl.x || x >= borders.br.x || y <= borders.tl.y || y >= borders.br.y
  const mDist = (x, y, curX, curY) => Math.abs(curX - x) + Math.abs(curY - y)
  const grid = new Array(borders.br.y).fill(undefined).map(() => new Array(borders.br.x).fill(undefined))
  return Promise.all(grid.map(async (row, curY) =>
    row.map((_, curX) =>
      points
        .map(([x, y]) => [x, y, mDist(x, y, curX, curY)])
        .reduce((a, c) => {
          if (a[0][2] === undefined) return [c]
          if (a[0][2] === c[2]) return [...a, c]
          if (a[0][2] > c[2]) return [c]
          return [...a]
        }, [[]])
        .reduce((_, c) => c.length === 1 ? c[0] : undefined)
    )
  )
  )
    .then((grid) => Promise.all(points.map(async ([x, y]) => grid.reduce((a, row, curY) => a + row.reduce((a, c, curX) => {
      if (!c) return a
      const [cx, cy] = c
      if (cx !== x || cy !== y) return a
      if (ooB(curX, curY)) return Infinity
      return a + 1
    }, 0), 0))))
    .then((list) => list.filter(n => n !== Infinity).sort((a, b) => b - a))
}

