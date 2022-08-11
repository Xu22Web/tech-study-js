import fs from 'fs';
import path from 'path';
import ts from 'typescript';

const filePath = path.resolve('src/index.ts');
const content = fs.readFileSync(filePath, {
  encoding: 'utf8',
});

const importMatch = /import (.*) from ["'](.*)\?raw["']/g;
// console.log(content.match(importMatch));

const compiler = ts.createProgram([filePath], {});

const files = compiler.getSourceFiles();


// console.log(compiler.emit());  

// console.log(content);
