// TODO: Make this configurable
const apiUrl = 'http://llama.slugsy.me/api/generate'
const apiKey = ''


//TODO: Allow the user to enter a url then go to the url and execute the script there
//This should be opptional with the current page as the default
//Also this seems to not work well 100 percent of the time
let activeTabId, lastUrl, lastTitle;

function getTabInfo(tabId) {
  chrome.tabs.get(tabId, function(tab) {
    if(lastUrl != tab.url || lastTitle != tab.title)
      console.log(lastUrl = tab.url, lastTitle = tab.title);
  });
}

chrome.tabs.onActivated.addListener(function(activeInfo) {
    activeTabId = activeInfo.tabId
//   getTabInfo(activeTabId = activeInfo.tabId);
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    activeTabId = tabId
//   if(activeTabId == tabId) {
//     getTabInfo(tabId);
//   }
});


chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
    if(request.action === 'getScript') {
        const code = await getCodeOllama(request.userPrompt);
        if (code == null) {
          throw new Error("Could not generate script.")
        } 
      sendResponse({ result: code });
    } else if(request.action === 'runScript') {
      code = request.generatedScript
      await chrome.scripting.executeScript({
        target: {tabId: activeTabId},
        func: code => {
          const el = document.createElement('script');
          el.textContent = code;
          document.documentElement.appendChild(el);
          el.remove();
        },
        args: [code],
        world: 'MAIN',
      });
      sendResponse({ result: "success" });
    } else {
      sendResponse({ result: "did nothing" });
  }
    return true;
 });


 async function getCodeOllama(userPrompt) {
  var script = 'console.log("No script generated. Check server for errors")';
  const apiKey = '123456789'
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "model": "codellama",
      "prompt": userPrompt + "Reply with code only. No comments",
      "stream": false
    })
  });

  if (response.status == 200) {
    var contents = await response.json();
    script = contents.response;
    console.log(script);
  }
  return script
 }


