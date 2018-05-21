1.5.0-alpha.1
* make the debugger io more useful, instead of asking the user to use our own event log system. We could ask them to provide a config option at the run time to overload the `console.xxx` this way, they can be use without knowing it. 
* provide a better logger description, why they want to use it. Also this make more sense if they use the server as a deploy option, but we still need to overcome the oddity we encouter during serving up the preact.js app about the secondary loaded js files not recognized as a application/javasript 
* (main) completely rearchitect the socket server structure, also how the middleware get injected, at the moment it's all over the places. 

2.0.0 @TODO @TBC 
* a plugin system to allow a dashboard like functionality to track what is happening to the app in development.
* develop a chrome plugin to integrate testing result with the collebolly network. 
* user identity / payment tracking / remote discussion 
* Gmail plugin to view / reply tickets
* Slack bot

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
