// @ts-ignore
const process = require('process')
// @ts-ignore
const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin,
})

const m = genMap()
let input = ''

rl.on('line', (line: string): void => {
    input += line
})

rl.on('close', async () => {
    const res = await spread(input)
    console.log(res.sort((a,b) => a.len - b.len))
});

async function spread(input) {
    const promises = 'abcdefghijklmnopqrstuvwxyz'
        .split('')
        .map(c => reducer(c, input))

    return Promise.all(promises)
}

function genMap() {
    const a = 'abcdefghijklmnopqrstuvwxyz'

    return {
        ...a.split('').reduce((a, c) => ({ ...a, [c]: c.toUpperCase() }), {}),
        ...a.split('').map(c => c.toUpperCase()).reduce((a, c) => ({ ...a, [c]: c.toLowerCase() }), {})
    }
}

async function reducer(removeChar: string, input: string) {
    let polymer = input.replace(new RegExp(removeChar, 'gi'), '')
    let len = polymer.length
    for (let i = 0; i < len; ++i) {
        if (m[polymer[i]] === polymer[i + 1]) {
            let tmp = polymer.slice(0, i) + polymer.slice(i + 2, len)
            polymer = tmp

            len = polymer.length
            i = Math.max(-1, i - 2)
        }
    }

    return {
        removeChar,
        len
    }
}


