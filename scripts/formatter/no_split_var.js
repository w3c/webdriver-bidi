#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const specPath = path.resolve(__dirname, '..', '..', 'index.bs')
const specLines = fs.readFileSync(specPath, 'utf-8')
    .toString()
    .split('\n');

let failed = [];
const openClosePairs = [["[=", "=]"], ["<dfn", "</dfn"], ["<var", "</var"], ["[", "]"], ["<code", "</code"]];

for (let i = 0; i < specLines.length; i++) {
  const line = specLines[i];
  for (let pair of openClosePairs) {
    if (line.lastIndexOf(pair[0]) > line.lastIndexOf(pair[1])) {
      failed.push(
          `Unclosed ${line.substring(line.lastIndexOf(pair[0]))} at line ${i
          + 1}`)
    }
  }

  if ((line.split("|") - 1).length % 2) {
    failed.push(
        `Unclosed ${line.substring(line.lastIndexOf("|"))} at line ${i + 1}`)
  }
}

if (failed.length > 0) {
  throw new Error(`${failed.length} errors found:\n${failed.join("\n")}`);
}
