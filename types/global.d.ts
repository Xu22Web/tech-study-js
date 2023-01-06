declare global {
  module '*?raw' {
    const cssText: string;
    export default cssText;
  }
  function md5(value: string): string;
  /**
   * @description 消息模板类型
   */
  type TemplateType = 'html' | 'txt' | 'json' | 'markdown' | 'cloudMonitor';
  /**
   * @description 推送选项
   */
  type PushOptions = {
    title: string;
    content: string;
    template: TemplateType;
    toToken?: string;
    fromToken: string;
  };
  /**
   * @description 模态框
   */
  type ModalOptions = {
    title: string;
    subTitle?: string;
    content: string | string[];
    to?: string;
    from?: string;
    type: ModalType;
  };
  /**
   * @description 类型
   */
  type ModalType = 'info' | 'warn' | 'fail' | 'success';
}

export {};
