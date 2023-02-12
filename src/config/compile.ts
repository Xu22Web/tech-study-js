import ts from 'typescript';
import { ModuleFormat } from 'rollup';
import terser from '@rollup/plugin-terser';
/**
 * @description 编译配置
 */
const COMPILE_CONFIG = {
  input: {
    file: 'src/index.ts',
  },
  output: {
    file: 'tech-study.js',
  },
  /**
   * @description 目标版本
   */
  target: ts.ScriptTarget.ESNext,
  /**
   * @description 模块版本
   */
  module: ts.ModuleKind.ESNext,
  /**
   * @description 是否压缩代码
   */
  compress: true,
  /**
   * @description rollup 配置
   */
  rollupConfig: {
    inputOptions: { input: 'src/index.js' },
    outputOptions: {
      file: 'src/index.min.js',
      format: <ModuleFormat>'es',
      plugins: [terser()],
    },
  },
};

export default COMPILE_CONFIG;
