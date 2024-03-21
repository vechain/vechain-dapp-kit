if (chrome.extension) {
    const devToolsScript = document.createElement('script');
    devToolsScript.src = 'react-devtools.js';
    document.head.appendChild(devToolsScript);
}
