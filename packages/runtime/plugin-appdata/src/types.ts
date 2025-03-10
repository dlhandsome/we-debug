import {
  IPluginInstance,
} from '@we-debug/core';

export * from '@we-debug/core';

export interface IPlugin extends IPluginInstance {
  installed?: boolean;
}

export interface IPluginInitOption {
  editable?: boolean;
  expandLevel?: number;
}

export type IPluginInitOptions = IPluginInitOption;
