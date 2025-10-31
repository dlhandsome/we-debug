import {
  WxKey,
  IAnyObject,
} from '../types';
import store from '../store/index';
import { isFunc } from '../utils/simple-type-function';

const requestApi: WxKey[] = ['request', 'downloadFile', 'uploadFile'];

requestApi.forEach(method => {
  const requestFunc: any = wx[method];

  Object.defineProperty(wx, method, {
    get:
      () =>
      (opt: IAnyObject = {}) => {    
        let out = Object.assign({}, opt);
    
        if (!out.header) {
            out.header = {};
        }
    
        if (!out.data) {
            out.data = {};
        }
    
        out.success = function (...args: any[]) {
          store.event.emit('network:request-finished', {
            method,
            option: out,
            response: args[0],
          });
          isFunc(opt.success) && opt.success.apply(this, args);
        };
    
        out.fail = function (...args: any[]) {
          store.event.emit('network:request-finished', {
            method,
            option: out,
            error: args[0],
          });
          isFunc(opt.fail) && opt.fail.apply(this, args);
        };
    
        return requestFunc.call(this, out);
      }
  });
});
