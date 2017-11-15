(function(window , navigator)
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
      console.log('unknown error object?', e);
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
  });
})(window , navigator);
