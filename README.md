# gulp-server-io [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url][![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![jest](https://facebook.github.io/jest/img/jest-badge.svg)](https://github.com/facebook/jest)

> Create a static server, live reload and a socket.io debugger for your SPA development with gulp
> Plus a standalone server with Express / json-server and http proxy for rapid deployment

## Introduction

This is a complete rewritten version of the [gulp-webserver-io](https://github.com/joelchu/gulp-webserver-io);
with many features added, and improvements.

The goal is to create an one stop shop solution during development, as well as simple, and quick SPA deployment tool.

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

<span style="color:red">1.4.0 final version will remove the `gulp-server-io/gulp`, instead use `gulp-server-io/export`</span>

```js
// gulpfile.js  
// We have include the Gulp 4 with this package and expose it back as well
const { gulp } = require('gulp-server-io/export');
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

Please note this will not be enable in the stand alone server version. It's only available for the gulp development version.

V.1.1.0 integrate with [stacktrace.js](https://github.com/stacktracejs/stacktrace.js/) to produce a much nicer output in the console.

The main use is when you need to run your app on your mobile, that allows you to quickly see if there is any error. Also the same method is expose globally, you can do something like this:

```js
  $gulpServerIo.debugger(msg);
```

You an pass just a full string to the method. Or you can pass an object which produce nicer output:

* from - you defined where that coming from
* msg - you can pass error object, array or whatever
* color - the color available in `chalk`

You can also use the stacktrace.js which is available globally via the `StackTrace` object.

*Please remember to take this down once you are production ready, because the debugger and stacktrace.js only inject into the html dynamically during development.*

## Proxies

```js
const server = require('gulp-server-io');
gulp.task('serve', () => {
  return gulp.src('./app')
    .pipe(
      server({
        proxies: [{
          source: '/api',
          target: 'http://otherhost.com',
          changeOrigin: true,
          logLevel: 'debug' // check http-proxy-middleware documentation
        }]
      })
    );
});
```

**Its very important that you pass the config as an array**

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

Please, note if in your code are all using relative path, it will work out of the box when you deploy.

For example, during development your host is `http://localhost:8000` and, your production domain name is `http://example.com`; hard coding the domain name in your AJAX call is not recommended. This is why we include the proxy server. Another upside is during your development, you don't have to do any setup for the CORS issue.

## Mock data api

```js
  gulp.src('./app')
      .pipe(
        server({
          mock: {
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

In your UI code, you can fetch data from your fake rest endpoint:

```js

  fetch('/users').then( res => {
    if (res.ok) {
       return res.json();
    }
    throw new Error('Not OK');
  })
  .then( json => {
    // do your thing
  })
  .catch( err => {
    // deal with your error
  })
```

Once you use the mock option, all your proxies definition will be
overwritten by the mock JSON path.

*NEW @ 1.4.0* I have added a watcher to your JSON file, so whenever you edit your mock JSON data file,
the mock server will automatically restart.

## CLI

You can also use it as a cli tool if you install this globally. *Please note we switch to `meow` instead of `yargs` from 1.3 so the option will be different.*

```sh
  $ npm install gulp-server-io --global
  $ gulp-server-io /path/to/your/app
```

This will quickly serve up the folder you point to and use gulp as engine. So you get all the default setup just like you did with `gulpfile.js`. You can also pass multiple folders

```sh
  $ gulp-server-io /path/to/your/app,node_modules,dev
```

There are several options you can pass as well

* host (h) default `localhost`, if you need to broadcast then use `0.0.0.0`
* port (p) default `8000`, change it to the port you need
* config (c) default `undefined`, this allow you to point to an JSON file with the same configuration parameter available for the `gulp-server-io`

If you need to see all the options an examples

```sh
  $ gulp-server-io --help
```

---

If you need more option then you should set it up as a regular `gulpfile.js`

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

| Property name  | Description                                    | Default                   | Type              |
| ---            | ---                                            | ---                       | ---               |
| development    | A toggle flag                                  | `true`                    | Boolean           |
| host           | Host name or ip address without the `http://`  | `localhost`               | String            |
| path           | tailing                                        | `/`                       | String            |
| webroot        | Where your files need to serve up              | `./app`                   | Array or String   |
| fallback       | when 404 where to fallback to                  | `false`                   | Boolean or String |
| https          | Use secure or not @TODO                        | `false`                   | Object            |
| open           | automatically open browser                     | `true`                    | Boolean or String |
| indexes        | Array of indexes to search                     | `[index.html, index.htm]` | Array             |
| callback       | A function to execute after the server start   | `() => {}`                | Function          |
| staticOptions  | Look at `server-static`                        | `{}`                      | Object            |
| headers        | extra headers to pass                          | `{}`                      | Object            |
| proxies        | Array of proxies `{ source , target }`         | `[]`                      | Array             |
| mock           | Create mock REST API using json-server         | `false`                   | Boolean or String |
| debugger       | Socket.io debugger                             | `true`                    | Boolean or Object |
| inject         | inject file to the html you want               | false                     | Object            |

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
