// @ts-ignore
const process = require('process')
// @ts-ignore
const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin,
})

class Step {
    constructor(
        readonly id: string,
        public depends: string[],
        public children: string[],
        public completed: boolean = false,
        public built: boolean = false,
    ) { }


}

class NodeMap {
    private readonly nodes:{[id: string]: Step} = {}

    done(): boolean {
        return this.array().every(s => s.built)
    }

    array(): Step[] {
        return Object.keys(this.nodes).sort().map(k => this.nodes[k])
    }

    add(step: Step): void {
        this.nodes[step.id] = step
    }

    get(id: string): Step|undefined {
        return this.nodes[id]
    }

    has(id: string): boolean {
        return this.nodes[id] !== undefined
    }

    addChildTo(id: string, child: string) {
        this.nodes[id] && this.nodes[id].children.push(child)
    }

    addDependencyTo(id: string, dependency: string) {
        this.nodes[id] && this.nodes[id].depends.push(dependency)
    }

    finish(id: string) {
        if (this.nodes[id]) {
            this.nodes[id].built = true
        }
    }

    complete(id: string) {
        if (this.nodes[id]) {
            this.nodes[id].completed = true
        }
    }

    findNextNodeToBuild(exclude: string[]) {
        return this.array()
            .filter(n => !n.built && !exclude.includes(n.id))
            .find(n => n.depends.length === 0 || n.depends.every(k => this.get(k).built))
    }
}

const nodes: NodeMap = new NodeMap


rl.on('line', (line) => {
    const [, from, to] = line.match(/Step (\w) must be finished before step (\w) can begin\./)
    if (!nodes.has(from)) {
        nodes.add(new Step(from, [], [to]))
    } else {
        nodes.addChildTo(from, to)
    }

    if (!nodes.has(to)) {
        nodes.add(new Step(to, [from], []))
    } else {
        nodes.addDependencyTo(to, from)
    }
})

rl.on('close', async () => {
    //console.log(Object.keys(nodes).sort().map(k => nodes[k]))
    const path = visitNodes()
    console.log(`path: ${path.join('')}`)

    const nrOfElves = 5
    const timeForStep = 60

    const elves = new Array(nrOfElves).fill(1).map(() => new ElfWorker)
    let timeSpent = 0

    for (; !nodes.done(); ++timeSpent) {
        elves.forEach(e => {
            e.tick()
            if (e.node && !e.isBusy()) {
                nodes.finish(e.node)
                e.node = undefined
            }
        })
        while (elves.some(e => !e.isBusy())) {
            const elfIdx = elves.findIndex(e => !e.isBusy())
            const step = nodes.findNextNodeToBuild(elves.map(e => e.node))

            if (!step) break

            const stepTime = step.id.charCodeAt(0) - 64 + timeForStep
            elves[elfIdx].busyFor = stepTime
            elves[elfIdx].node = step.id
        }

        const t = elves.map(({node, busyFor}) => `${node ? node : '.'}(${busyFor < 10 ? '0' + busyFor : busyFor})`).join(' ')
        console.log(`${timeSpent < 10 ? '0' + timeSpent : timeSpent} ${t}`)
    }

    console.log(`Time to finish: ${timeSpent - 1}`)
});

function findFirstNode(nodes) {
    const candidates = nodes.array().reduce((a, n) => n.depends.length === 0 ? [...a, n.id] : a, [])
    return candidates.sort()[0]
}
function visitNodes(n = undefined) {
    const toVisit = [n || findFirstNode(nodes)]
    const path = []
    while (toVisit.length > 0) {
        const n = toVisit.sort()[0]
        toVisit.splice(toVisit.indexOf(n), 1)
        const node = nodes.get(n)
        if (node.completed) continue
        if (node.depends.some(n => !nodes.get(n).completed)) {
            toVisit.push(...node.depends)
            continue
        }
        nodes.complete(n)
        toVisit.push(...node.children)
        path.push(n)
    }

    return path
}

class ElfWorker {
    public node
    public busyFor: number = 0
    isBusy() {
        return this.busyFor > 0
    }
    tick() {
        this.busyFor = Math.max(0, this.busyFor - 1)
    }
}
