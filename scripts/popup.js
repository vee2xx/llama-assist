
document.getElementById('genButton').addEventListener('click', async () => {
    const userPrompt = document.getElementById('userPrompt').value;
    const result = await chrome.runtime.sendMessage({ action: 'getScript', userPrompt: userPrompt});
    console.log(result);
});

document.getElementById('runButton').addEventListener('click', async () => {
    const generatedScript = document.getElementById('generatedScript').value;
    const result = await chrome.runtime.sendMessage({ action: 'runScript', generatedScript: generatedScript});
    console.log(result);
});

