function periodicClearStats() {
  console.log("Checking to see if we should clear stats.");
  console.log("Clear interval of " + config.clearStatsInterval);
  if (config.clearStatsInterval < 3600) {
    config.nextTimeToClear = 0;
    return;
  }
  
  if (!config.nextTimeToClear) {
    var d = new Date();
    d.setTime(d.getTime() + config.clearStatsInterval * 1000);
    d.setMinutes(0);
    d.setSeconds(0);
    if (config.clearStatsInterval == 86400) {
      d.setHours(0);
    }
    console.log("Next time to clear is " + d.toString());
    config.nextTimeToClear = d.getTime();
  }
  var now = new Date();
  if (now.getTime() > config.nextTimeToClear) {
    console.log("Yes, time to clear stats.");
    clearStatistics();
    var nextTimeToClear = new Date(nextTimeToClear + config.clearStatsInterval * 1000);
    console.log("Next time to clear is " + nextTimeToClear.toString());
    config.nextTimeToClear = nextTimeToClear.getTime();
    return;
  }
}

var config = new Config();
var sites = new Sites();
var tracker = new Tracker(sites);
sites.clear();

/* Listen for update requests. These come from the popup. */
chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    if (request.action == "clearStats") {
      console.log("Clearing statistics by request.");
      sites.clear();
      sendResponse({});
    } else if (request.action == "addIgnoredSite") {
      config.addIgnoredSite(request.site);
      sendResponse({});
    } else if (request.action == "pause") {
      //pause();
    } else if (request.action == "resume") {
      //resume();
    } else {
      console.log("Invalid action given.");
    }
  });
