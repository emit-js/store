/* eslint-env jest */

var dot = require("dot-event")(),
  store = require("./store")

beforeEach(function() {
  dot.reset()
  store(dot)
})

test("get/set", function() {
  return dot("set.a.b.c", true).then(function() {
    expect(dot("get.a.b.c")).toBe(true)
  })
})
