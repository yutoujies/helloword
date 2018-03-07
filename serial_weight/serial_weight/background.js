chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create("popup.html",
    {  frame: "chrome",
       id: "PMToyWinID",
       innerBounds: {
         width: 800,
         height: 600,
         left: 600,
         minWidth: 220,
         minHeight: 220
      }
    }
  );
});

