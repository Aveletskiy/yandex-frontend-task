//=./../../../node_modules/fingerprintjs2/fingerprint2.js
//=./../../../node_modules/socket.io-client/dist/socket.io.js

$(document).ready(function(){
    var cookie = parseCookie(document.cookie);
    if (!cookie.do_not_track) {
        new Fingerprint2().get(function(result, components){
            var socket = io.connect(window.location.origin, {
                transports: [ 'websocket', 'polling' ]
            });

            var params = getParams();
            socket.emit('track', {
                fingerprint: result,
                ref: params.ref
            });

            socket.on('tracked', function(data) {
                setCookie('do_not_track', true);
                socket.disconnect();
            });
        });
    }
});

function getParams() {
    var params = window
        .location
        .search
        .replace('?','')
        .split('&')
        .reduce(
            function(p,e){
                var a = e.split('=');
                p[ decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
                return p;
            },
            {}
        );
    return params;
}

function parseCookie(cookie) {
    var params = cookie
        .split(';')
        .reduce(
            function(p, e){
                var a = e.trim().split('=');
                p[ decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
                return p;
            },
            {}
        );
    return params;
}

function setCookie(name, value, options) {
    options = options || {};

    var expires = options.expires;

    if (typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    var updatedCookie = name + "=" + value;

    for (var propName in options) {
        updatedCookie += "; " + propName;
        var propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }

    document.cookie = updatedCookie;
}