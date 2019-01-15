/*global Promise*/
/*prettier-ignore*/
"use strict";

var dotProp = require("./dotPropImmutable"),
  queue = Promise.resolve()

module.exports = function store(dot, opts) {
  if (dot.state.store) {
    return
  }

  opts = opts || {}
  dot.state.store = opts.state || {}

  var boundSet = set.bind(dot.state)

  dot.beforeAny("get", get.bind(dot.state))
  dot.any("delete", boundSet)
  dot.any("merge", boundSet)
  dot.any("set", boundSet)
}

function argToPropArr(prop, arg) {
  return arg ? prop.concat(arg.split(".")) : prop
}

function get(prop, arg, dot, event, sig) {
  prop = argToPropArr(prop, arg)

  if (prop) {
    sig.value = dotProp.get(this.store, prop) || null
  } else {
    sig.value = this.store
  }
}

function set(prop, arg, dot, event, sig) {
  var s = this

  if (typeof arg === "function") {
    queue = queue.then(function() {
      return setter.call({
        d: dot,
        e: event,
        p: prop,
        s: s,
        v: arg(prop, arg, dot, event, sig),
      })
    })
  } else {
    queue = queue.then(
      setter.bind({
        d: dot,
        e: event,
        p: prop,
        s: s,
        v: arg,
      })
    )
  }

  return queue
}

function setter() {
  var dot = this.d,
    e = this.e,
    p = this.p,
    s = this.s,
    v = this.v

  if (e === "delete") {
    p = argToPropArr(p, v)
    s.store = dotProp.delete(s.store, p)
  }

  if (e === "merge") {
    s.store = dotProp.merge(s.store, p, v)
  }

  if (e === "set") {
    s.store = dotProp.set(s.store, p, v)
  }

  return dot("store", p, v).then(function() {
    return v
  })
}
