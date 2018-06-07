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
      send({msg: 'client hello'});
    }
  });
  /**
   * core implementation
   */
  window.onerror = function(msg, file, line, col, error) {
    // callback is called with an Array[StackFrame]
    StackTrace.fromError(error)
      .then(function(data) {
        send({msg: data, from: 'error', color: 'warning'});
      })
      .catch(function(err) {
        send({msg: err, from: 'catch', color: 'debug'});
      });
  };
  /**
   * added on V1.4.0 
   */
  window.onunhandledrejection = function(e) {
    StackTrace.fromError(e)
      .then(function(data) {
        send({msg: data, from: 'onunhandledrejection', color: 'warning'});
      })
      .catch(function(err) {
        send({msg: err, from: 'catch onunhandledrejection', color: 'debug'});
      });
  }
  /**
   * Allow this send method available in the global environment
   */
  window.$gulpServerIo.debugger = send;
})(window , navigator, StackTrace);
