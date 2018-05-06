/**
 * This will test the communication channel between a parent / child process
 */
const { fork } = require('child_process');
const { join } = require('path');
const serverReload = require(join(__dirname, '..', '..', 'src', 'lib', 'utils', 'server-reload'));


serverReload({
    enable: true,
    dir: join(__dirname, '..', '.tmp'),
    callback: files => {
        console.log('files changed', files);
    }
});

/*
const mod = join(__dirname, '..', '..', 'src', 'lib', 'utils', 'watcher');

const p = fork(mod);

p.on('message', m => {
    switch (m.type) {
        case 'change':
            console.log('files changed', m.files);
        break;
        default:
    }
});

p.send({
    type: 'start', 
    verbose: true, 
    debounce: 500, 
    dir: join(__dirname, '..', '.tmp')
});
*/