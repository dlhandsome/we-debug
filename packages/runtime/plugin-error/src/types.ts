import {
  IPluginInstance,
  IBadgeManageConstructorOption,
  IFormRuleManageConstructorOption,
} from '@we-debug/core';

export * from '@we-debug/core';

export interface IPlugin extends IPluginInstance {
  installed?: boolean;
}

export interface IPluginInitOption {
  badge?: IBadgeManageConstructorOption,
  copyRule?: IFormRuleManageConstructorOption,
  clearRule?: IFormRuleManageConstructorOption
}
