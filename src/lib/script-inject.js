/* eslint no-useless-escape: 0, no-negated-condition: 0 */

/**
* Taking the idea from livereload and inject our socket.io and io-debugger-client file on the fly
*/
module.exports = function(config, opt = {}) {
  const ignore = opt.ignore ||
    opt.excludeList || [
      /\.js$/,
      /\.css$/,
      /\.svg$/,
      /\.ico$/,
      /\.woff$/,
      /\.png$/,
      /\.jpg$/,
      /\.jpeg$/
    ];
  const _html = str => (!str ? false : /<[:_-\w\s\!\/\=\"\']+>/i.test(str));
  const include = opt.include || [/.*/];
  const html = opt.html || _html;
  // Const tagName = 'head'; // or body
  // This is the important part to determine how the script get inserted into the page
  const disableCompression = opt.disableCompression || false;
  let toInjectScripts = [
    '/socket.io/socket.io.js',
    [config.debugger.namespace, config.debugger.js].join('/')
  ];
  /**
   * When the livereload enable we need to inject their script
   * we need to sepearate this two process
   */
  if (config.livereload.enable) {
    toInjectScripts.push('/reload/reload.js');
  }
  const snippet = toInjectScripts.map(
    s => `<script type="text/javascript" src="${s}"></script>\n`
  );

  // Helper functions
  const prepend = (w, s) => s + w;
  /*
  Const append = (w, s) => w + s;
  Const oldrules = [{
    match: /<\/body>(?![\s\S]*<\/body>)/i, fn: prepend
  },{
    match: /<\/html>(?![\s\S]*<\/html>)/i, fn: prepend
  },{
    match: /<\!DOCTYPE.+?>/i, fn: append
  }];
  */
  const rules = opt.rules || [
    {
      match: /<\/head>(?![\s\S]*<\/head>)/i, // @2017-07-13 change from head to body
      fn: prepend
    }
  ];
  const regex = (function() {
    const matches = rules
      .map(function(item) {
        return item.match.source;
      })
      .join('|');
    return new RegExp(matches);
  })();
  const exists = body => (!body ? false : regex.test(body));
  const snip = (body, strToCheck) => {
    if (!body) {
      return false;
    }
    // StrToCheck = strToCheck || ioDebuggerJs;
    return body.lastIndexOf(strToCheck) !== -1;
  };
  const snap = body => {
    let _body = body;
    rules.some(function(rule) {
      if (rule.match.test(body)) {
        _body = body.replace(rule.match, function(w) {
          return rule.fn(w, snippet);
        });
        return true;
      }
      return false;
    });
    return _body;
  };
  const accept = req => {
    const ha = req.headers.accept;
    if (!ha) {
      return false;
    }
    return ha.indexOf('html') !== -1;
  };
  const check = (str, arr) => {
    if (!str) {
      return true;
    }
    return arr.some(function(item) {
      if ((item.test && item.test(str)) || str.indexOf(item) !== -1) {
        return true;
      }
      return false;
    });
  };
  // Middleware
  return function(req, res, next) {
    // This code basically stop it from writing to the file twice
    // gutil.log('call res.__written');
    if (res.__written) {
      return next();
    }
    res.__written = true;
    // Console.log('call res.__written again');
    const writeHead = res.writeHead;
    const write = res.write;
    const end = res.end;
    if (!accept(req) || !check(req.url, include) || check(req.url, ignore)) {
      return next();
    }
    // Disable G-Zip to enable proper inspecting of HTML
    if (disableCompression) {
      req.headers['accept-encoding'] = 'identity';
    }
    function restore() {
      res.writeHead = writeHead;
      res.write = write;
      res.end = end;
    }
    res.push = function(chunk) {
      res.data = (res.data || '') + chunk;
    };
    const writeInject = function(string, encoding) {
      if (string !== undefined) {
        const body = string instanceof Buffer ? string.toString(encoding) : string;
        if (exists(body) && !snip(res.data)) {
          // Console.log('first');
          res.push(snap(body));
          return true;
        }
        if (html(body) || html(res.data)) {
          // Console.log('second');
          res.push(body);
          return true;
        }
        // Console.log('third');
        restore();
        return write.call(res, string, encoding);
      }
      return true;
    };
    // Just to follow the eslint rules
    res.inject = writeInject;
    res.write = writeInject;

    res.writeHead = function() {
      const headers = arguments[arguments.length - 1];
      if (headers && typeof headers === 'object') {
        for (let name in headers) {
          if (/content-length/i.test(name)) {
            delete headers[name];
          }
        }
      }
      const header = res.getHeader('content-length');
      if (header) {
        res.removeHeader('content-length');
      }
      writeHead.apply(res, arguments);
    };

    res.end = function(string, encoding) {
      restore();
      const result = res.inject(string, encoding);
      if (!result) {
        return end.call(res, string, encoding);
      }
      if (res.data !== undefined && !res._header) {
        res.setHeader('content-length', Buffer.byteLength(res.data, encoding));
      }
      res.end(res.data, encoding);
    };
    next();
  };
};