/* eslint-disable */
/**
 * Breaking out from the livereload method
 * since most of this methods are standalone anyway
 */
 // Helper functions
 const regex = (function() {
   const matches = rules
     .map(function(item) {
       return item.match.source;
     })
     .join('|');
   return new RegExp(matches, 'i');
 })();

 exports.snippet = function(src, host, port, plugins) {
   const _src = src || '//' + host + ':' + port + '/livereload.js?snipver=1';
   return [_src]
     .concat(plugins)
     .map(source => {
       return `<script src="${source}" async="" defer=""></script>`;
     })
     .join('');
 };

 exports.prepand = function(w, s) {
   return s + w;
 };

 exports.append = function(w, s) {
   return w + s;
 };

 exports._html = function(str) {
   if (!str) {
     return false;
   }
   return /<[:_-\w\s\!\/\=\"\']+>/i.test(str);
 };

 exports.exists = function(body) {
   if (!body) {
     return false;
   }
   return regex.test(body);
 };

 exports.snip = function(body) {
   if (!body) {
     return false;
   }
   return ~body.lastIndexOf('/livereload.js');
 };
 // Src, host, port, plugins
 exports.snap = function(body, host, rules, src, port, plugins) {
   let _body = body;
   rules.some(function(rule) {
     if (rule.match.test(body)) {
       _body = body.replace(rule.match, w => {
         return rule.fn(w, exports.snippet(src, host, port, plugins));
       });
       return true;
     }
     return false;
   });
   return _body;
 };

 exports.accept = function(req) {
   let ha = req.headers.accept;
   if (!ha) {
     return false;
   }
   return ~ha.indexOf('html');
 };

 exports.check = function(str, arr) {
   if (!str) {
     return true;
   }
   return arr.some(function(item) {
     if ((item.test && item.test(str)) || ~str.indexOf(item)) return true;
     return false;
   });
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

 exports.stockRules = [
   {
     match: /<\/body>(?![\s\S]*<\/body>)/i,
     fn: exports.prepend
   },
   {
     match: /<\/html>(?![\s\S]*<\/html>)/i,
     fn: exports.prepend
   },
   {
     match: /<\!DOCTYPE.+?>/i,
     fn: exports.append
   }
 ];
