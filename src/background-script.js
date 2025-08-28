
// Chrome Extension Service Worker for Buggy Translate
// Manifest V3 compatible background script

// 监听扩展安装事件
chrome.runtime.onInstalled.addListener((details) => {
    console.log('Buggy Translate Chrome extension installed:', details.reason);
    
    // 设置默认选项
    if (details.reason === 'install') {
        const defaultOptions = {
            api: 'youdao',
            box_location: 0,
            close_by_click: 0,
            theme: 'theme_black',
            play_audio: 0,
            panel_show_time: 9,
            only_word: 0
        };
        
        chrome.storage.sync.set(defaultOptions, () => {
            console.log('Default options set');
        });
    }
});

// 监听来自content script和popup的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('[Buggy Translate Background] Received message:', message);
    console.log('[Buggy Translate Background] Sender info:', sender);
    
    switch (message.type) {
        case 'get_options':
            console.log('[Buggy Translate Background] Getting options from storage...');
            // 获取存储的选项
            chrome.storage.sync.get(null, (options) => {
                console.log('[Buggy Translate Background] Retrieved options:', options);
                sendResponse(options);
            });
            return true; // 保持消息通道开放
            
        case 'set_options':
            console.log('[Buggy Translate Background] Setting options:', message.options);
            // 保存选项
            chrome.storage.sync.set(message.options, () => {
                console.log('[Buggy Translate Background] Options saved successfully:', message.options);
                sendResponse({ success: true });
            });
            return true;
            
        case 'translate_request':
            console.log('[Buggy Translate Background] Handling translate request:', message.data);
            // 处理翻译请求（如果需要在后台处理）
            handleTranslateRequest(message.data, sendResponse);
            return true;
            
        default:
            console.log('[Buggy Translate Background] Unknown message type:', message.type);
    }
});

// 处理翻译请求的函数
function handleTranslateRequest(data, sendResponse) {
    console.log('[Buggy Translate Background] Handling translate request for:', data.text);
    console.log('[Buggy Translate Background] Request URL:', data.url);
    
    // 在service worker中发送网络请求，避免CORS问题
    fetch(data.url, {
        method: 'GET',
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'User-Agent': 'Mozilla/5.0 (compatible; Buggy Translate Chrome Extension)'
        }
    })
    .then(response => {
        console.log('[Buggy Translate Background] Fetch response:', response.status, response.statusText);
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.text();
    })
    .then(html => {
        console.log('[Buggy Translate Background] HTML received, length:', html.length);
        sendResponse({ 
            success: true, 
            html: html,
            text: data.text,
            api: data.api
        });
    })
    .catch(error => {
        console.error('[Buggy Translate Background] Fetch error:', error);
        sendResponse({ 
            success: false, 
            error: error.message,
            text: data.text
        });
    });
}

// 监听存储变化，通知content script更新选项
chrome.storage.onChanged.addListener((changes, namespace) => {
    console.log('[Buggy Translate Background] Storage changed in namespace:', namespace);
    console.log('[Buggy Translate Background] Changes:', changes);
    
    // 通知所有活动的标签页更新选项
    chrome.tabs.query({ active: true }, (tabs) => {
        console.log('[Buggy Translate Background] Found active tabs:', tabs.length);
        tabs.forEach(tab => {
            console.log('[Buggy Translate Background] Sending options_changed to tab:', tab.id, tab.url);
            chrome.tabs.sendMessage(tab.id, {
                type: 'options_changed',
                changes: changes
            }).catch(err => {
                // 忽略无法发送消息的标签页（如chrome://页面）
                console.log('[Buggy Translate Background] Could not send message to tab:', tab.id, err.message);
            });
        });
    });
});