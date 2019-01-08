/*global Promise*/
/*prettier-ignore*/
"use strict";

var dotProp = require("./dotPropImmutable"),
  queue = Promise.resolve()

module.exports = function store(dot, opts) {
  opts = opts || {}

  if (dot.state.store) {
    return dot
  }

  dot.state.store = opts.state || {}

  var boundSet = set.bind(dot.state)

  dot.beforeAny("get", get.bind(dot.state))
  dot.any("delete", boundSet)
  dot.any("merge", boundSet)
  dot.any("set", boundSet)

  return dot
}

function get(o, sig) {
  var opt = o.opt,
    propArr = o.propArr

  propArr = opt ? propArr.concat(opt.split(".")) : propArr

  if (propArr) {
    sig.value = dotProp.get(this.store, propArr) || null
  } else {
    sig.value = this.store
  }
}

function set(o) {
  var opt = o.opt,
    s = this

  if (typeof opt === "function") {
    queue = queue.then(function() {
      var v = opt(o)
      return setter.call({ o: o, s: s, v: v })
    })
  } else {
    var v = o.opt
    queue = queue.then(setter.bind({ o: o, s: s, v: v }))
  }

  return queue
}

function setter() {
  var dot = this.o.dot,
    ns = this.o.ns,
    prop = this.o.prop,
    propArr = this.o.propArr,
    s = this.s,
    v = this.v

  if (ns === "delete") {
    s.store = dotProp.delete(s.store, propArr)
  }

  if (ns === "merge") {
    s.store = dotProp.merge(s.store, propArr, v)
  }

  if (ns === "set") {
    s.store = dotProp.set(s.store, propArr, v)
  }

  return dot("store", prop, v).then(this.o)
}
