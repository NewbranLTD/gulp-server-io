'use strict';
const open = require('opn');
const path = require('path');
const http = require('http');
const chalk = require('chalk');
const connect = require('connect');
const serveStatic = require('serve-static');

const root = path.join(__dirname, '..', 'fixtures', 'app');
const app = connect();

app.use(
  serveStatic(root, {
    index: ['index.html', 'index.htm']
  })
);
const server = http.createServer(app);

server.listen(3001, () => {
  console.log(chalk.yellow('Example server start @ 3001'));
  open('http://localhost:3001');
});
