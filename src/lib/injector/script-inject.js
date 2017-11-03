/* eslint no-useless-escape: 0, no-negated-condition: 0 */

module.exports = function(opt = {}) {
  // Options
  const ignore = opt.ignore ||
    opt.excludeList || ['.js', '.css', '.svg', '.ico', '.woff', '.png', '.jpg', '.jpeg'];
  const prepend = (w, s) => s + w;
  // Append is useless
  // const append = (w, s) => w + s;
  const isHtml = str => {
    if (!str) {
      return false;
    }
    return /<[:_-\w\s\!\/\=\"\']+>/i.test(str);
  };
  const html = opt.html || isHtml;
  const rules = opt.rules || [
    {
      match: /<\/head>/,
      fn: prepend
    },
    {
      match: /<\/body>/,
      fn: prepend
    }
  ];
  const snippetBuilder = snippet => {
    if (snippet) {
      if (snippet instanceof Array) {
        return snippet.join('');
      }
      return snippet;
    }
    return '';
  };
  const snippet = snippetBuilder(opt.snippet);
  // Still not sure how this work at all
  const runAll = opt.runAll || false;
  // Helper functions
  // this is necessary to wrap in a fn
  const regex = (function() {
    const matches = rules
      .map(function(item) {
        return item.match.source;
      })
      .join('|');
    return new RegExp(matches);
  })();
  const exists = body => {
    if (!body) {
      return false;
    }
    return regex.test(body);
  };
  // This is wrong!
  const snip = body => {
    if (!body) {
      return false;
    }
    return body.lastIndexOf(snippet) !== -1;
  };
  // This is problematic
  // we need to normalise all the rules into an array
  // and run through it regardless
  const snap = body => {
    var _body = body;
    rules.some(function(rule) {
      if (rule.match.test(_body)) {
        _body = _body.replace(rule.match, function(w) {
          return rule.fn(w, rule.snippet || snippet);
        });
        if (runAll === false) {
          return true;
        }
        return false;
      }
      return false;
    });
    return _body;
  };
  const accept = req => {
    var ha = req.headers.accept;
    if (!ha) {
      return false;
    }
    return ha.indexOf('html') !== -1;
  };
  const leave = req => {
    const url = req.url;
    let ignored = false;
    if (!url) {
      return true;
    }
    ignore.forEach(function(item) {
      if (url.indexOf(item) !== -1) {
        ignored = true;
      }
    });
    return ignored;
  };
  // Middleware
  return function(req, res, next) {
    if (res.inject) {
      return next();
    }
    const writeHead = res.writeHead;
    const write = res.write;
    const end = res.end;

    if (!accept(req) || leave(req)) {
      return next();
    }

    const restore = () => {
      res.writeHead = writeHead;
      res.write = write;
      res.end = end;
    };

    res.push = function(chunk) {
      res.data = (res.data || '') + chunk;
    };

    res.write = (string, encoding) => {
      if (string !== undefined) {
        var body = string instanceof Buffer ? string.toString(encoding) : string;
        if (exists(body) && !snip(res.data)) {
          res.push(snap(body));
          return true;
        }
        if (html(body) || html(res.data)) {
          res.push(body);
          return true;
        }
        restore();
        return write.call(res, string, encoding);
      }
      return true;
    };
    res.inject = res.write;
    res.writeHead = () => {};
    res.end = (string, encoding) => {
      restore();
      var result = res.inject(string, encoding);
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
