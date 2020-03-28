// 状态角标
let badges = []

function get() {
  return badges
}

function getById(id) {
  return badges.find(s => s.id === id)
}

function add(s) {
  badges = badges.concat(s)
}

function remove(s) {
  let i = badges.length
  while (i--) {
    let tmp = badges[i]
    if (tmp === s) {
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
