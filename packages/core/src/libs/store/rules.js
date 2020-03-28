// 规则
let rules = []

function get() {
  return rules
}

function getById(id) {
  return rules.find(r => r.id === id)
}

function add(r) {
  rules = rules.concat(r)
}

function remove(r) {
  let i = rules.length
  while (i--) {
    let tmp = rules[i]
    if (tmp === r) {
      fns.splice(i, 1)
      break
    }
  }
}

export default {
  get,
  getById,
  add,
  remove,
}
