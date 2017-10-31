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
const scriptInject = require('../../src/lib/script-inject');
const options = require('../../src/lib/options');
// Init
const app = express();
// Overwrite the config
const config = _.extend({}, options, { debugger: false });

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.static(root));
app.use(scriptInject(config));

const server = http.createSever(app);

reload(app);

server.listen(3000, () => {
  console.log('server start @ 3000');
  open('http://localhost:3000');
});
