/**
 * Stores the time that is spent on each site.
 *
 * The primary interface to this class is through setCurrentFocus.
 */
function Sites(config) {
  this._config = config;
  if (!localStorage.sites) {
    localStorage.sites = JSON.stringify({});
  }
  this._currentSite = null;
  this._siteRegexp = /^(\w+:\/\/[^\/]+).*$/;
  this._startTime = null;
}

/**
 * Returns the a dictionary of site -> seconds.
 */
Object.defineProperty(Sites.prototype, "sites", {
  get: function() {
    var s = JSON.parse(localStorage.sites);
    var sites = {}
    for (var site in s) {
      if (s.hasOwnProperty(site) && !this._config.isIgnoredSite(site)) {
        sites[site] = s[site];
      }
    }
    return sites;
  }
});

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
    return;
  }
  var delta = new Date() - this._startTime;
  console.log("Site: " + this._currentSite + " Delta = " + delta/1000);
  if (delta/1000/60 > 2*this._config.updateTimePeriodMinutes) {
    console.log("Delta of " + delta/1000 + " seconds too long; ignored.");
    return;
  }
  var sites = this.sites;
  if (!sites[this._currentSite]) {
    sites[this._currentSite] = 0;
  }
  sites[this._currentSite] += delta/1000;
  localStorage.sites = JSON.stringify(sites);
};

/**
 * This method should be called whenever there is a potential focus change.
 * Provide url=null if Chrome is out of focus.
 */
Sites.prototype.setCurrentFocus = function(url) {
  console.log("setCurrentFocus: " + url);
  this._updateTime();
  if (url == null) {
    this._currentSite = null;
    this._startTime = null;
    chrome.browserAction.setIcon(
        {path: {19: 'images/icon_paused19.png',
                38: 'images/icon_paused38.png'}});
  } else {
    this._currentSite = this.getSiteFromUrl(url);
    this._startTime = new Date();
    chrome.browserAction.setIcon(
        {path: {19: 'images/icon19.png',
                38: 'images/icon38.png'}});
  }
};

/**
 * Clear all statistics.
 */
Sites.prototype.clear = function() {
  localStorage.sites = JSON.stringify({});
  this._config.lastClearTime = new Date().getTime();
};
