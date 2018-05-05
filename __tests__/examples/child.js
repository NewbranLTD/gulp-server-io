/**
 * This will test the communication channel between a parent / child process
 */
const { fork } = require('child_process');
const { join } = require('path');
const mod = join(__dirname, '..', '..', 'src', 'lib', 'utils', 'watcher');

const p = fork(mod);

p.on('message', m => {
    console.log('received message from child', m);
    p.send({start: false, msg: 'another message'});
});

p.send({start: true, config: {verbose: true, debounce: 500}});
