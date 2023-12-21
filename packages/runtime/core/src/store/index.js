import { MySet } from '../base/set';
import { Store } from '../base/store';
import { Event } from '../base/event';
import { Group } from './group';
import sys from './sys';

export default {
  sys,
  event: new Event(),
  badges: new MySet(),
  rules: new MySet(),
  group: new Group(),
  bridge: new Store()
};
