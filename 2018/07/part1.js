// @ts-ignore
const process = require('process')
// @ts-ignore
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
})

const nodes = {}

rl.on('line', (line) => {
  const [, from, to] = line.match(/Step (\w) must be finished before step (\w) can begin\./)
  if (!nodes.hasOwnProperty(from)) {
    nodes[from] = {
      id: from,
      completed: false,
      depends: [],
      children: [to]
    }
  } else {
    nodes[from].children.push(to)
  }

  if (!nodes.hasOwnProperty(to)) {
    nodes[to] = {
      id: to,
      completed: false,
      depends: [from],
      children: [],
    }
  } else {
    nodes[to].depends.push(from)
  }
})

rl.on('close', async () => {
  console.log(Object.keys(nodes).sort().map(k => nodes[k]))
  console.log('path: ',visitNodes().join(''))

  //console.log(nodes)
});

function findFirstNode(nodes) {
  const candidates = Object.keys(nodes).reduce((a, k) => nodes[k].depends.length === 0 ? [...a, k] : a, [])
  return candidates.sort()[0]
}
function visitNodes(n) {
  const toVisit = [n || findFirstNode(nodes)]
  const path = []
  while (toVisit.length > 0) {
    const n = toVisit.sort()[0]
    toVisit.splice(toVisit.indexOf(n), 1)
    if (nodes[n].completed) continue
    if (nodes[n].depends.some(n => !nodes[n].completed)) {
      toVisit.push(... nodes[n].depends)
      continue
    }
    nodes[n].completed = true
    toVisit.push(...nodes[n].children)
    path.push(n)
  }

  return path
}

