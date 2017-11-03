# gulp-server-io [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

> Create a static server, live reload and a socket.io debugger for your SPA development with gulp
> Plus a standalone server with Express / json-server and http proxy for rapid deployment

## Introduction

This is complete rewrote from [gulp-webserver-io](https://github.com/joelchu/gulp-webserver-io), there are many improvement over the previous version.
The goal is to create an one stop shop solution during development, as well as simple and quick SPA deployment.

Here is a list of the main changes over the previous version: 

* Replace `connect` with `express`, allow for more third parties middleware integrate into this package.
* Replace `tiny-lr` with `chokidar`, `reload`, and `baconjs` that allow better cross platform support and, better control over the file watch.
* Fold several out dated packages into the code and, maintain ourself.
* Redevelop the socket.io-debugger from ground up to make it easier to develop more features in the future.
* Add `json-server` combine with `http-proxy-middleware` to allow mock REST API during development (even during deployment).
* Most of the options are now one line configuation.
* Completely redesign the code structure to make it easier to develop by breaking up everything into it's own module.
* Rewrote most of the test and, coverage report to have a better understanding of the progress.  

## Installation

```sh
  $ npm install --save-dev gulp-server-io
```

Using yarn

```sh
  $ yarn add gulp-server-io --dev
```

## During Development

### Use with Gulp

There are several ways to use this npm package. First during development use it with `gulp`:

```js
// gulpfile.js  
// We have include the Gulp 4 with this package and expose it back as well
const { gulp } = require('gulp-server-io/gulp');
const gulpServerIo = require('gulp-server-io');

gulp.task('serve', () => {
  return gulp.src('./app')
             .pipe(
               gulpServerIo()
             );
});

```

## Socket.io Debugger

Status: Will be available in beta

## Proxies

Status: Working

## Mock data api

Status: Working

## Deployment

### Using the `server` as a quick deployable server option

```js
const server = require('gulp-server-io/server');
// by default when you set development to false
// the folder is <YOUR_APP_ROOT>/dest
server({
  development: false
});

```

### Use with cli

Status: Will be available in beta

## Full configuration properties

TBC


You can combine with our [generator-nodex](https://github.com/NewbranLTD/generator-nodex) to create a `nginx` and `systemd` files.

## License

MIT © [NEWBRAN.CH](https://newbran.ch) &amp; [to1source](https://to1source.com)


[npm-image]: https://badge.fury.io/js/gulp-server-io.svg
[npm-url]: https://npmjs.org/package/gulp-server-io
[travis-image]: https://travis-ci.org/NewbranLTD/gulp-server-io.svg?branch=master
[travis-url]: https://travis-ci.org/NewbranLTD/gulp-server-io
[daviddm-image]: https://david-dm.org/NewbranLTD/gulp-server-io.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/NewbranLTD/gulp-server-io
[coveralls-image]: https://coveralls.io/repos/NewbranLTD/gulp-server-io/badge.svg
[coveralls-url]: https://coveralls.io/r/NewbranLTD/gulp-server-io
