function Config() {
  // TODO(nav): Consider using chrome.storage API instead of
  // localStorage directly.
  if (!localStorage.ignoredSites) {
    localStorage.ignoredSites = JSON.stringify([]);
  }
}

Config.prototype.addIgnoredSite = function(site) {
  var sites = JSON.parse(localStorage.ignoredSites);
  sites.push(s);
  localStorage.ignoredSites = JSON.stringify(sites);
};

Config.prototype.isIgnoredSite = function(site) {
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
    return localStorage.paused == "true";
  },
  set: function(v) {
    if (v == false) {
      localStorage.paused = "false";
    } else if (v == true) {
      localStorage.paused = "true";
    }
  }
});

Object.defineProperty(Config.prototype, "clearStatsInterval", {
  get: function() {
    if (!localStorage.clearStatsInterval) {
      localStorage.clearStatsInterval = "0";
    }
    return parseInt(localStorage.clearStatsInterval, 10);
  },
  set: function(i) {
    localStorage.clearStatsInterval = i.toString();
  }
});

Object.defineProperty(Config.prototype, "nextTimeToClear", {
  get: function() {
    if (!localStorage.nextTimeToClear) {
      localStorage.nextTimeToClear = "0";
    }
    return parseInt(localStorage.nextTimeToClear, 10);
  },
  set: function(i) {
    localStorage.nextTimeToClear = i.toString();
  }
});

Object.defineProperty(Config.prototype, "updateTimePeriodMinutes", {
  get: function() {
    return 1;
  }
});
