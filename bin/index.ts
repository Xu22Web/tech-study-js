import chalk from 'chalk';
import fs from 'fs';
import ora from 'ora';
import path from 'path';
import rollup from 'rollup';
import ts from 'typescript';
import COMPILE_CONFIG from '../src/config/compile';
import SCRIPT_CONFIG from '../src/config/script';
// 根目录 文件名
const { input, output, rollupConfig, compress } = COMPILE_CONFIG;
// 输入文件路径
const inputFilePath = input.file;
// 输入目录名
const inputDirPath = path.dirname(input.file);
// 输出文件路径
const outputFilePath = output.file;
// 输出目录名
const outputDirPath = path.dirname(output.file);
// 导入路径
const importFilePaths: string[] = [];
// 缓存
const cache: {
  [key: string]: { timeStamp: string; data: string; from: string; to: string };
} = JSON.parse(fs.readFileSync('cache.json', { encoding: 'utf-8' })) || {};

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
      originPath: string;
      originRelativePath: string;
    }
  | undefined
> => {
  // 全路径
  const fullFilePath = path.resolve(filePath);
  // 文件名
  const fileName = getFileName(filePath);
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

        resolve({
          data,
          compileName,
          originName: fileName,
          originPath: fullFilePath,
          originRelativePath: filePath,
        });
      },
      undefined,
      false,
      customTransformers
    );
  });
};
/**
 * @description 解析模块
 * @param filePath
 * @returns
 */
const resoveModule = async (
  rawModulePath: string
): Promise<{
  modulePath: string;
  time: string | undefined;
  stats: boolean;
}> => {
  // 文件路径
  const modulePath = path.join(rawModulePath);
  // 后缀
  const ext = path.extname(modulePath);
  // 文件名
  const fileName = getFileName(modulePath);
  // 路径存在状态
  const { stats, time } = handleFileStatus(modulePath);
  // 文件存在
  if (stats) {
    return { modulePath, time, stats };
  }
  // 存在扩展
  if (!ext.length) {
    // 加后缀
    const res = await resoveModule(`${modulePath}.ts`);
    if (res.stats) {
      return res;
    }
    if (fileName !== 'index.ts') {
      const res = await resoveModule(`${modulePath}/index.ts`);
      if (res.stats) {
        return res;
      }
    }
  }
  return { modulePath, time, stats };
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
      const { mtime } = fileInfo;
      return { stats: true, time: mtime.toJSON() };
    }
  }
  return { stats: false };
};
/**
 * @description 生成配置
 * @param filePath
 * @returns
 */
const createOptions = (filePath: string): ts.CreateProgramOptions => {
  const { target, module } = COMPILE_CONFIG;
  // 项目配置
  const programOptions = {
    rootNames: [filePath],
    options: {
      target,
      module,
      outputDirPath,
    },
  };
  return programOptions;
};
/**
 * @description 创建用户脚本注释配置
 * @returns
 */
const createConfigComment = () => {
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
  return data.join('\r\n');
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
        const rawSpecificPath = moduleText.match(
          /(?<=(["'`]))(?:\.{0,2}(?:\/|(?:\\{1,2}))[-_.a-zA-Z]*)+(?=\?raw\1)/
        );
        if (identifierText && rawSpecificPath) {
          // 提取模块相对路径
          const [relativefilePath] = rawSpecificPath;
          // 获取实际路径
          const filePath = path.resolve(inputDirPath, relativefilePath);
          // 获取文本信息
          const content = fs
            .readFileSync(filePath, {
              encoding: 'utf8',
            })
            .replace(/\n|\\n/g, '');
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
  const progress = ora('准备编译生成脚本文件...');
  // 数据
  const fullData: string[] = [];

  // 注释
  progress.start(`正在生成 ${chalk.blueBright('用户脚本配置')} 注释...`);
  // 用户脚本注释配置
  const config = createConfigComment();
  fullData.push(config);
  // 注释
  progress.succeed(`已生成 ${chalk.blueBright('用户脚本配置')} 注释!`);

  // 解析模块
  const { modulePath } = await resoveModule(inputFilePath);
  progress.start(`正在编译... ${chalk.blueBright(modulePath)}`);
  // 编译
  const res = await handleCompile(modulePath);
  if (res) {
    // 编译信息
    const { compileName, data } = res;
    // 脚本内容
    const content: string[] = [];
    content.push(data);
    progress.succeed(
      `完成编译: ${chalk.blueBright(modulePath)} -> ${chalk.blueBright(
        compileName
      )}`
    );
    // 编译相对路径
    const compileRelativePath = path.join(inputDirPath, compileName);

    // 源文件名 编译文件名 数据
    for (const i in importFilePaths) {
      // 相对路径
      const relativefilePath = importFilePaths[i];
      // 文件路径
      const filePath = path.join(inputDirPath, relativefilePath);
      // 解析模块
      const { time, modulePath, stats } = await resoveModule(filePath);

      progress.start(`正在编译... ${chalk.blueBright(modulePath)}`);
      // 存在模块
      if (stats) {
        // 缓存
        if (cache[modulePath]) {
          const { timeStamp, from, to } = cache[modulePath];
          if (time === timeStamp) {
            // 缓存取数据
            content.push(cache[modulePath].data);
            progress.succeed(
              `缓存编译: ${chalk.blueBright(from)} -> ${chalk.blueBright(to)}`
            );
            continue;
          }
        }

        // 编译
        const res = await handleCompile(modulePath);
        if (res) {
          // 编译信息
          const { originRelativePath, compileName, data } = res;
          content.push(data);
          // 缓存
          cache[modulePath] = {
            timeStamp: <string>time,
            data,
            from: originRelativePath,
            to: compileName,
          };
          progress.succeed(
            `直接编译: ${chalk.blueBright(
              originRelativePath
            )} -> ${chalk.blueBright(compileName)}`
          );
          continue;
        }
      }
      progress.fail(`编译失败: ${chalk.red(filePath)}, 请检查导入文件路径!`);
      break;
    }

    progress.start(`正在生成js文件...`);
    // 生成js文件
    fs.writeFileSync(compileRelativePath, content.join('\r\n'));
    progress.succeed(`生成js文件成功!`);

    if (compress) {
      progress.start(`正在压缩js文件...`);
      // rollup 压缩
      const bundle = await rollup.rollup(rollupConfig.inputOptions);
      const { output } = await bundle.write(rollupConfig.outputOptions);
      fullData.push(output[0].code);
      progress.succeed(`压缩js文件成功!`);
    } else {
      fullData.push(content.join('\r\n').replace(/(\r\n){2,}/g, '\r\n'));
    }

    progress.start(
      `正在导出整合的脚本文件... ${chalk.blueBright(outputFilePath)}`
    );
    // 导出文件
    fs.writeFileSync('cache.json', JSON.stringify(cache));
    // 导出文件
    fs.writeFileSync(outputFilePath, fullData.join('\r\n'));
    progress.succeed(`导出整合的脚本文件: ${chalk.blueBright(outputFilePath)}`);
    return;
  }
  progress.fail(`编译失败,请检查文件路径!`);
};

main();
