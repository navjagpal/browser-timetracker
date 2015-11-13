/**
 * Read and modify various configuration parameters.
 *
 * Abstracts away the underlying storage mechanism.
 */
function Config() {
  if (!localStorage.ignoredSites) {
    localStorage.ignoredSites = JSON.stringify([]);
  }
}

Config.timeDisplayFormatEnum = {
  PRETTY: 0,
  MINUTES: 1
}

Config.prototype.addIgnoredSite = function(site) {
  if (this.isIgnoredSite(site)) {
    return;
  }
  var sites = JSON.parse(localStorage.ignoredSites);
  sites.push(site);
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

/**
 * Display format for popup.
 */
Object.defineProperty(Config.prototype, "timeDisplayFormat", {
  get: function() {
    if (!localStorage.timeDisplayFormat) {
      localStorage.timeDisplayFormat = Config.timeDisplayFormatEnum.PRETTY;
    }
    return localStorage.timeDisplayFormat;
  },
  set: function(i) {
    localStorage.timeDisplayFormat = i;
  }
});

/**
 * Interval (seconds) for clearing statistics.
 */
Object.defineProperty(Config.prototype, "clearStatsInterval", {
  get: function() {
    if (!localStorage.clearStatsInterval) {
      localStorage.clearStatsInterval = "0";
    }
    return parseInt(localStorage.clearStatsInterval, 10);
  },
  set: function(i) {
    if (i != this.clearStatsInterval) {
      localStorage.clearStatsInterval = i.toString();
      this.nextTimeToClear = 0;
    }
  }
});

/**
 * Next time (Unix Epoch) for clearing statistics.
 */
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

/**
 * Time (Unix Epoch) the stats were most recently cleared.
 */
Object.defineProperty(Config.prototype, "lastClearTime", {
  get: function() {
    if (!localStorage.lastClearTime) {
      localStorage.lastClearTime = "0";
    }
    return parseInt(localStorage.lastClearTime, 10);
  },
  set: function(i) {
    localStorage.lastClearTime = i.toString();
  }
});

/**
 * The current idle state of the user.
 */
Object.defineProperty(Config.prototype, "idle", {
  get: function() {
    if (!localStorage.nextTimeToClear) {
      localStorage.idle = "false";
    }
    return localStorage.idle == "true";
  },
  set: function(i) {
    if (i) {
      localStorage.idle = "true"; 
    } else {
      localStorage.idle = "false";
    }
  }
});
