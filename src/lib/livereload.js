/* eslint-disable */
const {
  snippet,
  prepand,
  append,
  _html,
  exists,
  snip,
  snap,
  accept,
  check,
  stockExcludeList,
  stockRules
} = require('./helper.js');
/**
 * This is the core of the connect-live-reload, due to it's so dated.
 * Just copy the whole thing and rewrote to matching the current standard
 */
module.exports = function livereload(opt = {}) {
  const ignore = opt.ignore || opt.excludeList || stockExcludeList;
  const include = opt.include || [/.*/];
  const html = opt.html || _html;
  const rules = opt.rules || stockRules;
  const disableCompression = opt.disableCompression || false;
  const port = opt.port || 35729;
  const plugins = opt.plugins || [];

  // Middleware
  return function livereload(req, res, next) {
    const host = opt.hostname || req.headers.host.split(':')[0];
    if (res._livereload) {
      return next();
    }
    res._livereload = true;

    if (!accept(req) || !check(req.url, include) || check(req.url, ignore)) {
      return next();
    }

    // Disable G-Zip to enable proper inspecting of HTML
    if (disableCompression) {
      req.headers['accept-encoding'] = 'identity';
    }

    let runPatches = true;
    const writeHead = res.writeHead;
    const write = res.write;
    const end = res.end;

    res.push = function(chunk) {
      res.data = (res.data || '') + chunk;
    };

    res.inject = res.write = function(string, encoding) {
      if (!runPatches) {
        return Reflect.apply(res, write, [string, encoding]);
        //return write.call(res, string, encoding);
      }
      if (string !== undefined) {
        const body = string instanceof Buffer ? string.toString(encoding) : string;
        // If this chunk must receive a snip, do so
        if (exists(body) && !snip(res.data)) {
          res.push(snap(body, host));
          return true;
        }
        // If in doubt, simply buffer the data for later inspection (on `end` function)
        res.push(body);
        return true;
      }
      return true;
    };

    res.writeHead = function() {
      if (!runPatches) {
        return Reflect.apply(res, writeHead, arguments);
        //return writeHead.apply(res, arguments);
      }
      let headers = arguments[arguments.length - 1];
      if (typeof headers === 'object') {
        for (let name in headers) {
          if (/content-length/i.test(name)) {
            delete headers[name];
          }
        }
      }
      if (res.getHeader('content-length')) {
        res.removeHeader('content-length');
      }
      Reflect.apply(res, writeHead, arguments);
    };
    // end of
    res.end = function(string, encoding) {
      if (!runPatches) {
        return Reflect.apply(res, end, [string, encoding]);
        // return end.call(res, string, encoding);
      }
      // If there are remaining bytes, save them as well
      // Also, some implementations call "end" directly with all data.
      res.inject(string, encoding);
      runPatches = false;
      // Check if our body is HTML, and if it does not already have the snippet.
      if (html(res.data) && exists(res.data) && !snip(res.data)) {
        // Include, if necessary, replacing the entire res.data with the included snippet.
        res.data = snap(res.data, host, rules, opt.src, port, plugins);
      }
      if (res.data !== undefined && !res._header)
        res.setHeader('content-length', Buffer.byteLength(res.data, encoding));
        Reflect.apply(res, end, [res.data, encoding]);
        // end.call(res, res.data, encoding);
    };
    // finish
    next();
  };
};
