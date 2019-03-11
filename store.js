/*global Promise*/
/*prettier-ignore*/
"use strict";

var dotProp = require("./dotPropImmutable")

module.exports = function store(dot, state) {
  if (dot.get) {
    return
  }

  dot.state.store = state || {}
  dot.state.storePromise = Promise.resolve()

  dot("logLevel", "get", { info: "debug" })
  dot("logLevel", "set", { forceArg: true })
  dot("logLevel", "store", { info: "debug" })

  var boundGet = get.bind(dot.state),
    boundSet = set.bind(dot.state)

  dot.any("get", boundGet)
  dot.any("delete", boundSet)
  dot.any("merge", boundSet)
  dot.any("set", boundSet)
}

function get(prop) {
  return getter.call({ p: prop, s: this })
}

function getter() {
  var p = this.p,
    s = this.s

  if (p) {
    return dotProp.get(s.store, p) || null
  } else {
    return s.store
  }
}

function set(prop, arg, dot, event) {
  var s = this

  if (typeof arg === "function") {
    this.storePromise = this.storePromise.then(function() {
      return setter.call({
        d: dot,
        e: event,
        p: prop,
        s: s,
        v: arg(getter.call({ p: prop, s: s })),
      })
    })
  } else {
    this.storePromise = this.storePromise.then(
      setter.bind({
        d: dot,
        e: event,
        p: prop,
        s: s,
        v: arg,
      })
    )
  }

  return this.storePromise
}

function setter() {
  var dot = this.d,
    e = this.e,
    p = this.p,
    s = this.s,
    v = this.v

  if (e === "delete") {
    s.store = dotProp.delete(s.store, p)
  }

  if (e === "merge") {
    s.store = dotProp.merge(s.store, p, v)
  }

  if (e === "set") {
    if (typeof v === "undefined") {
      v = p.pop()
    }
    s.store = dotProp.set(s.store, p, v)
  }

  return dot("store", p, v).then(function() {
    return v
  })
}
