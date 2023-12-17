const { Tokenizer } = require('./Tokenizer')

const DefaultFactory = {
    Program(body) {
        return {
            type: 'Program',
            body
        }
    },
    EmptyStatement() {
        return {
            type: 'EmptyStatement'
        }
    },
    BlockStatement(body) {
        return {
            type: 'BlockStatement',
            body
        }
    },
    ExpressionStatement(expression) {
        return {
            type: 'ExpressionStatement',
            expression
        }
    },
    StringLiteral(value) {
        return {
            type: 'StringLiteral',
            value
        }
    },
    NumericLiteral(value) {
        return {
            type: 'NumericLiteral',
            value: Number(value)
        }
    }
}

const SExpressionFactory = {
    Program(body) {
        return ['begin', body]
    },
    EmptyStatement() {},
    BlockStatement(body) {
        return ['begin', body]
    
    },
    ExpressionStatement(expression) {
        return expression
    },
    StringLiteral(value) {
        return `"${value}"`
    },
    NumericLiteral(value) {
        return value
    }
}

const AST_MODE = 'default'
const factory = AST_MODE === 'default' ? DefaultFactory : SExpressionFactory

class Parser {
    constructor() {
        this._string = ''
        this._tokenizer = new Tokenizer()
    }

    /**
     * Parse a string to AST
     */
    parse(string) {
        this._string = string;
        this._tokenizer.init(string)

        // Prime the tokenizer to obtain the first
        // token which is out lookahead. The lookahead is
        // used for predictive parsing.

        this._lookahead = this._tokenizer.getNextToken() 

        // Parse recursively starting from the main
        // entry point, the Program

        return this.Program();
    }

    /**
     * Main entry point
     * 
     * Program
     *      : StatementList
     *      ;
     */
    Program() {
        return factory.Program(this.StatementList())
    }

    /**
     * StatementList
     *      : Statement
     *      | StatementList Statement
     *      ;
     */
    StatementList(stopLookahead = null) {
        const statementList = [this.Statement()]

        while (this._lookahead != null && this._lookahead.type !== stopLookahead) {
            statementList.push(this.Statement())
        }

        return statementList
    }

    /**
     * Statement
     *      : ExpressionStatement
     *      | BlockStatement
     *      | EmptyStatement
     *      ;
     */
    Statement() {
        switch (this._lookahead.type) {
            case ';':
                return this.EmptyStatement()
            case '{':
                return this.BlockStatement()
            default:
                return this.ExpressionStatement()
        }
    }

    /**
     * EmptyStatement
     *      : ';'
     *      ;
     */
    EmptyStatement() {
        this._eat(';')

        return factory.EmptyStatement()
    }

    /**
     * BlockStatement
     *      : '{' OptStatementList '}'
     *      ;
     */
    BlockStatement() {
        this._eat('{')

        const body = this._lookahead.type !== '}' ? this.StatementList('}') : []

        this._eat('}')

        return factory.BlockStatement(body)
    }

    /**
     * ExpressionStatement
     *      : Expression ';'
     *      ;
     */
    ExpressionStatement() {
        const expression = this.Expression()
        this._eat(';')
        
        return factory.ExpressionStatement(expression)
    }

    /**
     * Expression
     *      : Literal
     *      ;
     */
    Expression() {
        return this.AdditiveExpression()
    }

    /**
     * AdditiveExpression
     *      : MultiplicativeExpression
     *      | AdditiveExpression ADDITIVE_OPERATOR MultiplicativeExpression
     *      ;
     */
    AdditiveExpression() {
        return this._BinaryExpression('MultiplicativeExpression', 'ADDITIVE_OPERATOR')
    }

    /**
     * MultiplicativeExpression
     *      : PrimaryExpression
     *      | MultiplicativeExpression MULTIPLICATIVE_OPERATOR PrimaryExpression
     *      ;
     */
    MultiplicativeExpression() {
        return this._BinaryExpression('PrimaryExpression', 'MULTIPLICATIVE_OPERATOR')
    }

    /**
     * Generic binary expression
     */
    _BinaryExpression(builderName, operatorToken) {
        let left = this[builderName]();

        while (this._lookahead.type === operatorToken) {
            const operator = this._eat(operatorToken).value;
            const right = this[builderName]();

            left = {
                type: 'BinaryExpression',
                operator,
                left,
                right
            }
        }

        return left
    }

    /**
     * PrimaryExpression
     *      : Literal
     *      | ParenthesizedExpression
     *      ;
     */
    PrimaryExpression() {
        switch (this._lookahead.type) {
            case '(':
                return this.ParenthesizedExpression()
            default:
                return this.Literal()
        }
    }

    /**
     * ParenthesizedExpression
     *      : '(' Expression ')'
     *      ;
     */
    ParenthesizedExpression() {
        this._eat('(')
        const expression = this.Expression();
        this._eat(')')

        return expression

    }

    /**
     * Literal
     *      : NumericLiteral
     *      | StringLiteral
     *      ;
     */
    Literal() {
        switch (this._lookahead.type) {
            case 'NUMBER':
                return this.NumericLiteral()
            case 'STRING':
                return this.StringLiteral()
        }
        throw new SyntaxError(`Literal: unexpected literal production`)
    }

    /**
     * StringLiteral
     *      : STRING
     *      ;
     */
    StringLiteral() {
        const token = this._eat('STRING')
        
        return factory.StringLiteral(token.value.slice(1, -1)) // remove quotes
    }

    /**
     * NumericLiteral
     *      : NUMBER
     *      ;
     */
    NumericLiteral() {
        const token = this._eat('NUMBER')
        return factory.NumericLiteral(Number(token.value))
    }

    /**
     * Expects a token of a given type
     */
    _eat(tokenType) {
        const token = this._lookahead

        if (token == null) {
            throw new SyntaxError(
                `Unexpected end of input, expected "${tokenType}"`
            )
        }
        if (token.type !== tokenType) {
            throw new SyntaxError(
                `Unexpected token: "${token.value}", expected "${tokenType}"`
            )
        }

        // Advance tokenizer to next token
        this._lookahead = this._tokenizer.getNextToken()

        return token
    }
}

module.exports = {
    Parser
}