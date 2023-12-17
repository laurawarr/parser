module.exports = test => {
  // Binary expression
  test(`2 + 2;`,
  {
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "+",
            left: {
              type: "NumericLiteral",
              value: 2
            },
            right: {
              type: "NumericLiteral",
              value: 2
            }
          }
        }
      ]
  })

  // Nested binary expression
  // left: 3 + 2
  // right: 2
  test(`3 + 2 - 2;`,
  {
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "-",
            left: {
              type: "BinaryExpression",
              operator: "+",
              left: {
                type: "NumericLiteral",
                value: 3
              },
              right: {
                type: "NumericLiteral",
                value: 2
              }
            },
            right: {
              type: "NumericLiteral",
              value: 2
            }
          }
        }
      ]
  })

  // Binary expression
  // left: 2
  // right: 2
  test(`3 * 2;`,
  {
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "*",
            left: {
              type: "NumericLiteral",
              value: 3
            },
            right: {
              type: "NumericLiteral",
              value: 2
            },
          }
        }
      ]
  })

  // Nested binary expression
  // left: 3
  // right: 2 * 2
  test(`3 + 2 * 2;`,
  {
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "+",
            left: {
              type: "NumericLiteral",
              value: 3
            },
            right: {
              type: "BinaryExpression",
              operator: "*",
              left: {
                type: "NumericLiteral",
                value: 2
              },
              right: {
                type: "NumericLiteral",
                value: 2
              }
            }
          }
        }
      ]
  })

  // Nested binary expression
  // left: 1 * 2
  // right: 3
  test(`1 * 2 * 3;`,
  {
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "*",
            left: {
              type: "BinaryExpression",
              operator: "*",
              left: {
                type: "NumericLiteral",
                value: 1
              },
              right: {
                type: "NumericLiteral",
                value: 2
              }
            },
            right: {
              type: "NumericLiteral",
              value: 3
            }
          }
        }
      ]
  })

  //Precedence of operations
  // left: 1 + 2
  // right: 3
  test(`(1 + 2) * 3;`,
  {
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "*",
            left: {
              type: "BinaryExpression",
              operator: "+",
              left: {
                type: "NumericLiteral",
                value: 1
              },
              right: {
                type: "NumericLiteral",
                value: 2
              }
            },
            right: {
              type: "NumericLiteral",
              value: 3
            }
          }
        }
      ]
  })
}