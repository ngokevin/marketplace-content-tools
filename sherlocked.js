// Visual regression test script for Sherlocked.
var ROOT = 'http://localhost:8680/';

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

.investigate('Submission Tools', function(client) {
    return desktop(client, 'submission/')
        .waitForExist('main', 60000);
})

.investigate('Reviewer Tools', function(client) {
    return desktop(client, 'review/')
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
