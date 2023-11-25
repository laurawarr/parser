const assert = require('assert')

/**
 * Main test runner
 */
const { Parser } = require('../src/Parser');

const tests = [
    require('./literals.test'),
    require('./statement-list.test'),
    require('./block.test'),
    require('./empty-statement.test')
]

const parser = new Parser();

function test(program, expected) {
    const ast = parser.parse(program)
    assert.deepEqual(ast, expected)
}

tests.forEach(testRun => testRun(test))
console.log('All assertions passed!')

/**
 * Manual test exec
 */
function exec() {
    const program = `

    /**
     * Documentation comment
     */
    "hello";

    // Number
    42;
    `

    const ast = parser.parse(program)

    console.log(JSON.stringify(ast, null, 2))
}

// exec()