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
// 导入路径
const importFilePaths: string[] = [];
/**
 * @description 编译
 * @param filePath
 * @returns
 */
const handleCompile = async (
  filePath: string
): Promise<
  | {
      data: string;
      compileName: string;
      originName: string;
      compiltPath: string;
      originPath: string;
      relativePath: string;
    }
  | undefined
> => {
  // 后缀
  const ext = path.extname(filePath);
  // 完整路径
  const fullFilePath = path.resolve(rootDir, filePath);
  // 文件名
  const fileName = getFileName(filePath);
  // 路径存在状态
  const exists = handleFileStatus(fullFilePath);
  // 不存在 检查index.ts
  if (!exists) {
    if (!ext.length) {
      // 加后缀
      const res = await handleCompile(`${filePath}.ts`);
      if (res) {
        return res;
      }
      if (fileName !== 'index.ts') {
        const res = await handleCompile(`${filePath}/index.ts`);
        if (res) {
          return res;
        }
      }
    }
    return;
  }
  // 是文件
  if (exists) {
    // 创建配置
    const options = createOptions(fullFilePath);
    // 创建项目
    const program = ts.createIncrementalProgram(options);
    // 根据项目配置获取源文件
    const sourceFile = program.getSourceFile(fullFilePath);
    // 自定义处理流程
    const customTransformers: ts.CustomTransformers = {
      before: [transformerFactory],
    };
    return new Promise((resolve) => {
      // 编译生成
      program.emit(
        sourceFile,
        (name, text) => {
          // 编译后的文件数据
          const data = text.replace(/export (\{.*\}|default .*);/g, '');
          // 编译后的文件名
          const compileName = getFileName(name);
          const compiltPath = path.resolve(name);
          resolve({
            data,
            compileName,
            compiltPath,
            originName: fileName,
            originPath: fullFilePath,
            relativePath: filePath,
          });
        },
        undefined,
        false,
        customTransformers
      );
    });
  }
  return;
};
/**
 * @description 获取文件名
 * @param filePath
 * @returns
 */
const getFileName = (filePath) => {
  return filePath.substring(filePath.lastIndexOf('/') + 1);
};
/**
 * @description 文件存在
 * @param filePath
 * @returns
 */
const handleFileStatus = (filePath: string) => {
  // 路径存在状态
  const exists = fs.existsSync(filePath);
  // 路径存在
  if (exists) {
    // 文件信息
    const fileInfo = fs.statSync(filePath);
    // 是文件
    if (fileInfo.isFile()) {
      return true;
    }
  }
  return false;
};
/**
 * @description 生成配置
 * @param filePath
 * @returns
 */
const createOptions = (filePath: string): ts.CreateProgramOptions => {
  const { target, module, outDir } = COMPILE_CONFIG;
  // 项目配置
  const programOptions = {
    rootNames: [filePath],
    options: {
      target,
      module,
      outDir,
    },
  };
  return programOptions;
};
/**
 * @description 创建用户脚本注释配置
 * @returns
 */
const createCommentConfig = () => {
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
  return data.join('\n');
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
        // 检查是否满足路径
        const resSpecificPath = moduleText.match(
          /(?<=(["'`]))(?:\.{0,2}(?:\/|(?:\\{1,2}))[-_.a-zA-Z]*)+(?=\?raw\1)/
        );
        if (identifierText && resSpecificPath) {
          // 提取模块相对路径
          const [relativefilePath] = resSpecificPath;
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
        // 检查是否满足路径
        const resPath = moduleText.match(
          /(?<=(["'`]))(?:\.{0,2}(?:\/|(?:\\{1,2}))[-_.a-zA-Z]*)+(?=\1)/
        );
        // 检查是否满足路径
        if (resPath) {
          // 相对路径
          const relativefilePath = resPath[0];
          importFilePaths.push(relativefilePath);
          return ts.factory.createNotEmittedStatement(node);
        }
        return node;
      }
      // 导出声明
      if (ts.isExportDeclaration(node)) {
        return ts.factory.createNotEmittedStatement(node);
      }
      return node;
    };
    // 调用 visitor
    return ts.visitNode(node, visitor);
  };
};

// 主函数
const main = async () => {
  // 开始编译
  const progress = ora('准备编译生成脚本文件!');
  progress.start(`正在编译... ${chalk.blueBright(file)}`);
  // 编译
  const res = await handleCompile(sourceFilePath);

  if (res) {
    // 编译信息
    const { originName, compileName, compiltPath, data } = res;
    progress.succeed(
      `完成编译:${chalk.blueBright(originName)} -> ${chalk.blueBright(
        compileName
      )}`
    );
    // 数据
    const fullData: string[] = [];
    // 注释
    progress.start(`正在生成${chalk.blueBright('用户脚本配置')}注释...`);
    // 用户脚本注释配置
    const config = createCommentConfig();
    // 注释
    progress.start(`已生成${chalk.blueBright('用户脚本配置')}注释!`);
    fullData.push(config);
    // 源文件名 编译文件名 数据
    for (const i in importFilePaths) {
      const filePath = importFilePaths[i];
      progress.start(`正在编译... ${chalk.blueBright(filePath)}`);
      // 编译
      const res = await handleCompile(filePath);
      if (res) {
        // 编译信息
        const { relativePath: importRelativePath, data: importData } = res;
        progress.succeed(
          `完成编译:${chalk.blueBright(
            importRelativePath
          )} -> ${chalk.blueBright(compileName)}!`
        );
        fullData.push(importData);
        continue;
      }
      progress.fail(`编译失败,请检查导入文件路径!`);
      break;
    }
    fullData.push(data);
    progress.start(`正在导出文件... ${chalk.blueBright(compiltPath)}`);
    fs.writeFileSync(compiltPath, fullData.join('\n'));
    progress.succeed(`导出文件:${chalk.blueBright(compiltPath)}!`);
    return;
  }
  progress.fail(`编译失败,请检查文件路径!`);
};

main();
