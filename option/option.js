var L = ZhchLog;

// Chrome版本：保存单个设置项
function saveSingleValue(key, value) {
    // 直接保存到Chrome storage sync
    var option = {};
    option[key] = value;
    
    chrome.storage.sync.set(option, function() {
        if (chrome.runtime.lastError) {
            L.error('Error saving option:', chrome.runtime.lastError);
        } else {
            L.debug('Option saved:', key, value);
            // 通知background script选项已更改
            chrome.runtime.sendMessage({
                type: 'set_options',
                options: option
            });
        }
    });
}

// Chrome版本：错误处理
function onError(error) {
    L.error('Error:', error);
}

// Chrome版本：恢复选项设置
function restoreOptions() {
    chrome.storage.sync.get(null, function(result) {
        if (chrome.runtime.lastError) {
            onError(chrome.runtime.lastError);
            return;
        }
        
        L.debug('Restored options:', result);
        
        // 恢复单选框设置
        for (var key in result) {
            var value = result[key];
            L.debug('Restore value:', key, value);
            
            // 对于单选框，根据name和value设置选中状态
            var radioElement = $('input[name="' + key + '"][value="' + value + '"]');
            if (radioElement.length > 0) {
                radioElement.prop('checked', true);
            }
            
            // 对于文本输入框
            var inputElement = $('input[name="' + key + '"]');
            if (inputElement.hasClass('input_txt')) {
                inputElement.val(value);
            }
        }
    });
}

// Chrome版本：存储文本输入框内容
function saveInputTxt() {
    $('.input_txt').each(function() {
        var ele = $(this);
        var key = ele.attr('name');
        var value = ele.val();
        L.debug(key + ':' + value);
        saveSingleValue(key, value);
    });
}

// 页面加载完成事件
document.addEventListener("DOMContentLoaded", restoreOptions);

// Chrome版本：处理单选框点击事件
$('.single_choice').on('click', function() {
    var ele = $(this);
    var key = ele.attr('name');
    var value = ele.val();
    L.debug('Select option:', key, value);
    saveSingleValue(key, value);
});

// Chrome版本：处理文本输入事件
$('.input_txt').on('blur', function() {
    var ele = $(this);
    // 验证数字范围 0 < x < 101
    if (/^\d+$/.test(ele.val()) && ele.val() > 0 && ele.val() < 101) {
        saveInputTxt();
    } else {
        ele.val(9);
        saveInputTxt(); // 保存默认值
    }
})


