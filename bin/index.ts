import fs from 'fs';
import path from 'path';
import ts from 'typescript';

const content = fs.readFileSync(path.resolve('src/index.ts'), {
  encoding: 'utf8',
});

const importMatch = /import (.*) from ["'](.*)\?raw["']/g;
console.log(content.match(importMatch));

// console.log(content);
