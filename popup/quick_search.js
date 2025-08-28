
// Chrome Extension Popup Script
DictionaryView.init(window, true);
DictionaryView.loadPage();

// 初始化Dictionary并加载选项
Dictionary.init();

// 从Chrome storage加载选项
chrome.runtime.sendMessage({ type: 'get_options' }, (options) => {
    if (options && Object.keys(options).length > 0) {
        DictionaryView.setOptions(options);
        Dictionary.setOptions(options);
        console.log('Popup options loaded:', options);
    }
});

function quickSearch() {
    var word = $("#search_input").val();
    if (word.length > 0) {
        Dictionary.searchWord(word, true);
    }
}

$("#search_btn").click(function() {
    quickSearch();
});

$("#search_input").on("keyup", function(e) {
    var key = e.which;
    // 回车查词
    if (key == 13) {
        quickSearch();
    }
});

// Chrome版本：打开选项页面
$(".open_options").on("click", function(e) {
    chrome.runtime.openOptionsPage();
});

setTimeout(function() {
    $("#search_input").focus();
}, 200);