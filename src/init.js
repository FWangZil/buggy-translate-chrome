

// Chrome Extension Content Script Initialization
console.log('[Buggy Translate] Content script starting initialization...');

DictionaryView.init(window);
console.log('[Buggy Translate] DictionaryView initialized');

DictionaryView.loadPage();
console.log('[Buggy Translate] DictionaryView page loaded');

Dictionary.init();
console.log('[Buggy Translate] Dictionary initialized');

// 从Chrome storage加载选项
console.log('[Buggy Translate] Requesting options from background...');
chrome.runtime.sendMessage({ type: 'get_options' }, (options) => {
    console.log('[Buggy Translate] Received options response:', options);
    if (options && Object.keys(options).length > 0) {
        DictionaryView.setOptions(options);
        Dictionary.setOptions(options);
        console.log('[Buggy Translate] Options applied successfully:', options);
    } else {
        console.log('[Buggy Translate] No options received, using defaults');
    }
});

// 监听来自background script的选项变化消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('[Buggy Translate] Received message:', message);
    if (message.type === 'options_changed') {
        console.log('[Buggy Translate] Options changed, updating:', message.changes);
        // 重新获取所有选项
        chrome.runtime.sendMessage({ type: 'get_options' }, (options) => {
            console.log('[Buggy Translate] Updated options received:', options);
            if (options) {
                DictionaryView.setOptions(options);
                Dictionary.setOptions(options);
                console.log('[Buggy Translate] Options updated successfully');
            }
        });
    }
});

// click 时初始化插件
function handleClick(e, winClick){
    console.log('[Buggy Translate] Mouse click detected, button:', e.button);
    // 鼠标左中右键是 0 1 2, 只对左键有反应
    if(e.button > 0){
        console.log('[Buggy Translate] Ignoring non-left click');
        return;
    }
    console.log('[Buggy Translate] Processing left click at:', e.clientX, e.clientY);
    DictionaryView.mouse(e.clientX, e.clientY, e);
    Dictionary.checkSelection(winClick);
}

// 启动插件监听
console.log('[Buggy Translate] Setting up event listeners...');
// $("body").on("click", checkSelection);
$(document).on("mouseup", function(e){
    console.log('[Buggy Translate] Document mouseup event triggered');
    handleClick(e, window);
});

// frame 要分别注册事件，因为　getSelection() 取不到frame中选中的内容　(spring javadoc 页面)
console.log('[Buggy Translate] Setting up frame listeners, frame count:', window.frames.length);
for (var i = 0; i < window.frames.length; i++){
    var thisFrame = window.frames[i];
    console.log('[Buggy Translate] Setting up listener for frame:', i);
    $(window.frames[i].document).on("mouseup", function(e){
        console.log('[Buggy Translate] Frame mouseup event triggered');
        handleClick(e, thisFrame);
    })
}

console.log('[Buggy Translate] Content script initialization completed!');


/*"scripts": ["src/background-script.js"]*/