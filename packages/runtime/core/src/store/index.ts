import { MySet } from '../base/set';
import { Store } from '../base/store';
import { Event } from '../base/event';
import { Group } from './group';
import sys from './sys';
import {
  Badge,
  FormRule,
  JsonView,
  TableView
} from '../model/index'

export default {
  sys,
  event: new Event(),
  badges: new MySet<Badge>(),
  rules: new MySet<FormRule>(),
  jsonviews: new MySet<JsonView>(),
  tableviews: new MySet<TableView>(),
  group: new Group(),
  bridge: new Store()
};
