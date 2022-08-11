"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const content = fs_1.default.readFileSync(path_1.default.resolve('src/index.ts'), {
    encoding: 'utf8',
});
const importMatch = /import (.*) from ["'](.*)\?raw["']/g;
console.log(content.match(importMatch));
// console.log(content);
