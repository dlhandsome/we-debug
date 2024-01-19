import {
  IPluginInstance,
  IFormRuleManageConstructorOption
} from '@we-debug/core';
  
export * from '@we-debug/core';
  
export interface IPlugin extends IPluginInstance {
  installed?: boolean;
}

export type IPluginInitOption = Partial<IFormRuleManageConstructorOption>;
