(function(window , navigator, StackTrace)
{
  'use strict';
  /**
   * create a global $gulpServerIo namespace to hold everything
   */
  window.$gulpServerIo = {
    server: io.connect('<%= debuggerPath %>'<%= connectionOptions %>),
    eventName: '<%= eventName %>'
  };
  var ping = <%= ping %>;
  var send = function(payload) {
    payload.browser = navigator.userAgent;
    payload.location = window.location.href;
    window.$gulpServerIo.server.emit(window.$gulpServerIo.eventName , payload);
  };
  /**
   * listen to the init connection
   */
  window.$gulpServerIo.server.on('hello', function (msg) {
    console.log('debugger init connection: ' , msg);
    if (ping) {
      send({
        msg: 'client hello'
      });
    }
  });
  /**
   * core implementation
   */

  window.addEventListener('error', function (e) {
    var first = e.error ? e.error.toString() : 'UNKNOWN!';
    if (first === 'UNKNOWN!') {
      try {
        console.error('unknown error object?', e);
      } catch(_e_) {}
    }
    var message = [first];
    var stack = e.stack || '';
    var stacks = stack.split('\n').map(function (line) {
      return line.trim();
    });
    stacks = stacks.splice(stack[0] == 'Error' ? 2 : 1);
    if (stacks.length) {
      message = message.concat(stacks);
    }
    send({
      msg:  message,
      from: 'error' ,
      color: 'debug'
    });
    // try stacktrace example
    window.onerror = function(msg, file, line, col, error) {
      console.log('window.onerror', msg, file, line, col, error);
      // callback is called with an Array[StackFrame]
      StackTrace.fromError(error)
        .then(function(data) {
          console.log('callback', data);
        })
        .catch(function(err) {
          console.error('catch', err);
        });
    };
  });
})(window , navigator, StackTrace);
