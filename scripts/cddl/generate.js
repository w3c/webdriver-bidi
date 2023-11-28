#!/usr/bin/env node

/**
 * Usage: node generate.js [pathToSpec]
 *
 * Parameters
 *
 * - pathToSpec: a path to the specification to extract CDDL definitions from. Default: _dirname/../../index.bs.
 */

const fs = require('fs')
const path = require('path')
const parse5 = require('parse5')

const { getCDDLNodes } = require('./utils')

const spec = process.argv[2] || path.resolve(__dirname, '..', '..', 'index.bs')
const specContent = fs.readFileSync(spec, 'utf-8')
const specParsed = parse5.parse(specContent)

// Extract local and remote CDDL definitions from pre nodes of the parsed DOM.
const cddl = getCDDLNodes([specParsed]);

/**
 * iterate over all pre cddl classes found in the document, sanitize the
 * content and write them to file.
 */
Object.entries(cddl).forEach(([cddlName, entries]) => {
  const fileContent = entries
    /**
     * remove obsolete whitespace
     */
    .map((entry) => {
      const preceedingSpace = entry.split('\n').reduce((prev, line) => {
        if (line.trim().length === 0) {
          return prev
        }

        const spaces = line.match(/^\s+/)
        if (spaces) {
          return Math.min(prev, spaces[0].length)
        }

        return 0
      }, Infinity);

      return entry
        .split('\n')
        .map((line) => line.slice(preceedingSpace))
    })
    /**
     * join code lines
     */
    .map((pre) => pre.join('\n'))
    .join('\n');

  fs.writeFileSync(path.join(process.cwd(), `${cddlName}.cddl`), fileContent);
});
