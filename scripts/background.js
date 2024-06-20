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
    if(request.action === 'saveAndExecute') {
        const code = await getCode(request.userPrompt);
        if (code == null) {
          throw new Error("Could not generate script.")
        }

        // var currentWindow = await chrome.windows.getCurrent(); //current window in case more than one is open as then there will be more than one active tab
        // const tabs = await chrome.tabs.query({ active: true, windowId: currentWindow.id });
        // const tabId = tabs[0].id;

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

 async function getCode(userPrompt) {
    //temp - use openai for poc
    var script;

    const apiKey = '';
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo-16k",
            "messages": [
              {
                "role": "system",
                "content": [
                  {
                    "type": "text",
                    "text": "You are a generation assistant. You will be provided with text describing the problem the script is required to solve. Respond with code only without explanation."
                  }
                ]
              },
              {
                "role": "user",
                "content": [
                  {
                    "type": "text",
                    "text": userPrompt
                  }
                ]
              }
            ],
            "temperature": 1,
            "max_tokens": 100,
            "top_p": 1,
            "frequency_penalty": 0,
            "presence_penalty": 0
          })
    });
    if (response.status == 200) {
        var contents = await response.json();
        script = contents.choices[0].message.content;
    }
    return script
 }


//  async function execInPage(code) {
//     const [tab] = await chrome.tabs.query({currentWindow: true, active: true});
//     chrome.scripting.executeScript({
//       target: {tabId: tab.id},
//       func: code => {
//         const el = document.createElement('script');
//         el.textContent = code;
//         document.documentElement.appendChild(el);
//         el.remove();
//       },
//       args: [code],
//       world: 'MAIN',
//       //injectImmediately: true, // Chrome 102+
//     });
//   }
  
//   execInPage('console.log(123)');