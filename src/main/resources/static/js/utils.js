/*
 * Copyright 2014-2015 Evernote Corporation. All rights reserved.
 */

// Returns utility methods to be used throughout application.
define([], function() {
  var utils = {};

  function decode(s) {
    var pl = /\+/g;  // Regex for replacing addition symbol with a space
    return decodeURIComponent(s.replace(pl, ' '));
  }

  // Returns the URL paramters as an object.
  utils.getURLParams = (function() {
    var url = window.location.href;
    var urlParams = {};
    var query = url.split(/\?(.+)?/)[1];

    if (query) {
      query.split('&').forEach(function(item) {
        item = item.split('=');
        urlParams[decode(item[0]).toLowerCase()] = decode(item[1]);
      });
    }

    return function() { return urlParams; };
  })();

  return utils;
});