export interface IAnyObject {
  [x: string]: any;
}

export type IEventFn = (...args: any[]) => any;

export interface IEventFns {
  [x: string]: IEventFn[] | null;
};

export interface IEventObjKey {
  event: string;
  fn: IEventFn;
}

export type singleEventKey = string | IEventObjKey;

export type IEventKey = singleEventKey | singleEventKey[];

export interface IBaseModel {
  id: number;
}

/**
 * Base Model 构造器参数
 */
export interface IBaseManageConstructorOption extends IBaseModel {
  handler: (...args: any[]) => any;
}

/**
 * 组件定位
 */
export interface IPosition {
  /** 对应绝对定位 left 属性 */
  left?: number;
  /** 对应绝对定位 top 属性 */
  top?: number;
  /** 对应绝对定位 right 属性 */
  right?: number;
  /** 对应绝对定位 bottom 属性 */
  bottom?: number
}

/**
 * badge model 构造器属性
 */
export interface IBadgeManageConstructorOption extends IBaseManageConstructorOption {
  /** 胶囊左边的内容 */
  key: string;
  /** 胶囊右边的内容 */
  value: string | number;
  /** 胶囊的颜色类型 */
  color: string;
  /** 是否展示 */
  show: boolean;
  /** 是否允许组件拖拽 */
  draggable: boolean;
  /** 组件定位坐标 */
  position: IPosition;
  /** 组件样式内容 */
  styles: string;
  /** 是否只展示文字 */
  textOnly: boolean;
}

/** 规则表单类型 */
export type FormRuleType = 'button' | 'arrow' | 'switch';

/**
 * 规则表单 FormRule 构造器属性
 */
export interface IFormRuleManageConstructorOption extends IBaseManageConstructorOption {
  title: string;
  desc: string;
  meta: string | number;
  type: FormRuleType;
  state: IAnyObject;
}

/**
 * 功能分组排序函数类型
 */
export type compareFn = (a: string, b: string) => number;

/**
 * wx api key 类型
 */
export type WxKey = keyof WechatMiniprogram.Wx;

/**
 * 桥接函数
 */
export type GetBridgeInfoFunc =  ((key: string, callback: (...args: any[]) => any) => void) & { hasEventBind?: boolean; };

/**
 * 新增表单规则函数参数
 */
export interface IAddFormRuleOption {
  group?: string | string[];
}

/**
 * we-debug init 参数
 */
export interface IWedebugInitOption {
  /** debug 启动按钮属性配置 */
  launcher?: IAnyObject;
  /** 内置功能插件配置 */
  plugin?: {
    /** 调试抓包属性配置 */
    network?: IAnyObject;
    /** jsError日志属性配置 */
    error?: IAnyObject;
    /** 路由插件配置 */
    router?: IAnyObject;
    /** 视觉搞对比属性配置 */
    uiCheck?: IAnyObject;
  }
}
