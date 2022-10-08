declare global {
  declare module '*?raw' {
    const cssText: string;
    export default cssText;
  }
  function md5(value: string);
  function GM_addElement(tag_name: string, attributes: object);
  function GM_addElement(
    parent_node: Element,
    tag_name: string,
    attributes: object
  );
}

export {};
