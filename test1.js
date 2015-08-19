var jsdom = require("./node_modules/jsdom");
jsdom.env({
    html: body,
    scripts: ['http://code.jquery.com/jquery-1.6.min.js'],
    done: function (err, window) {
        var $ = window.jQuery;
        res.send($('title').text());
    }
});
