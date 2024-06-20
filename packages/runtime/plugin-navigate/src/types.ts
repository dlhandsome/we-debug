import {
  IPluginInstance,
} from '@we-debug/core';

export * from '@we-debug/core';

export interface IPlugin extends IPluginInstance {
  installed?: boolean;
}

export interface IPluginInitOption {
  title: string;
  name?: string;
  desc?: string;
  url: string;
}

export type IPluginInitOptions = IPluginInitOption | IPluginInitOption[];
  