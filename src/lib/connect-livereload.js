/* eslint-disable */
/**
 * Connect-livereload
 * upgrade to ES6 syntax, and stop using the name export
 */
module.exports = function(opt = {}) {
  const ignore = opt.ignore ||
    opt.excludeList || [
      /\.js(\?.*)?$/,
      /\.css(\?.*)?$/,
      /\.svg(\?.*)?$/,
      /\.ico(\?.*)?$/,
      /\.woff(\?.*)?$/,
      /\.png(\?.*)?$/,
      /\.jpg(\?.*)?$/,
      /\.jpeg(\?.*)?$/,
      /\.gif(\?.*)?$/,
      /\.pdf(\?.*)?$/,
      /\.json(\?.*)?$/
    ];

  const include = opt.include || [/.*/];
  const html = opt.html || _html;
  const rules = opt.rules || [
    {
      match: /<\/body>(?![\s\S]*<\/body>)/i,
      fn: prepend
    },
    {
      match: /<\/html>(?![\s\S]*<\/html>)/i,
      fn: prepend
    },
    {
      match: /<\!DOCTYPE.+?>/i,
      fn: append
    }
  ];
  const disableCompression = opt.disableCompression || false;
  const port = opt.port || 35729;
  const plugins = opt.plugins || [];

  const snippet = function(host) {
    var src = opt.src || '//' + host + ':' + port + '/livereload.js?snipver=1';
    return [src]
      .concat(plugins)
      .map(function(source) {
        return `<script src="${source}" async="" defer=""></script>`;
      })
      .join('');
  };

  // Helper functions
  const regex = (function() {
    const matches = rules
      .map(function(item) {
        return item.match.source;
      })
      .join('|');
    return new RegExp(matches, 'i');
  })();

  const prepend = function(w, s) {
    return s + w;
  };

  const append = function(w, s) {
    return w + s;
  };

  const _html = function(str) {
    if (!str) {
      return false;
    }
    return /<[:_-\w\s\!\/\=\"\']+>/i.test(str);
  };

  const exists = function(body) {
    if (!body) {
      return false;
    }
    return regex.test(body);
  };

  const snip = function(body) {
    if (!body) {
      return false;
    }
    return ~body.lastIndexOf('/livereload.js');
  };

  const snap = function(body, host) {
    var _body = body;
    console.log(_body);
    rules.some(function(rule) {
      if (rule.match.test(body)) {
        _body = body.replace(rule.match, function(w) {
          return rule.fn(w, snippet(host));
        });
        return true;
      }
      return false;
    });
    return _body;
  };

  const accept = function(req) {
    var ha = req.headers.accept;
    if (!ha) return false;
    return ~ha.indexOf('html');
  };

  const check = function(str, arr) {
    if (!str) return true;
    return arr.some(function(item) {
      if ((item.test && item.test(str)) || ~str.indexOf(item)) {
        return true;
      }
      return false;
    });
  };

  // Result is a middleware
  return function(req, res, next) {
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

    var runPatches = true;
    var writeHead = res.writeHead;
    var write = res.write;
    var end = res.end;

    res.push = function(chunk) {
      res.data = (res.data || '') + chunk;
    };

    res.inject = res.write = function(string, encoding) {
      console.log('run here?', string, encoding);

      if (!runPatches) {
        console.log('write called');
        return write.call(res, string, encoding);
      }

      if (string !== undefined) {
        var body = string instanceof Buffer ? string.toString(encoding) : string;
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
        return writeHead.apply(res, arguments);
      }
      var headers = arguments[arguments.length - 1];
      if (typeof headers === 'object') {
        for (var name in headers) {
          if (/content-length/i.test(name)) {
            delete headers[name];
          }
        }
      }
      if (res.getHeader('content-length')) {
        res.removeHeader('content-length');
      }
      writeHead.apply(res, arguments);
    };

    res.end = function(string, encoding) {
      if (!runPatches) {
        console.log('end called');
        return end.call(res, string, encoding);
      }
      // If there are remaining bytes, save them as well
      // Also, some implementations call "end" directly with all data.
      res.inject(string, encoding);
      runPatches = false;
      // Check if our body is HTML, and if it does not already have the snippet.
      if (html(res.data) && exists(res.data) && !snip(res.data)) {
        // Include, if necessary, replacing the entire res.data with the included snippet.
        res.data = snap(res.data, host);
      }
      if (res.data !== undefined && !res._header) {
        res.setHeader('content-length', Buffer.byteLength(res.data, encoding));
      }
      end.call(res, res.data, encoding);
    };
    next();
  };
};
