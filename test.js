'use strict'

const test = require('tape')
const bm = require('browser-manifest')
const Browser = require('.')
const BrowserP = require('.').promises
const url = 'http://localhost'

test('open and close', function (t) {
  t.plan(24)

  class CallbackBrowser extends Browser {
    _open (callback) {
      t.pass('_open called')
      callback()
    }

    _close (callback) {
      t.pass('_close called')
      callback()
    }
  }

  class PromiseBrowser extends BrowserP {
    async _open () {
      t.pass('_open called')
    }

    async _close () {
      t.pass('_close called')
    }
  }

  for (const Ctor of [CallbackBrowser, PromiseBrowser, Browser, BrowserP]) {
    const browser1 = new Ctor({ name: 'test' }, { url })
    const browser2 = new Ctor({ name: 'test' }, { url })

    browser1.open(function (err) {
      t.ifError(err)

      browser1.close(function (err) {
        t.ifError(err)
      })
    })

    browser2.open().then(function () {
      t.pass('opened')

      browser2.close().then(function () {
        t.pass('closed')
      })
    })
  }
})

test('setStatus', function (t) {
  t.plan(12)

  class CallbackBrowser extends Browser {
    _setStatus (ok, callback) {
      t.is(ok, true)
      callback()
    }
  }

  class PromiseBrowser extends BrowserP {
    async _setStatus (ok) {
      t.is(ok, true)
    }
  }

  for (const Ctor of [CallbackBrowser, PromiseBrowser, Browser, BrowserP]) {
    const browser1 = new Ctor({ name: 'test' }, { url })
    const browser2 = new Ctor({ name: 'test' }, { url })

    browser1.setStatus(true, function (err) {
      t.ifError(err)
    })

    browser2.setStatus(true).then(function () {
      t.pass()
    })
  }
})

test('manifest', function (t) {
  const browser = new Browser({ name: 'test', foo: 'bar' }, { url })

  t.same(browser.manifest, bm({ name: 'test', foo: 'bar' }))
  t.end()
})

test('title', function (t) {
  t.is(new Browser({ name: 'test', title: 'Test' }).title, 'Test')
  t.is(new Browser({ name: 'test' }).title, '(anonymous) test')
  t.is(new Browser({ name: 'test', provider: 'x' }).title, '(anonymous) x test')
  t.is(new Browser({ name: 'test', provider: 'x', version: '1' }).title, '(anonymous) x test 1')
  t.end()
})

test('supports', function (t) {
  t.plan(2)

  const browser1 = new Browser({ name: 'test' }, { url })
  const browser2 = new BrowserP({ name: 'test' }, { url })

  t.same(browser1.supports, { promises: true, callbacks: true })
  t.same(browser2.supports, { promises: true, callbacks: true })
})
