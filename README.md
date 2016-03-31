# factory-girl-objection
[![Build Status](https://travis-ci.org/klinem/factory-girl-objection.svg?branch=master)](https://travis-ci.org/klinem/factory-girl-objection)

An [Objection](http://vincit.github.io/objection.js/) adapter for [factory-girl](https://github.com/aexmachina/factory-girl).

## Usage

```js
require('factory-girl-objection')();
```

Or, if you want to specify which models it should be used for:

```js
require('factory-girl-objection')(['User', 'Foo', 'Bar']);
```