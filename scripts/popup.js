
document.getElementById('runButton').addEventListener('click', async () => {
    const userPrompt = document.getElementById('codeInput').value;
    // const blob = new Blob([userPrompt], { type: 'application/javascript' });
    // const url = URL.createObjectURL(blob);

    // chrome.runtime.sendMessage({ action: 'saveAndExecute', userPrompt: userPrompt}, (response) => {
    //     // document.getElementById('output').textContent = response.result;
    //     console.log(response);
    //     // URL.revokeObjectURL(url);
    // });
    const result = await chrome.runtime.sendMessage({ action: 'saveAndExecute', userPrompt: userPrompt});
    console.log(result);
});

