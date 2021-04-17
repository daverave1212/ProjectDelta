
import { last } from './Utils.mjs'

import * as Grammar from './Grammar.mjs'

import { Node } from './Expressions.mjs'

let parenthesisToSubtype = {
    '(': 'PARENTHESIS',
    '[': 'INDEX'
}

export function parenthesize(tokens) {
    let currentScope = null
    let currentExpression = null
    let parenthesisStack = []

    function addNewLineExpression() {
        let newExpression = new Node({
            parent: currentScope,
            content: [],
            type: 'EXPRESSION:LINE'
        })
        currentScope.content.push(newExpression)
        currentExpression = newExpression
    }
    function addNewScopeAndLineExpression() {
        let newScope = new Node({
            parent: currentScope,
            content: [],
            type: 'SCOPE'
        })
        if (currentScope != null) // If not base scope
            currentScope.content.push(newScope)
        currentScope = newScope
        addNewLineExpression()
    }
    function branchNewExpression(type) {
        let newExpression = new Node({
            parent: currentExpression,
            content: [],
            type: type
        })
        currentExpression.content.push(newExpression)
        currentExpression = newExpression
    }
    function getCurrentLineExpression() { return last(currentScope.content) }

    addNewScopeAndLineExpression()
    let baseScope = currentScope

    const assertParenthesisCloseOK = (tokenType) => {
        let stackTop = parenthesisStack[parenthesisStack.length - 1]
        if (Grammar.parenthesisOpposites[stackTop] != tokenType)
            throw `Wrong parenthesis closed at token "${token.value}"`
    }
    const isEndOfLine = () => parenthesisStack.length == 0 || parenthesisStack[parenthesisStack.length - 1] == '{'

    for (let token of tokens) {
        switch (token.type) {
            case '{':
                parenthesisStack.push(token.type)
                addNewScopeAndLineExpression()
                break
            case '(':
            case '[':
                parenthesisStack.push(token.type)
                branchNewExpression('EXPRESSION:' + parenthesisToSubtype[token.type])
                break
            case '}':
                assertParenthesisCloseOK(token.type)
                if (getCurrentLineExpression().isEmptyExpression()) {       // If last added expression is empty
                    currentScope.content.pop()                              // Remove it
                }
                currentScope = currentScope.parent
                addNewLineExpression()
                parenthesisStack.pop()
                break
            case ')':
            case ']':
                assertParenthesisCloseOK(token.type)
                currentExpression = currentExpression.parent
                parenthesisStack.pop()
                break
            case 'NEWLINE':
                if (isEndOfLine()) {
                    if (getCurrentLineExpression().isEmptyExpression()) // If we already pushed a new empty line (e.g. Enter -> Enter), don't add another
                        continue
                    addNewLineExpression()
                }
                break
            default:
                currentExpression.content.push(new Node({
                    parent: currentExpression,
                    content: token.value,
                    type: token.type
                }))
                // console.log(currentExpression.content.map(node => node.toString()))
                // console.log(currentScope.toString())
        }
    }
    return baseScope
}


