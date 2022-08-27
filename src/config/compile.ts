import ts from 'typescript';
/**
 * @description 编译配置
 */
const COMPILE_CONFIG = {
  /**
   * @description 根目录
   */
  rootDir: 'src',
  /**
   * @description 文件
   */
  file: 'tech-study.ts',
  /**
   * @description 导出目录
   */
  outDir: '../',
  /**
   * @description 目标版本
   */
  target: ts.ScriptTarget.ESNext,
  /**
   * @description 模块版本
   */
  module: ts.ModuleKind.ESNext,
};

export default COMPILE_CONFIG;
