import fs from 'fs';
import path from 'path';
import ts from 'typescript';
import ora from 'ora';
import chalk from 'chalk';
import SCRIPT_CONFIG from '../src/config/script';
import COMPILE_CONFIG from '../src/config/compile';
// 根目录 文件名
const { rootDir, file } = COMPILE_CONFIG;
// 文件路径
const sourceFilePath = path.resolve(rootDir, file);
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
          const filePath = path.resolve(rootDir, relativefilePath);
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
// 开始编译
const loading = ora('准备编译生成脚本文件！');
// 创建项目
const program = ts.createIncrementalProgram(programOptions);
// 根据项目配置获取源文件
const sourceFile = program.getSourceFile(sourceFilePath);
// 自定义处理流程
const customTransformers: ts.CustomTransformers = {
  before: [transformerFactory],
};
// 编译开始
loading.start('正在编译生成...');
// 导出文件
let outFile;
// 编译生成
program.emit(
  sourceFile,
  (name, text) => {
    outFile = path.resolve(name);
    // 注释
    loading.start(`正在生成 ${chalk.blueBright('UserScript')} 配置注释...`);
    // 脚本数据
    const data: string[] = [];
    data.push('// ==UserScript==');
    for (const key in SCRIPT_CONFIG) {
      if (typeof SCRIPT_CONFIG[key] === 'string') {
        data.push(`// @${key}   ${SCRIPT_CONFIG[key]}`);
      }
      if (Array.isArray(SCRIPT_CONFIG[key])) {
        for (const i in SCRIPT_CONFIG[key]) {
          data.push(`// @${key}   ${SCRIPT_CONFIG[key][i]}`);
        }
      }
    }
    data.push('// ==/UserScript==');
    // 注释
    loading.start(`已生成 ${chalk.blueBright('UserScript')} 配置注释！`);
    // 删除导出
    data.push(text.replace('export {};', ''));
    // 写入文件
    loading.start(`正在导出文件 ${chalk.blueBright('tech-study.js')}...`);
    fs.writeFileSync(outFile, data.join('\n'));
    // 写入文件完成
    loading.start(`已导出 ${chalk.blueBright('tech-study.js')}`);
  },
  undefined,
  false,
  customTransformers
);
// 编译结果信息
loading.succeed(`导出文件： ${chalk.blueBright(outFile)}`);
