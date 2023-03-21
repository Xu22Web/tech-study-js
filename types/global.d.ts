declare global {
  module '*?raw' {
    const text: string;
    export default text;
  }
  function md5(value: string): string;
}

export {};
