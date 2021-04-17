import * as fs from 'fs'

import * as Utils from './Utils.mjs'

import * as Grammar from './Grammar.mjs'

import * as Lexer from './Lexer.mjs'
import { Node } from './Expressions.mjs'
import { parenthesize } from './Parenthesizer.mjs'


export function start(code) {
    let tokens = Lexer.splitCodeIntoTokens(code, Grammar.operators, Grammar.separators)
    let lines = parenthesize(tokens)
    return lines
}

const code = fs.readFileSync('tests/source.dlt', {encoding:'utf8', flag:'r'})


console.log(start(code).toString())