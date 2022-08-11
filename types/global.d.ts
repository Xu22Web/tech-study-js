declare global {
  declare module '*?raw' {
    const cssText: string;
    export default cssText;
  }
  function md5(value: string);
}

export {};
