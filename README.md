# @dot-event/store

dot-event immutable store

![that's us](thatsus.png)

## Install

```bash
npm install dot-event @dot-event/store
```

## Setup

```js
const dot = require("dot-event")()
require("@dot-event/store")(dot)
```

## Usage

```js
dot.set("prop", "prop2", "some value")
dot.get("prop", "prop2") // "some value"
dot.merge("prop", { prop3: "another value" })
dot.get("prop") // { prop2: "some value", prop3: "another value" }
dot.delete("prop")
```

## Raw state

The raw state object is available at `dot.state.store`.

## Queued update

Pass a function to `dot.set` for atomic operations:

```js
dot.set("counter", () => (dot.get("counter") || 0) + 1)
```
