(function() {

    // Baseline setup
    // --------------

    // Establish the root object, `window` in the browser, or `exports` on the server.
    var root = this;

    // Create a safe reference to the Underscore object for use below.
    var _ = function(obj) {
        if (obj instanceof _) return obj;
        if (!(this instanceof _)) return new _(obj);
        this._wrapped = obj;
    };


    /** 
    * 词典的主要逻辑
    * 取词界面
    * 1. document　页面内容取词
    * 2. frame 中取词
    * 3. textarea input　中取词
    * 4. 
    *
    * 其他功能
    * 1. 设置选项中各项的改变 
    *
    *
    *
    *
    *
    */
    
    
    var St = StringUtils;
    var L = ZhchLog;
    var View = DictionaryView;
    /**
     * 记录本脚本全局变量和配置页面的配置
     */
    var G = {}; // 有默认值的在下面一起设置
    G.api = "youdao"; // 网查接口, 默认值为 youdao
    G.lastWord = ""; // 最后一次查的词
    G.only_word = 0; // 是否只查纯单词

    var API = {
        "youdao":{
            url:"https://dict.youdao.com/search",
            data:{"keyfrom":"dict.index","q":"word"}
        },
        "bing":{
            url:"https://cn.bing.com/dict/search",
            data:{"q":"word"}
        }
    };
    
    // 正则匹配英文数字
    var englishReg = /^[-\w\s'\d\.]+$/;
    // 正则匹配英文
    var alphabetReg = /^[-\w\s'\.]+$/;
    // 正则匹配非英文
    var notEnglishReg = /[^-\w\s'\d\.]+/g;


    // 检查是否要查字典
    _.checkSelection = function(winClick){
       // console.log('[Buggy Translate] checkSelection called with winClick:', winClick);
        var text = "";
        try{
            var target = View.getG().mouse.ele.target;
           // console.log('[Buggy Translate] Target element:', target);
            // 如果是input textarea之类的，FF中用 window.getSelection 取不到，所以提前用它们的方法取值
            if(target.value != null){
                var eleIsSelect = target.type.indexOf('select') >= 0;
               // console.log('[Buggy Translate] Element type:', target.type, 'is select:', eleIsSelect);
                L.debug("ele.target type:", target.type, " is select:", eleIsSelect);
                if(!eleIsSelect){
                    text = target.value.substring(target.selectionStart, target.selectionEnd);
                   // console.log('[Buggy Translate] Text from input element:', text);
                }
            }
        }catch(err){
           // console.log('[Buggy Translate] Error getting target element text:', err);
            // 一般不会出错，　出错也不理它就好了
        }
        if(text == null || text.length == 0){
            text = _.getSelectedText(winClick);
           // console.log('[Buggy Translate] Text from getSelectedText:', text);
        }
       // console.log('[Buggy Translate] Final selected text:', text);
        L.debug("text is :" + text);
        if(text.length > 10 && !alphabetReg.test(text)){ // 长度大于１０且不是全英文的内容不处理
           // console.log('[Buggy Translate] Text too long and not English, ignoring:', text);
            text = "";
        }
        // 只处理英文
        if(!englishReg.test(text)){
           // console.log('[Buggy Translate] Text contains non-English characters, filtering:', text);
            text = text.replace(notEnglishReg, "");
           // console.log('[Buggy Translate] Filtered text:', text);
        }
        text = St.trim(text);
        
        // 数字不处理
        if(/^\d+$/.test(text)){
           // console.log('[Buggy Translate] Text is pure number, ignoring:', text);
            text = "";
        }
        
       // console.log('[Buggy Translate] Processed text:', text);
        L.debug("after replace text is :" + text);

        // 如果设置是只查单词,则有空白时不查
        if(G.only_word == 1 && /\s/.test(text)){
           // console.log('[Buggy Translate] Only word mode enabled, ignoring phrase:', text);
            text = "";
        }
        
        if(text != null && text.length > 0){
           // console.log('[Buggy Translate] Valid text found, checking if should translate:', text);
           // console.log('[Buggy Translate] Box showing:', View.getG().box_is_showing, 'Last word:', G.lastWord);
            if(!View.getG().box_is_showing || text != G.lastWord){
               // console.log('[Buggy Translate] Starting translation for:', text);
                G.lastWord = text;
                _.searchWord(text);
            } else {
               // console.log('[Buggy Translate] Same word already showing, skipping translation');
            }
        }else{
           // console.log('[Buggy Translate] No valid text to translate, handling click');
            View.handleClick();
        }
    }
    // 取选中的文字
    _.getSelectedText = function(winClick){
       // console.log('[Buggy Translate] getSelectedText called with winClick:', winClick);
        L.debug("chu dian shen a ")
        // firefox中有 window.getSelection, 但是不返回　textarea 中的选中内容
        if(winClick.getSelection) {
           // console.log('[Buggy Translate] Using window.getSelection');
            L.debug("window.getSelection")
            var selText = winClick.getSelection().toString();
           // console.log('[Buggy Translate] Selected text from getSelection:', selText);
            return selText;
        } else {
           // console.log('[Buggy Translate] Using document.selection (IE fallback)');
            L.debug("document.selection")
            var text = winClick.document.selection.createRange().text;
           // console.log('[Buggy Translate] Selected text from document.selection:', text);
            return text;
        }
    }

    // 遍历取 iframe 中的选中内容
    // _.tryIframeText = function(wnd){
    //     var result = wnd.getSelection();
    //     for (var i = 0; !result && i < wnd.frames.length; i++){
    //         L.debug("try time is:", i);
    //         result = _.tryIframeText(wnd.frames[i]);
    //     }
    //     return result;
    // }

    // 查询单词（Chrome版本使用fetch API）
    _.searchWord = function(text, isPop){
       // console.log('[Buggy Translate] searchWord called with text:', text, 'isPop:', isPop);
       // console.log('[Buggy Translate] Current API setting:', G.api);
        L.debug("search text:" + text);
        
        View.showMsg("正在查词:" + text + "...");
        
        var api = API[G.api];
       // console.log('[Buggy Translate] Using API config:', api);
        var url = new URL(api.url);
        
        // 构建查询参数
        var params = Object.assign({}, api.data);
        params.q = text;
        
        Object.keys(params).forEach(key => {
            url.searchParams.append(key, params[key]);
        });
        
        // 通过background script发送请求以避免CORS问题
       // console.log('[Buggy Translate] Sending translate request to background script:', url.toString());
        chrome.runtime.sendMessage({
            type: 'translate_request',
            data: {
                url: url.toString(),
                text: text,
                api: G.api
            }
        }, (response) => {
           // console.log('[Buggy Translate] Received response from background:', response);
            if (response && response.success && response.html) {
               // console.log('[Buggy Translate] HTML response received, length:', response.html.length);
                var word = parseWord(response.html);
               // console.log('[Buggy Translate] Parsed word result:', word);
                L.debug("word is:", word);
                View.showWord(word, isPop);
            } else {
                console.error('[Buggy Translate] Translation request failed:', response);
                var errorMsg = response && response.error ? response.error : '翻译请求失败';
                View.showMsg("查词失败: " + errorMsg);
            }
        });
    }
    function parseWord(html){
        if(G.api == "youdao"){
            return parseYoudaoWord(html);
        }else{
            return parseBingWord(html);
        }
    }
    
    // 解析 Bing 返回的单词页面
    function parseBingWord(htmlStr){
        var html = $(htmlStr);
        var container = html.find(".qdef");
        // 单词
        var headword = container.find("#headword h1");
        var text = St.trim(headword.text());
        // 发音
        var pronounces = [];
        
        // 解析音标和音频的函数
        var parseBingPron = function(pronounces, usPronEle){
            var audioReg = /(https.*mp3)/;
            if(usPronEle.length > 0 && usPronEle.text().indexOf("[") > 0){
                var usText = usPronEle.text();
                var usName = usText.substring(0,usText.indexOf("["));
                var usPron = usText.substring(usText.indexOf("["));
                var pronounce = {"name":usName, "text":usPron};
                var usAudio = usPronEle.next(".hd_tf");
                if(usAudio.length > 0){
                    var clickAttr = usAudio.find("a").attr("onclick");
                    if(audioReg.test(clickAttr)){
                        L.debug(clickAttr.match(audioReg));
                        pronounce.audio = clickAttr.match(audioReg)[0];
                    }
                }
                pronounces[pronounces.length] = pronounce;
            }
        }
        
        // 美音
        parseBingPron(pronounces, container.find(".hd_prUS"));
        // 英音
        parseBingPron(pronounces, container.find(".hd_pr"));
        // 解释
        var translate = [];
        var transText = container.find("ul>li");
        for(var i=0;i<transText.length;i++){
            translate[translate.length] = St.trim($(transText[i]).text());
        }
        
        // word 数据结构
        var word = {"text":text, "pronounces":pronounces, "translate":translate};
        return word;
    }

    // 从有道单词页面解析出单词数据
    function parseYoudaoWord(htmlStr){
        var html = $(htmlStr);
        // 单词
        var keyword = html.find(".keyword");
        var text = St.trim(keyword.text());
        // 发音
        var pronounces = [];
        var pronName = html.find(".pronounce");
        var pronText = html.find(".phonetic")
        for(var i=0; i< pronName.length;i++){
            $(pronText).remove();
            var pronNameValue = $(pronName[i]).text()
            var pron = {"name":St.trim(pronNameValue), "text":St.trim($(pronText[i]).text())};
            
            var pronAudioPre = "https://dict.youdao.com/dictvoice?type=";
            if("英" == pron["name"]){
                pron.audio = pronAudioPre + "1" + "&audio=" + text;
            }else{
                pron.audio = pronAudioPre + "2" + "&audio=" + text;
            }
            pronounces[pronounces.length] = pron;
        }
        // 解释
        var translate = [];
        var transText = keyword.parent().siblings(".trans-container").find("ul>li");
        for(var i = 0; i < transText.length; i++){
            translate[translate.length] = St.trim($(transText[i]).text());
        }

        // word 数据结构
        var word = {"text":text, "pronounces":pronounces, "translate":translate};
        return word;
    }

    // 设置选项（Chrome版本）
    _.setOptions = function(options) {
       // console.log('[Buggy Translate] Dictionary.setOptions called with:', options);
        if (options != null) {
            for (var key in options) {
                G[key] = options[key];
            }
           // console.log('[Buggy Translate] Dictionary options updated:', G);
            L.debug("Dictionary options set:", G);
        } else {
           // console.log('[Buggy Translate] No options provided to setOptions');
        }
    }
    
    // 加载配置（Chrome版本）
    function loadOptions() {
        L.debug("dict loadOptions");
        // Chrome版本通过消息传递获取选项，在init.js中处理
    }
    
    _.init = function() {
       // console.log('[Buggy Translate] Dictionary.init called');
        // Chrome版本的初始化
        // 选项加载在init.js中通过消息传递处理
       // console.log('[Buggy Translate] Dictionary initialization completed');
        L.debug("Dictionary initialized for Chrome");
    }



    // Export the Underscore object for **Node.js**, with
    // backwards-compatibility for the old `require()` API. If we're in
    // the browser, add `_` as a global object via a string identifier,
    // for Closure Compiler "advanced" mode.
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = _;
        }
        exports.Dictionary = _;
    } else {
        root.Dictionary = _;
    }
}).call(this);
