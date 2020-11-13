#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const parse5 = require('parse5')

const { getCDDLNodes } = require('./utils')

const spec = path.resolve(__dirname, '..', '..', 'index.bs')
const specContent = fs.readFileSync(spec, 'utf-8')
const specParsed = parse5.parse(specContent)

/**
 * format the result and sort pre content to their corresponding classes
 */
const cddlContent = getCDDLNodes([specParsed]).reduce((val, node) => {
    if (!val[node.nodeClass]) {
        val[node.nodeClass] = []
    }
    val[node.nodeClass].push(node.content)
    return val
}, {})

/**
 * iterate over all pre cddl classes found in the document, sanitize the
 * content and write them to file.
 */
Object.entries(cddlContent).forEach(([cddlClass, content]) => {
    const fileContent = content
        /**
         * remove obsolete whitespace
         */
        .map((entry) => {
            const preceedingSpace = entry.split('\n').reduce((prev, line) => {
                if (line.length === 0) {
                    return prev
                }

                const spaces = line.match(/^\s+/)
                if (spaces) {
                    return Math.min(prev, spaces[0].length)
                }

                return 0
            }, Infinity)
            return entry
                .split('\n')
                .map((line) => line.slice(preceedingSpace))
        })
        /**
         * drop all cddl snippets without declarations, e.g.
         * ```
         * EmptyResult
         * ```
         */
        .filter((pre) => {
            return pre.filter(Boolean).length > 1
        })
        /**
         * join code lines
         */
        .map((pre) => pre.join('\n'))
        .join('\n')

    fs.writeFileSync(path.join(process.cwd(), `${cddlClass.split('-').shift()}.cddl`), fileContent)
})