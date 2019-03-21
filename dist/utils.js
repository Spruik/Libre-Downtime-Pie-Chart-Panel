'use strict';

System.register(['app/core/core'], function (_export, _context) {
  "use strict";

  var appEvents, hostname, influxHost, get, alert, copyObject, formatter;
  return {
    setters: [function (_appCoreCore) {
      appEvents = _appCoreCore.appEvents;
    }],
    execute: function () {
      hostname = window.location.hostname;

      _export('influxHost', influxHost = 'http://' + hostname + ':8086/');

      _export('influxHost', influxHost);

      _export('get', get = function get(url) {
        return new Promise(function (resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url);
          xhr.onreadystatechange = handleResponse;
          xhr.onerror = function (e) {
            return reject(e);
          };
          xhr.send();

          function handleResponse() {
            if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                var res = JSON.parse(xhr.responseText);
                resolve(res);
              } else {
                reject(this.statusText);
              }
            }
          }
        });
      });

      _export('get', get);

      _export('alert', alert = function alert(type, title, msg) {
        appEvents.emit('alert-' + type, [title, msg]);
      });

      _export('alert', alert);

      _export('copyObject', copyObject = function copyObject(obj) {
        var json = JSON.stringify(obj);
        return JSON.parse(json);
      });

      _export('copyObject', copyObject);

      _export('formatter', formatter = function formatter(params) {});

      _export('formatter', formatter);
    }
  };
});
//# sourceMappingURL=utils.js.map
