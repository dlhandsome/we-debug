export interface IAnyObject {
  [key: string]: any;
}

export namespace WechatMiniprogram {
  export type AppJsonSubpage = {
    root: string;
    pages: string[];
  };
  export type AppJsonSubpages = AppJsonSubpage[];
  
  export interface IAppJson {
    pages: string[];
    subpackages?: AppJsonSubpages;
  }
}

export type ProcessDefine = (file: File, encoding?: string) => File | void;

export interface IRegistration {
  // 插件名称
  pluginName: string;
  // tool 初始化前执行
  beforeInit?: ProcessDefine;
  // tool 初始化时执行
  onInit?: ProcessDefine;
  // 检测到项目 wxml 文件后立即执行
  wxml?: ProcessDefine;
  // 插入 we-debug 片段之前执行
  beforeInsertWxml?: ProcessDefine;
  // 插入 we-debug 片段前执行
  afterInsertWxml?: ProcessDefine;
  // 检测到项目 json 文件后立即执行
  json?: ProcessDefine;
  // 检测到项目 js 文件后立即执行
  script?: ProcessDefine;
  // app.js 插入 we-debug import 片段前执行
  beforeInsertScript?: ProcessDefine;
  // app.js 插入 we-debug import 片段后执行
  afterInsertScript?: ProcessDefine;
}

export type FilterOption = string | Function | RegExp;

export interface IPlugin {
  /** 插件生命周期钩子声明 */
  lifecycles: IRegistration[];
  /** 插件元信息 */
  meta: IAnyObject;
  /** 注册插件 */
  register(options: IRegistration): void;
  /** 获取插件生命周期钩子声明 */
  getLifecycles(): IRegistration[];
  /** 执行插件生命周期钩子声明 */
  execLifecycle(lifetime: keyof IRegistration, file: File): void;
  /** 加载插件 */
  loadPlugin(pkg: string | PackageFunc): void;
  /** 初始化插件列表 */
  initPlugin(packges: IPackageOption[], meta: IAnyObject): void;
}

export type PackageFunc = (register: IPlugin, options: IAnyObject) => void;

/**
 * 插件
 */
export type PackageParam = string | PackageFunc;

/**
 * 插件参数
 */
export interface IPackageOption {
  package: PackageParam;
  options: IAnyObject;
}

/**
 * 编译函数入口参数
 */
export interface ICompilerOption {
  /**  */
  baseDir?: string;
  wxml?: string;
  filter?: FilterOption;
  compName?: string;
  compPath?: string;
  entryFile?: string;
  plugins?: IPackageOption[];
}
