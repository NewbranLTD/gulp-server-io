/* eslint no-unused-vars:0 */
/**
 * Express edition
 */
const open = require('opn');
const _ = require('lodash');
const http = require('http');
const path = require('path');

const logger = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
// Properties
const root = path.join(__dirname, '..', 'fixtures', 'app');
// Const connectInject = require('connect-inject');
const scriptInject = require('../../src/lib/script-inject');
const options = require('../../src/lib/options');
const watcher = require('../../src/lib/watcher');
// Init
const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(
  scriptInject({
    snippet: `<script type="text/javascript" src="/reload/reload.js"></script>`
  })
);

app.use(express.static(root));

const server = http.createServer(app);

watcher(root, app, { verbose: true });

server.listen(3000, () => {
  console.log('server start @ 3000');
  open('http://localhost:3000');
});
