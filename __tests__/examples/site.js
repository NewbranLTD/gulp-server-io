/* eslint no-unused-vars:0 */
/**
 * Express edition
 */
const open = require('opn');
const _ = require('lodash');
const http = require('http');
const path = require('path');
const reload = require('reload');
const logger = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
// Properties
const root = path.join(__dirname, '..', 'fixtures', 'app');
// Const connectInject = require('connect-inject');
const scriptInject = require('../../src/lib/script-inject');
const options = require('../../src/lib/options');
// Init
const app = express();

// App.use(logger('dev'));
// app.use(bodyParser.json());
app.use(express.static(root, { index: ['index.html', 'index.htm'] }));
app.use(
  scriptInject({
    snippet: `<script type="text/javascript" src="/reload/reload.js"></script>`
  })
);
const server = http.createServer(app);

reload(app);

server.listen(3000, () => {
  console.log('server start @ 3000');
  open('http://localhost:3000');
});
