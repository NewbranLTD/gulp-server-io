
/*
 *	CSSrefresh v1.0.3
 *
 *	Copyright (c) 2012 Fred Heusschen
 *	www.frebsite.nl
 *
 *	Dual licensed under the MIT and GPL licenses.
 *	http://en.wikipedia.org/wiki/MIT_License
 *	http://en.wikipedia.org/wiki/GNU_General_Public_License
 */

(function() {
  function createCookie(name, value, days) {
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      var expires = '; expires=' + date.toGMTString();
    } else var expires = '';
    document.cookie = name + '=' + value + expires + '; path=/';
  }

  function readCookie(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  function eraseCookie(name) {
    createCookie(name, '', -1);
  }

  var phpjs = {
    array_filter: function(arr, func) {
      var retObj = {};
      for (var k in arr) {
        if (func(arr[k])) {
          retObj[k] = arr[k];
        }
      }
      return retObj;
    },
    filemtime: function(file) {
      var headers = this.get_headers(file, 1);
      return (
        (headers &&
          headers['Last-Modified'] &&
          Date.parse(headers['Last-Modified']) / 1000) ||
        false
      );
    },
    get_headers: function(url, format) {
      var req = window.ActiveXObject
        ? new ActiveXObject('Microsoft.XMLHTTP')
        : new XMLHttpRequest();
      if (!req) {
        throw new Error('XMLHttpRequest not supported.');
      }

      var tmp,
        headers,
        pair,
        i,
        j = 0;

      try {
        req.open('HEAD', url, false);
        req.send(null);
        if (req.readyState < 3) {
          return false;
        }
        tmp = req.getAllResponseHeaders();
        tmp = tmp.split('\n');
        tmp = this.array_filter(tmp, function(value) {
          return value.toString().substring(1) !== '';
        });
        headers = format ? {} : [];

        for (i in tmp) {
          if (format) {
            pair = tmp[i].toString().split(':');
            headers[pair.splice(0, 1)] = pair.join(':').substring(1);
          } else {
            headers[j++] = tmp[i];
          }
        }

        return headers;
      } catch (err) {
        return false;
      }
    }
  };

  var cssRefresh = function(links) {
    this.reloadFile = function(links) {
      for (var a = 0, l = links.length; a < l; a++) {
        var link = links[a],
          newTime = phpjs.filemtime(this.getRandom(link.href));

        //	Has been checked before
        if (link.last) {
          //	Has been changed
          if (link.last != newTime) {
            //	Reload
            link.elem.setAttribute('href', this.getRandom(link.href));
          }
        }

        //	Set last time checked
        link.last = newTime;
      }
      setTimeout(function() {
        this.reloadFile(links);
      }, 1000);
    };

    this.getRandom = function(f) {
      return f + '?x=' + Math.random();
    };

    this.reloadFile(links);
  };

  var getLinks = function() {
    var files = document.getElementsByTagName('link'),
      links = [];

    for (var a = 0, l = files.length; a < l; a++) {
      var elem = files[a],
        rel = elem.rel;

      if (typeof rel !== 'string' || rel.length == 0 || rel == 'stylesheet') {
        links.push({
          elem: elem,
          href: elem.getAttribute('href').split('?')[0],
          last: false
        });
      }
    }
    return links;
  };

  var links = getLinks(),
    wp = false;

  for (var a = 0, l = links.length; a < l; a++) {
    if (links[a].href.indexOf('wp-content/') > -1) {
      wp = true;
      break;
    }
  }

  if (wp) {
    var wpra = readCookie('wprefresh-asked');
    if (wpra) {
      cssRefresh(links);
    } else if (confirm('Is this a WordPress site? Try WP Refresh!')) {
      createCookie('wprefresh-asked', 'yes', 7);
      window.open('http://wprefresh.frebsite.nl', 'wpr');
    } else {
      createCookie('wprefresh-asked', 'yes', 1);
      cssRefresh(links);
    }
  } else {
    cssRefresh(links);
  }
})();
