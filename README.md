# gulp-server-io [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

> Create a static server, live reload and a socket.io debugger for your SPA development with gulp
> Plus a standalone server with Express / json-server and http proxy for rapid deployment

## Introduction



## Installation

```sh
  $ npm install --save-dev gulp-server-io
```

Using yarn

```sh
  $ yarn add gulp-server-io --dev
```

## Usage

```js
// gulpfile.js  
const gulp = require('gulp');
const gulpServerIo = require('gulp-server-io');

gulp.task('serve', () => {
  return gulp.src('./app')
             .pipe(
               gulpServerIo()
             );
});

```

## Using the `server` as a quick deployable server option

```js
const server = require('gulp-server-io/server');
const config = {
  webroot: path.join('path','to','your','webroot')
};

server(config);

```

You can combine with our [generator-nodex](https://github.com/NewbranLTD/generator-nodex) to create a `nginx` and `systemd` files.

## License

MIT © [NEWBRAN.CH](https://newbran.ch)


[npm-image]: https://badge.fury.io/js/gulp-server-io.svg
[npm-url]: https://npmjs.org/package/gulp-server-io
[travis-image]: https://travis-ci.org/NewbranLTD/gulp-server-io.svg?branch=master
[travis-url]: https://travis-ci.org/NewbranLTD/gulp-server-io
[daviddm-image]: https://david-dm.org/NewbranLTD/gulp-server-io.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/NewbranLTD/gulp-server-io
[coveralls-image]: https://coveralls.io/repos/NewbranLTD/gulp-server-io/badge.svg
[coveralls-url]: https://coveralls.io/r/NewbranLTD/gulp-server-io
