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
// const cheerio = require('cheerio');
module.exports = function(config) {
  if (config.enable) {
    console.log(config);
  }
};
