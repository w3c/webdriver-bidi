#!/usr/bin/env node

/**
 * Usage: node generate.js [pathToSpec]
 *
 * Parameters
 *
 * - pathToSpec: a path to the specification to extract CDDL definitions from. Default: _dirname/../../index.bs.
 */

import fs from 'fs';
import path from 'path';
import parse5 from 'parse5';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { getCDDLNodes } from './utils.js';

const spec = process.argv[2] || path.resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', 'index.bs')
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
