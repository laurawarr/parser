const assert = require('assert')

/**
 * Main test runner
 */
const { Parser } = require('../src/Parser');

const tests = [
    require('./literals.test'),
    require('./statement-list.test'),
    require('./block.test'),
    require('./empty-statement.test'),
    require('./math.test')
]

const parser = new Parser();

function test(program, expected) {
    const ast = parser.parse(program)
    assert.deepEqual(ast, expected)
}

function runTests() {
    tests.forEach(testRun => testRun(test))
    console.log('All assertions passed!')
}

/**
 * Manual test exec
 */
function exec() {
    const program = `

    1 * (2 * 3);

    `

    const ast = parser.parse(program)

    console.log(JSON.stringify(ast, null, 2))
}

runTests()
// exec()