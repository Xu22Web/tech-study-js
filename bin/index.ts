import fs from 'fs';
import path from 'path';
import ts from 'typescript';
import config from '../src/plugin.config';
// console.log(config);

// 文件夹名
const sourceFileDir = 'src';
// 文件路径
const sourceFilePath = path.resolve(sourceFileDir, 'tech-study.ts');
// 项目配置
const programOptions = {
  rootNames: [sourceFilePath],
  options: {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    outDir: '.',
  },
};

// 处理流程工厂
const transformerFactory: ts.TransformerFactory<ts.SourceFile> = (context) => {
  return (node) => {
    // 访问
    const visitor: ts.Visitor = (rootNode) => {
      // 节点
      const node = ts.visitEachChild(rootNode, visitor, context);
      // 是导入声明
      if (ts.isImportDeclaration(node)) {
        // 获取变量名
        const identifierText = node.importClause?.getText();
        // 获取导入模块名
        const moduleText = node.moduleSpecifier.getText();
        // 检查是否满足正则 /["'`](.*)\?raw["'`]/
        const res = moduleText.match(/["'`](.*)\?raw["'`]/);

        if (identifierText && res) {
          // 提取模块相对路径
          const [, relativefilePath] = res;
          // 获取实际路径
          const filePath = path.resolve(sourceFileDir, relativefilePath);
          // 获取文本信息
          const content = fs.readFileSync(filePath, {
            encoding: 'utf8',
          });
          // 创建变量标识符
          const name = ts.factory.createIdentifier(identifierText);
          // 创建字符串
          const value = ts.factory.createStringLiteral(content, true);
          // 创建变量声明
          const declaration = ts.factory.createVariableDeclaration(
            name,
            ts.factory.createToken(ts.SyntaxKind.ExclamationToken),
            ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
            value
          );
          // 创建声明列表 指定为 const
          const declaratioList = ts.factory.createVariableDeclarationList(
            [declaration],
            ts.NodeFlags.Const
          );
          // 创建变量声明
          return ts.factory.createVariableStatement(undefined, declaratioList);
        }
        return node;
      }
      return node;
    };
    // 调用 visitor
    return ts.visitNode(node, visitor);
  };
};

// 创建项目
const program = ts.createIncrementalProgram(programOptions);
// 根据项目配置获取源文件
const sourceFile = program.getSourceFile(sourceFilePath);
// 自定义处理流程
const customTransformers: ts.CustomTransformers = {
  before: [transformerFactory],
};
// 编译生成
const emitResults = program.emit(
  sourceFile,
  (name, text) => {
    const data: string[] = [];
    data.push('// ==UserScript==');
    for (const key in config) {
      if (typeof config[key] === 'string') {
        data.push(`// @${key}   ${config[key]}`);
      }
      if (Array.isArray(config[key])) {
        for (const i in config[key]) {
          data.push(`// @${key}   ${config[key][i]}`);
        }
      }
    }
    data.push('// ==/UserScript==');
    data.push(text.replace('export {};', ''));
    fs.writeFileSync(path.resolve(name), data.join('\n'), {});
  },
  undefined,
  false,
  customTransformers
);
// 编译结果信息
console.log(emitResults);
