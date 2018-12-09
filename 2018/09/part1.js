// players, marbles
const setup = [431, 70950 * 100]

const players = new Array(setup[0]).fill(0)
let currentPlayer = 0

let current = {
  value: 0,
}

current.next = current
current.prev = current

const addAfter = (value, marble) => {
  const toAdd = {
      value,
      prev: marble,
      next: marble.next,
  }
  marble.next.prev = toAdd
  marble.next = toAdd
  return toAdd
}

for (let i = 1; i < setup[1]; ++i) {
  if (i % 1000 === 0) console.log(setup[1] - i)
  //const marble = marbles[i]

  if (i && i % 23 === 0) {
    players[currentPlayer] += i
    current = current.prev.prev.prev.prev.prev.prev
    players[currentPlayer] += current.prev.value
    current.prev.prev.next = current
    current.prev = current.prev.prev

    continue
  } else {
    current = addAfter(i, current.next)
  }

  currentPlayer = (currentPlayer + 1) % players.length
}

console.log('High score:', players.reduce((a, c) => Math.max(a, c), 0))





