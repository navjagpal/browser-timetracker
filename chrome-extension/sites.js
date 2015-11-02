function Sites() {
  if (!localStorage.sites) {
    localStorage.sites = JSON.stringify({});
  }
  this._currentSite = null;
  this._siteRegexp = /^(\w+:\/\/[^\/]+).*$/;
  this._startTime = null;
}

/**
 * Returns just the site/domain from the url. Includes the protocol.
 * chrome://extensions/some/other?blah=ffdf -> chrome://extensions
 * @param {string} url The URL of the page, including the protocol.
 * @return {string} The site, including protocol, but not paths.
 */
Sites.prototype.getSiteFromUrl = function(url) {
  var match = url.match(this._siteRegexp);
  if (match) {
    return match[1];
  }
  return null;
};

Sites.prototype._updateTime = function() {
  if (!this._currentSite || !this._startTime) {
    console.log("no site or time");
    return;
  }
  var delta = new Date() - this._startTime;
  console.log("Site: " + this._currentSite + " Delta = " + delta/1000);
  // TODO(nav): Deal with large deltas, which are sign of trouble.
  var sites = JSON.parse(localStorage.sites);
  if (!sites[this._currentSite]) {
    sites[this._currentSite] = 0;
  }
  sites[this._currentSite] += delta/1000;
  localStorage.sites = JSON.stringify(sites); 
};

Sites.prototype.setCurrentFocus = function(url) {
  console.log("setCurrentFocus: " + url);
  this._updateTime();
  if (url == null) {
    this._currentSite = null;
    this._startTime = null;
    chrome.browserAction.setIcon({path: 'images/icon_paused.png'});
  } else {
    this._currentSite = this.getSiteFromUrl(url);
    this._startTime = new Date();
    console.log("setCurrentFocusSite: " + this._currentSite);
    chrome.browserAction.setIcon({path: 'images/icon.png'});
  }
};

Sites.prototype.clear = function() {
  localStorage.sites = JSON.stringify({});
};
