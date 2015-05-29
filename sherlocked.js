// Visual regression test script for Sherlocked.
var ROOT = 'http://localhost:8000/';

function mobile(client, path) {
    return client
        .setViewportSize({width: 320, height: 960})
        .url(ROOT + (path || ''));
}

function desktop(client, path) {
    return client
        .setViewportSize({width: 1050, height: 2048})
        .url(ROOT + (path || ''));
}


require('sherlocked')

.investigate('Landing on Mobile', function(client) {
    return mobile(client)
        .waitForExist('main', 60000);
})

.investigate('Landing on Desktop', function(client) {
    return desktop(client)
        .waitForExist('main', 60000);
})

.begin([
    {
        browserName: 'firefox',
        platform: 'OS X 10.9'
    },
    {
        browserName: 'chrome',
        platform: 'OS X 10.9'
    },
    {
        browserName: 'safari',
        platform: 'OS X 10.9'
    }
]);
