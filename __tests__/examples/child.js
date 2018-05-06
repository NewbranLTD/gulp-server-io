/**
 * This will test the communication channel between a parent / child process
 */
const { fork } = require('child_process');
const { join } = require('path');
const debug = require('debug')('gulp-webserver-io:stream-watcher');
const serverReload = require(join(__dirname, '..', '..', 'src', 'lib', 'server-reload'));
const fileWatcher = require(join(__dirname, '..', '..', 'src', 'lib', 'utils', 'watcher'));
const dir = join(__dirname, '..', '.tmp');

fileWatcher(dir, true, 500, files => {
    debug('files changed', files);
});

/*
serverReload({
    enable: true,
    dir: join(__dirname, '..', '.tmp'),
    callback: files => {
        console.log('files changed', files);
    }
});
*/
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