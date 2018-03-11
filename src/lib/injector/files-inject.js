/**
 * Continue to inject dependencies (CSS,js) files etc
 */
/*
 ## Inject

 *New @ 1.4.0* This is an end user request, to add the injection. The configuration option as follow:

 ```js
   const gulpServerIo = require('gulp-server-io');
   const config = {
     inject: {
       source: ['../src/js/*.js', '../src/css/*.css'],
       target: ['index.html', 'other.html', '404.html']
     }
   }
   gulp('src').pipe(
     gulpServerIo(config)
   );
 ```

 Note about the source

 The middleware will check the pattern you provide, if there is any `*` in it. Then we use
 `glob` to fetch the list of files.

 For those that don't have `*` then it will just inject as-is.

 Also you can specify where you want to inject the files. The default is files with `.css` extension
 will be inject after the opening `<head>` tag, and `.js` extension files will be inject into
 the bottom before the closing `</body>` tag.
 Any other file extension will get throw out (we don't suport custom tag yet, might be in the future)

 To inject files where you want, pass as an object instead

 ```js
  const config = {
    inject: {
      source: {
        head: ['list/of/files.js', '/list/of/*.css'],
        body: ['list/of/other/files.js']
      },
      target: ['index.html', 'other.html']
    }
  }
 ```

 By default the target will be `index.html`, if you don't need to inject files into anywhere else
 you can just omit it. Otherwise, you will need to list all the HTML document that you need to inject
 files to.

 */
const log = require('../utils/log');
const chalk = require('chalk');
const cheerio = require('cheerio');
const interceptor = require('express-interceptor');
const glob = require('glob');
/**
 * @param {array} files to wrap with tag
 * @param {string} ignorePath to strip out
 * @return {string} conccat them all
 */
const tagCss = (files, ignorePath) => {
  return files
    .map(file => {
      if (ignorePath) {
        file = file.replace(ignorePath, '');
      }
      return `<link rel="stylesheet" href="${file}" />`;
    })
    .join('\r\n');
};
/**
 * @param {array} files to wrap with tag
 * @param {string} ignorePath to strip out
 * @return {string} conccat them all
 */
const tagJs = (files, ignorePath) => {
  return files
    .map(file => {
      if (ignorePath) {
        file = file.replace(ignorePath, '');
      }
      return `<script type="text/javascript" src="${file}"></script>`;
    })
    .join('\r\n');
};
/**
 * @param {string} source to process
 * @return {array} result
 */
const processFiles = source => {
  let files = [];
  if (source.indexOf('*') > -1) {
    files = files.concat(glob.sync(source));
  } else {
    files = files.concat([source]);
  }
  return files;
};
const isCss = name => {
  return name.toLowerCase().substr(-3) === 'css';
};
const isJs = name => {
  return name.toLowerCase().substr(-2) === 'js';
};

/**
 * @param {mixed} source array or object
 * @return {object} js / css
 */
const getSource = source => {
  let js = [];
  let css = [];
  if (source) {
    source = Array.isArray(source) ? source : [source];
    // Processing the object
    for (let i = 0, len = source.length; i < len; ++i) {
      let s = source[i];
      if (isCss(s)) {
        css = css.concat(processFiles(s));
      } else if (isJs(s)) {
        js = js.concat(processFiles(s));
      }
    }
    /*
    @TODO
    else if (typeof source === 'object') { // expect head of bottom!

    } */
  }
  return {
    js: js.length ? js : false,
    css: css.length ? css : false
  };
};
/**
 * @param {mixed} target array or string
 * @return {mixed} Array on success of false
 */
const getTarget = target => {
  if (target) {
    return Array.isArray(target) ? target : [target];
  }
  return false;
};
// Main
module.exports = function(config) {
  const target = getTarget(config.target);
  const { js, css } = getSource(config.source);
  if (!target || !js || !css) {
    // Display an error inline here
    log(chalk.red('[inject] Configuration is incorrect for inject to work!'));
    return function(req, res, next) {
      next();
    };
  }
  // Pass validation then proceed
  return interceptor(function(req, res) {
    return {
      isInterceptable: function() {
        // @TODO need to check file name also
        if (/text\/html/.test(res.get('Content-Type'))) {
          // Console.log(req.url, res.get('Content-Type'));
          return true;
        }
        return false;
      },
      intercept: function(body, send) {
        let $doc = cheerio.load(body);
        $doc('head').append(tagCss(css, config.ignorePath));
        $doc('body').append(tagJs(js, config.ignorePath));
        send($doc.html());
      }
    };
  });
};
