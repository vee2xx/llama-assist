
document.getElementById('runButton').addEventListener('click', async () => {
    const userPrompt = document.getElementById('codeInput').value;
    const result = await chrome.runtime.sendMessage({ action: 'saveAndExecute', userPrompt: userPrompt});
    console.log(result);
});

