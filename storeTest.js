/* eslint-env jest */

var dot = require("dot-event")(),
  store = require("./store")

beforeEach(function() {
  dot.reset()
  store(dot)
})

test("get", function() {
  dot.state.store = { a: { b: true } }
  expect(dot("get", "a", "b")).toBe(true)
  expect(dot.get("a", "b")).toBe(true)
})

test("delete", function() {
  return dot
    .set("a", "b", "c", true)
    .then(function() {
      return dot.delete("a", "b")
    })
    .then(function() {
      expect(dot.state.store).toEqual({ a: {} })
    })
})

test("merge", function() {
  return dot("merge", "a", { b: { c: true } }).then(
    function() {
      expect(dot("get", "a", "b", "c")).toBe(true)
    }
  )
})

test("queued set", function() {
  dot.state.store = { a: { b: { c: "hello" } } }
  return dot
    .set("a", "b", "c", function(value) {
      return value + " world"
    })
    .then(function() {
      expect(dot.get("a", "b", "c")).toBe("hello world")
    })
})

test("set", function() {
  return dot.set("a", "b", "c", true).then(function() {
    expect(dot.get("a", "b", "c")).toBe(true)
  })
})

test("set string", function() {
  return dot.set("a", "b", "c").then(function() {
    expect(dot.get("a", "b")).toBe("c")
  })
})

test("store", function() {
  expect.assertions(1)

  dot.on("store", "a", "b", "c", function() {
    var args = Array.prototype.slice.call(arguments)
    expect(args).toEqual([
      ["a", "b", "c"],
      true,
      dot,
      "store",
      {},
    ])
  })

  return dot.set("a", "b", "c", true)
})
