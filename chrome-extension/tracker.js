/**
 * Responsible for detecting focus change from tabs and windows.
 */
function Tracker(config, sites) {
  this._sites = sites;
  var self = this;
  chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
      // This tab has updated, but it may not be on focus.
      // It is more reliable to request the current tab URL.
      self._updateTimeWithCurrentTab();
    }
  );
  chrome.tabs.onActivated.addListener(
    function(activeInfo) {
      chrome.tabs.get(activeInfo.tabId, function(tab) {
        self._sites.setCurrentFocus(tab.url);
      });
    }
  );
  chrome.windows.onFocusChanged.addListener(
    function(windowId) {
      if (windowId == chrome.windows.WINDOW_ID_NONE) {
        self._sites.setCurrentFocus(null);
        return;
      }
      self._updateTimeWithCurrentTab();
    }
  );
  chrome.idle.onStateChanged.addListener(function(idleState) {
    if (idleState == "active") {
      config.idle = false;
      self._updateTimeWithCurrentTab();
    } else {
      config.idle = true;
      self._sites.setCurrentFocus(null);
    }
  });
  chrome.alarms.create(
    "updateTime",
    {periodInMinutes: config.updateTimePeriodMinutes});
  chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name == "updateTime") {
      // These event gets fired on a periodic basis and isn't triggered
      // by a user event, like the tabs/windows events. Because of that,
      // we need to ensure the user is not idle or we'll track time for
      // the current tab forever.
      if (!config.idle) {
        self._updateTimeWithCurrentTab();
      }
      // Force a check of the idle state to ensure that we transition
      // back from idle to active as soon as possible.
      chrome.idle.queryState(60, function(idleState) {
        if (idleState == "active") {
          config.idle = false;
        } else {
          config.idle = true;
          self._sites.setCurrentFocus(null);
        }
      });
    }
  });
}

Tracker.prototype._updateTimeWithCurrentTab = function() {
  var self = this;
  chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
    if (tabs.length == 1) {
      // Is the tab in the currently focused window? If not, assume Chrome
      // is out of focus. Although we ask for the lastFocusedWindow, it's
      // possible for that window to go out of focus quickly. If we don't do
      // this, we risk counting time towards a tab while the user is outside of
      // Chrome altogether.
      var url = tabs[0].url;
      chrome.windows.get(tabs[0].windowId, function(win) {
        if (!win.focused) {
          url = null;
        }
        self._sites.setCurrentFocus(url);
      });
    }
  });
};
