# gulp-server-io [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

> Create a static server, live reload and a socket.io debugger for your SPA development with gulp
> Plus a standalone server with Express / json-server and http proxy for rapid deployment

## Introduction

This is a complete rewrote of the [gulp-webserver-io](https://github.com/joelchu/gulp-webserver-io);
there are many improvement over the previous version.

The goal is to create an one stop shop solution during development, as well as simple and quick SPA deployment.

See [CHANGELOG.md]('./CHANGELOG.md') for complete list of different between the two version.

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

There are several ways to use this package. First, during development and, use it with `gulp`:

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

This is enable by default. To turn it off, pass `debugger: false` to the configuration.
Please note this will not be enable in the standalone server version. It's only available for the gulp
development version.

More about this to come.

## Proxies

```js
const server = require('gulp-server-io');
gulp.task('serve', () => {
  return gulp.src('./app')
    .pipe(
      server({
        proxies: [{
          source: '/api',
          target: 'http://otherhost.com'
        }]
      })
    );
});
```

Please note when you call the `/api` resource, it will translate to
`http://otherhost.com/api`.

For further configuration options, please check [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)

If you are using the deployment option. For example, you create a `Restify` service running on the localhost at port 8989.

```js
const server = require('gulp-server-io/server');
server({
  proxies: [{
    source: '/api',
    target: 'http://localhost:8989'
  }]
});
```

Please, note if in your code are all using relative path, then when you deploy your app. It will just work out of the box.
For example, during development your host is `http://localhost:8000` and, your production domain name is `http://example.com`

If you hard coded your domain name in your code, then you need to change it. But calling it using the relative path will guarantee
your project can be move however you like.

## Mock data api

```js
  gulp.src('./app')
      .pipe(
        server({
          mock: {
            enable: true,
            json: '/path/to/api.json'
          }
        })
      )
```

Create an `api.json` according to [json-server](https://github.com/typicode/json-server)

```json
{
  "users": [
    {"id": 1, "name": "John Doe"},
    {"id": 2, "name": "Jane Doe"}
  ]
}
```

In your code:

```js
  fetch('/users').then( results => {
    console.log(results); // the array of data
  });
```

Please note, once you use the mock option, your proxies will be
overwritten by the path found in your json file.

## Deployment

### Using the `server` as a quick deploy server option

```js
const server = require('gulp-server-io/server');
// by default when you set development to false
// the folder is <YOUR_APP_ROOT>/dest
server({
  development: false
});

```

## Full configuration properties

| Property name  | Description | Default | Type |
| ------------- | ------------- | ---------| -----|
| development  | A toggle flag  | `true` | Boolean |
| host  | Host name or ip address without the `http://`  | `localhost` | String |
| path  | tailing | `/` | String |
| webroot | Where your files need to serve up | `./app` | Array or String |
| fallback | when 404 where to fallback to | `false` | Boolean or String |
| https | Use secure or not | `false` | Boolean |
| open  | automatically open browser | `true` | Boolean or String |
| indexes | Array of indexes to search | `[index.html, index.htm]` | Array |
| callback | A function to execute after the server start | `() => {}` | Function |
| staticOptions | Look at `server-static` | `{}` | Object |
| directoryListing | Look at `server-index` | `false` | Boolean |
| headers | extra headers to pass | `{}` | Object |
| proxies | Array of proxies `{ source , target }` | `[]` | Array |
| devKeyPem | When you set `https` to true you can supply your own `pem` file | `cert.pem` | String |
| devCrtPem | Same as above, supply a crt file | `cert.crt` | String |
| mock | Create mock REST API using json-server | `false` | Boolean or String |
| debugger | Socket.io debugger | `true` | Boolean or Object |

Please see wiki for more information about all the available options.

---

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
