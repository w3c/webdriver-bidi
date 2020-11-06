#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const spec = path.resolve(__dirname, '..', '..', 'index.bs')
const specContent = fs.readFileSync(spec, 'utf-8')

const preFormattedTexts = [...specContent.match(/<pre .*>([^<]*)<\/pre>/g)]
    /**
     * filter for CDDL code
     */
    .filter((pre) => pre.split('\n')[0].includes('cddl'))
    /**
     * drop HTML tags
     */
    .map((pre) => pre.split('\n').slice(1, -1))
    /**
     * remove obsolete whitespace
     */
    .map((pre) => {
        const preceedingSpace = pre.reduce((prev, line) => {
            if (line.length === 0) {
                return prev
            }
    
            const spaces = line.match(/^\s+/)
            if (spaces) {
                return Math.min(prev, spaces[0].length)
            }
    
            return 0
        }, Infinity)
        return pre.map((line) => line.slice(preceedingSpace))
    })
    /**
     * drop all cddl snippets without declarations, e.g.
     * ```
     * EmptyResult
     * ```
     */
    .filter((pre) => pre.length > 1)
    /**
     * join code lines
     */
    .map((pre) => pre.join('\n'))
    .join('\n')

fs.writeFileSync(path.join(process.cwd(), 'index.cddl'), preFormattedTexts)