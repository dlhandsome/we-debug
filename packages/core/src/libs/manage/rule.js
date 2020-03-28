import BaseManage from './base'

export class FormRule extends BaseManage{
  constructor(opt = {}) {
    super(opt)
    this.title = opt.title || ''
    this.desc = opt.desc || ''
    this.meta = opt.meta || ''
    this.type = opt.type || ''
    this.state = opt.state || {}
  }

  get prefix() {
    return 'debug:rule-' + this.id
  }
}

export function createFormRule(opt = {}) {
  return new FormRule(opt)
}
