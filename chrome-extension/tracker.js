function Tracker(sites) {
  this._sites = sites;
  var self = this;
  chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
      self._sites.setCurrentFocus(tab.url);
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
      self._updateTimeWithCurrentTab();  
    } else {
      this._sites.setCurrentFocus(null);
    }
  });
  chrome.alarms.create("updateTime", {periodInMinutes: 1});
  chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name == "updateTime") {
      self._updateTimeWithCurrentTab();  
    }
  });
}

Tracker.prototype._updateTimeWithCurrentTab = function() {
  var self = this;
  chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
    if (tabs.length == 1) {
      self._sites.setCurrentFocus(tabs[0].url);
    }
  });
};
