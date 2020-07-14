'use strict'

const { fromCallback, fromPromise } = require('catering')
const bm = require('browser-manifest')
const Nanoresource = require('nanoresource/emitter')

const kPromises = Symbol('kPromises')
const kTitle = Symbol('kTitle')

class Browser extends Nanoresource {
  constructor (manifest, target) {
    super()

    this.manifest = bm(manifest)
    this.target = target
    this.supports = { ...this.supports, promises: true, callbacks: true }

    this[kPromises] = false
    this[kTitle] = this.manifest.title
  }

  open (...args) {
    const callback = fromCallback(takeCallback(args))
    super.open(...args, callback)
    return callback.promise
  }

  close (...args) {
    const callback = fromCallback(takeCallback(args))
    super.close(...args, callback)
    return callback.promise
  }

  get title () {
    if (!this[kTitle]) {
      // Should we make title mandatory?
      const { provider, name, version } = this.manifest
      this[kTitle] = ['(anonymous)', provider, name, version].filter(Boolean).join(' ')
    }

    return this[kTitle]
  }

  setStatus (ok, callback) {
    if (this[kPromises]) {
      return fromPromise(this._setStatus(ok), callback)
    } else {
      let sync = true
      callback = fromCallback(callback)
      this._setStatus(ok, function (err) {
        if (sync) return process.nextTick(callback, err)
        callback(err)
      })
      sync = false
      return callback.promise
    }
  }

  _setStatus (ok, callback) { process.nextTick(callback) }
}

Browser.promises = class BrowserPromises extends Browser {
  constructor (...args) {
    super(...args)

    this.supports = { ...this.supports, promises: true, callbacks: true }
    this[kPromises] = true

    this._open = wrapAsync(this._open)
    this._close = wrapAsync(this._close)
  }

  async _open () {}
  async _close () {}
  async _setStatus (ok) {}
}

module.exports = Browser

function takeCallback (args) {
  if (typeof args[args.length - 1] === 'function') {
    return args.pop()
  }
}

function wrapAsync (fn) {
  return function (callback) {
    fromPromise(fn.call(this), callback)
  }
}
