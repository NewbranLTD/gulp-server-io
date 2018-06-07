1.0.0-alpha.2
* socket.io debugger in place
1.0.0-alpha.1
* Replace `connect` with `express`, allow for more third parties middleware integrate into this package.
* Replace `tiny-lr` with `chokidar`, `reload`, and `baconjs` that allow better cross platform support and, better control over the file watch.
* Fold several out dated packages into the code and, maintain ourself.
* Redevelop the socket.io-debugger from ground up to make it easier to develop more features in the future.
* Add `json-server` combine with `http-proxy-middleware` to allow mock REST API during development (even during deployment).
* Most of the options are now one line configuration.
* Completely redesign the code structure to make it easier to develop by breaking up everything into it's own module.
* Rewrote most of the test and, coverage report to have a better understanding of the progress.
* replace `open` with `opn` to automatically open browser during development.
