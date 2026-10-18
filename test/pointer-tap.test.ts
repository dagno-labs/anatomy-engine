import { test } from 'node:test'
import assert from 'node:assert/strict'

import PointerTap from '../src/pointer-tap.ts'

const THRESHOLD = 5

test('accepts a pointer that stays within the threshold', () => {
  const tap = new PointerTap()

  tap.down(1, 10, 10, THRESHOLD)
  tap.move(1, 13, 12)

  assert.equal(tap.up(1, 12, 12), true)
})

test('rejects a drag beyond the threshold', () => {
  const tap = new PointerTap()

  tap.down(1, 10, 10, THRESHOLD)
  tap.move(1, 30, 10)

  assert.equal(tap.up(1, 10, 10), false)
})

test('rejects a pinch with two pointers', () => {
  const tap = new PointerTap()

  tap.down(1, 10, 10, THRESHOLD)
  tap.down(2, 50, 50, THRESHOLD)

  assert.equal(tap.up(2, 50, 50), false)
  assert.equal(tap.up(1, 10, 10), false)
})

test('rejects a cancelled pointer and recovers on the next press', () => {
  const tap = new PointerTap()

  tap.down(1, 10, 10, THRESHOLD)
  tap.cancel(1)

  assert.equal(tap.up(1, 10, 10), false)

  tap.down(2, 10, 10, THRESHOLD)

  assert.equal(tap.up(2, 10, 10), true)
})
