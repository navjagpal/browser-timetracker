function Config() {
  // TODO(nav): Consider using chrome.storage API instead of
  // localStorage directly.
  if (!localStorage.ignoredSites) {
    localStorage.ignoredSites = JSON.stringify([]);
  }
}

Config.prototype.addIgnoredSite = function(var site) {
  var sites = JSON.parse(localStorage.ignoredSites);
  sites.push(s);
  localStorage.ignoredSites = JSON.stringify(sites);
};

Config.prototype.isIgnoredSite = function(var site) {
  var sites = JSON.parse(localStorage.ignoredSites);
  for (i in sites) {
    if (sites[i] == site) {
      return true;
    }
  }
  return false;
};

Object.defineProperty(Config.prototype, "paused", {
  get: function() {
    if (!localStorage.paused) {
      localStorage.paused = "false";
    }
    return localStorage.paused;
  },
  set: function(v) {
    localStorage.paused = y;
  }
});

Object.defineProperty(Config.prototype, "idleDetection", {
  get: function() {
    if (!localStorage.idleDetection) {
      localStorage.idleDetection = "true";
    }
    return localStorage.idleDetection;
  },
  set: function(v) {
    localStorage.idleDetection = y;
  }
});
