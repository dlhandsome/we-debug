import File from 'vinyl';

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

export type Meta<T extends IAnyObject = IAnyObject>  = ICompilerOption<T> & { pages: string[] };

export interface IPlugin<T extends IAnyObject = IAnyObject>  {
  /** 插件生命周期钩子声明 */
  lifecycles: IRegistration[];
  /** 插件元信息 */
  meta: Meta<T>;
  /** 注册插件 */
  register(options: IRegistration): void;
  /** 获取插件生命周期钩子声明 */
  getLifecycles(): IRegistration[];
  /** 执行插件生命周期钩子声明 */
  execLifecycle(lifetime: keyof IRegistration, file: File): void;
  /** 加载插件 */
  loadPlugin(pkg: string | PackageFunc): void;
  /** 初始化插件列表 */
  initPlugin(packges: IPackageOption<T>[], meta: Meta): void;
}

export type PackageFunc<T extends IAnyObject = IAnyObject> = (register: IPlugin, options: T) => void;

/**
 * 插件
 */
export type PackageParam<T extends IAnyObject = IAnyObject> = string | PackageFunc<T>;

/**
 * 插件参数
 */
export interface IPackageOption<T extends IAnyObject = IAnyObject> {
  package: PackageParam<T>;
  options: T;
}

/**
 * 编译函数入口参数
 */
export interface ICompilerOption<T extends IAnyObject = IAnyObject> {
  /**  */
  baseDir?: string;
  wxml?: string;
  filter?: FilterOption;
  compName?: string;
  compPath?: string;
  entryFile?: string;
  plugins?: IPackageOption<T>[];
}
