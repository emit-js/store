/*global Promise*/
/*prettier-ignore*/
"use strict";

var dotProp = require("./dotPropImmutable")

module.exports = function store(dot, opts) {
  var state = dot.state

  if (state.store) {
    return
  }

  opts = opts || {}
  state.store = opts.state || {}
  state.storePromise = Promise.resolve()

  if (state.log) {
    state.log = Object.assign(
      {
        get: {
          info: "debug",
        },
        set: {
          forceArg: true,
        },
        store: {
          info: "debug",
        },
      },
      state.log
    )
  }

  var boundSet = set.bind(dot.state)

  dot.any("get", get.bind(dot.state))
  dot.any("delete", boundSet)
  dot.any("merge", boundSet)
  dot.any("set", boundSet)
}

function get(prop, arg, dot, event, sig) {
  if (prop) {
    sig.value = dotProp.get(this.store, prop) || null
  } else {
    sig.value = this.store
  }
}

function set(prop, arg, dot, event, sig) {
  var s = this

  if (typeof arg === "function") {
    this.storePromise = this.storePromise.then(function() {
      return setter.call({
        d: dot,
        e: event,
        p: prop,
        s: s,
        v: arg(prop, arg, dot, event, sig),
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
    if (!v) {
      v = p.pop()
    }
    s.store = dotProp.set(s.store, p, v)
  }

  return dot("store", p, v).then(function() {
    return v
  })
}
