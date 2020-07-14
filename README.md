# abstract-browser

**Interface for opening and closing a browser.** Uses [`nanoresource`](https://github.com/mafintosh/nanoresource) for state management, [`browser-manifest`](https://github.com/airtap/browser-manifest) for metadata. Pairs well with [`browser-provider`](https://github.com/airtap/browser-provider).

[![npm status](http://img.shields.io/npm/v/abstract-browser.svg)](https://www.npmjs.org/package/abstract-browser)
[![node](https://img.shields.io/node/v/abstract-browser.svg)](https://www.npmjs.org/package/abstract-browser)
[![Travis](https://img.shields.io/travis/com/airtap/abstract-browser.svg)](https://travis-ci.com/airtap/abstract-browser)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Usage

With promises:

```js
const Browser = require('abstract-browser').promises

class MyBrowser extends Browser {
  async _open () {
    // open the browser
    console.log('opening', this.target.url)
  }

  async _close () {
    // close the browser
  }
}
```

With callbacks:

```js
const Browser = require('abstract-browser')

class MyBrowser extends Browser {
  _open (callback) {
    // ..
  }

  _close (callback) {
    // ..
  }
}
```

## API

### `browser = new Browser(manifest, target)`

Constructor. Takes a [`browser-manifest`](https://github.com/airtap/browser-manifest) and a `target` object in the form of `{ url }`.

Implementors are free to change the signature of their constructor. User-facing options specific to an implementation should be passed in via `manifest.options`.

### `browser.open([callback])`

Open the browser. Returns a promise if no callback is provided.

### `browser.close([callback])`

Close the browser. Returns a promise if no callback is provided.

### `browser.status(ok[, callback])`

Set status by a boolean `ok`. Returns a promise if no callback is provided. Useful for remote browsers like Sauce Labs where you can set the remote job status e.g. after running tests on a browser.

### `browser.manifest`

The manifest that was passed to the constructor.

### `browser.target`

The target that was passed to the constructor.

## Events

Browsers may emit `error` events. It's recommended to only do so after `open()` has completed and not after `close()` has been called. The [`transient-error`](https://github.com/vweevers/transient-error) module may be used to signal that the error is temporary and that running (a new instance of) the browser can be retried.

## Install

With [npm](https://npmjs.org) do:

```
npm install abstract-browser
```

## License

[MIT](LICENSE.md) © 2020-present Airtap contributors
