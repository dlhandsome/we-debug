import {
  IPluginInstance,
} from '@we-debug/core';

export * from '@we-debug/core';

export interface IPlugin extends IPluginInstance {
  installed?: boolean;
}

export interface IPluginInitOption {
}

export type IPluginInitOptions = IPluginInitOption;
