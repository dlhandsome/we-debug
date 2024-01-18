import { MySet } from '../base/set';
import { Store } from '../base/store';
import { Event } from '../base/event';
import { Group } from './group';
import sys from './sys';
import {
  Badge,
  FormRule
} from '../model/index'

export default {
  sys,
  event: new Event(),
  badges: new MySet<Badge>(),
  rules: new MySet<FormRule>(),
  group: new Group(),
  bridge: new Store()
};
