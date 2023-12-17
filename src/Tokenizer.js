const Spec = [
    // -----------------------------------
    // Whitespaces:
    [/^\s+/, null], // spaces

    // -----------------------------------
    // Comments:
    [/^\/\/.*/, null], // single line comment
    [/^\/\*[\s\S]*?\*\//, null], // multiline comment

    // -----------------------------------
    // Symbols and delimiters:
    [/^;/, ';'],
    [/^{/, '{'],
    [/^}/, '}'],
    [/^\(/, '('],
    [/^\)/, ')'],

    // -----------------------------------
    // Math operators:
    [/^[+\-]/, 'ADDITIVE_OPERATOR'], // + or -
    [/^[*\/]/, 'MULTIPLICATIVE_OPERATOR'], // * or /

    // -----------------------------------
    // Numbers:
    [/^\d+/, 'NUMBER'], // digits

    // -----------------------------------
    // Strings:
    [/^"[^"]*"/, 'STRING'], // double quotes
    [/^'[^']*'/, 'STRING'] // single quotes
]

class Tokenizer {
    /**
     * Initialize the string
     */
    init(string) {
        this._string = string
        this._cursor = 0
    }

    /**
     * Whether the tokenizer reached end of file
     */
    isEOF() {
        return this._cursor === this._string.length
    }

    /**
     * Whether we still have more tokens
     */
    hasMoreTokens() {
        return this._cursor < this._string.length
    }

    /**
     * Obtains next token
     */
    getNextToken() {
        if (!this.hasMoreTokens()) {
            return null
        }

        const string = this._string.slice(this._cursor)

        for (const [regexp, tokenType] of Spec) {
            const tokenValue = this._match(regexp, string)

            if (tokenValue === null) {
                continue
            }

            if (tokenType === null) {
                return this.getNextToken()
            }

            return {
                type: tokenType,
                value: tokenValue
            }
        }

        throw new SyntaxError(`Unexpected token: "${string[0]}"`)
    }

    /**
     * Matches a token for a regular expression
     */
    _match(regexp, string) {
        const matched = regexp.exec(string)
        if (matched == null) {
            return null
        }
        this._cursor += matched[0].length
        return matched[0]
    }
}

module.exports = {
    Tokenizer
}