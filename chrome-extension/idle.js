/**
 * @fileoverview Notifies background page of user activity.
 * @author nav@gmail.com (Nav Jagpal)
 */

var port = chrome.extension.connect({name: "idle"});

/* Keep this simple because it happens on every mouse movement. */
document.body.onmousemove = function() {
  port.postMessage({});
}
