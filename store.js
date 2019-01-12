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

function argToPropArr(arg, opts) {
  return arg
    ? opts.propArr.concat(arg.split("."))
    : opts.propArr
}

function get(arg, opts, sig) {
  var propArr = opts.propArr

  propArr = argToPropArr(arg, opts)

  if (propArr) {
    sig.value = dotProp.get(this.store, propArr) || null
  } else {
    sig.value = this.store
  }
}

function set(arg, opts) {
  var s = this

  if (typeof arg === "function") {
    queue = queue.then(function() {
      return setter.call({ o: opts, s: s, v: arg(opts) })
    })
  } else {
    queue = queue.then(
      setter.bind({ o: opts, s: s, v: arg })
    )
  }

  return queue
}

function setter() {
  var o = this.o,
    s = this.s,
    v = this.v

  var dot = o.dot,
    event = o.event,
    prop = o.prop,
    propArr = o.propArr

  if (event === "delete") {
    propArr = argToPropArr(v, o)
    s.store = dotProp.delete(s.store, propArr)
  }

  if (event === "merge") {
    s.store = dotProp.merge(s.store, propArr, v)
  }

  if (event === "set") {
    s.store = dotProp.set(s.store, propArr, v)
  }

  return dot("store", prop, v).then(function() {
    return { opts: o, value: v }
  })
}
