// @ts-ignore
const process = require('process')
// @ts-ignore
const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin,
})

const lines = []
rl.on('line', (line) => {
    lines.push(line)
})

rl.on('close', () => {
    const numbers: number[] = lines.join(' ').split(' ').map(n => parseInt(n))
    //console.log(numbers)
    const node: LNode = parseNode(numbers)
    //console.log(node)
    console.log(`Metadata sum: ${node.metadataSum()}`)
    console.log(`Value: ${node.value()}`)
})

class LNode {
    constructor(
        public readonly nrOfChildren: number,
        public readonly metadataLength: number = undefined,
        public readonly metadata: number[],
        public readonly children: LNode[],
    ) {}

    public metadataSum(): number {
        return this.children.reduce((a, c) => a + c.metadataSum(), this.metadata.reduce((a, c) => a + c, 0))
    }

    public value(): number {
        // If a node has no child nodes, its value is the sum of its metadata entries.
        if (this.nrOfChildren === 0) {
            return this.metadata.reduce((a, c) => a + c, 0)
        }

        return this.metadata.reduce((a, c) => a + (this.children[c - 1] ? this.children[c - 1].value() : 0), 0)
    }
}

function parseNode(numbers: number[]): LNode {
    const nrOfChildren = numbers.shift()
    const metadataLength = numbers.shift()
    let children = []

    for (let i = nrOfChildren; i > 0; --i) {
        children.push(parseNode(numbers))
    }

    const metadata = numbers.splice(0, metadataLength)
    return new LNode(
        nrOfChildren,
        metadataLength,
        metadata,
        children
    )
}


