// Copyright 2009 Google Inc. All Rights Reserved.

/**
 * @fileoverview Description of this file.
 * @author nav@google.com (Nav Jagpal)
 */

var port = chrome.extension.connect({name: "idle"});

document.body.onmousemove = function() {
  console.log("Mouse move detected.");
  port.postMessage({});
}
