/* eslint-disable */
/**
 * Breaking out from the livereload method
 * since most of this methods are standalone anyway
 */
const prepend = function(w, s) {
  return s + w;
};

const append = function(w, s) {
  return w + s;
};

exports.stockExcludeList = [
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

const rules = [
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
/**
 * generate a regex for use later
 */
const regex = (function() {
  const matches = rules
    .map(function(item) {
      return item.match.source;
    })
    .join('|');
    return new RegExp(matches, 'i');
})();
/**
 * internal use only to inject the script
 * @param {string} src
 * @param {string} host
 * @param {int} port
 * @param {array} plugins
 * @return {string} html
 */
const snippet = function(src, host, port, plugins) {
  const _src = src || '//' + host + ':' + port + '/livereload.js?snipver=1';
  return [_src]
    .concat(plugins)
    .map(source => {
      return `<script src="${source}" async="" defer=""></script>`;
    })
    .join('');
};
/**
 * @param {string} str
 * @return {boolean} result  
 */
exports._html = function(str) {
  if (!str) {
    return false;
  }
  return /<[:_-\w\s\!\/\=\"\']+>/i.test(str);
};
/**
 * @param {string} body
 * @return {boolean} result
 */
exports.exists = function(body) {
  if (!body) {
    return false;
  }
  return regex.test(body);
};
/**
 * @param {string} body
 * @return {boolean} result
 */
exports.snip = function(body) {
  if (!body) {
    return false;
  }
  return ~body.lastIndexOf('/livereload.js');
};
/**
 * @param {string} body
 * @param {string} host
 * @param {array} rules
 * @param {string} src
 * @param {int} port
 * @param {array} plugins
 * @return {mixed} html or boolean
 */
exports.snap = function(body, host, rules, src, port, plugins) {
  let _body = body;
  rules.some(function(rule) {
    if (rule.match.test(body)) {
      _body = body.replace(rule.match, w => {
        return rule.fn(w, snippet(src, host, port, plugins));
      });
      return true;
    }
    return false;
  });
  return _body;
};
/**
 * @param {object} req
 * @return {boolean} result
 */
exports.accept = function(req) {
  let ha = req.headers.accept;
  if (!ha) {
    return false;
  }
  return ~ha.indexOf('html');
};
/**
 * @param {string} str
 * @param {array} arr
 * @return {boolean} result
 */
exports.check = function(str, arr) {
  if (!str) {
    return true;
  }
  return arr.some(function(item) {
    if ((item.test && item.test(str)) || ~str.indexOf(item)) {
      return true;
    }
    return false;
  });
};

/**
 * create a random number between two values, for creating a random port number
 * @param {int} min
 * @param {int} max
 * @return {int} port
 */
exports.getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
