# Buggy Translate Chrome Extension

这是一个适用于Chrome浏览器的翻译扩展，可以在网页上选中单词或句子时显示翻译结果的浮窗。

## 功能特性

- 🔍 **实时翻译**: 选中网页上的单词或句子即可显示翻译
- 🎯 **智能定位**: 翻译浮窗可显示在右上角或鼠标附近
- 🎨 **主题切换**: 支持黑色和白色两种主题
- 🔊 **语音播放**: 支持英文单词发音
- ⚙️ **个性化设置**: 丰富的自定义选项
- 🌐 **多词典支持**: 支持有道词典和必应词典

## 安装方法

### 开发者模式安装

1. 打开Chrome浏览器
2. 访问 `chrome://extensions/`
3. 开启右上角的「开发者模式」
4. 点击「加载已解压的扩展程序」
5. 选择本项目文件夹
6. 扩展安装完成

### 使用方法

1. **基本翻译**: 在任意网页上用鼠标选中英文单词或句子
2. **浮窗显示**: 翻译结果会自动在浮窗中显示
3. **快速查词**: 点击扩展图标打开快速查词窗口
4. **设置选项**: 右键扩展图标选择「选项」进行个性化设置

## 设置选项

- **翻译API**: 选择有道词典或必应词典
- **显示位置**: 浮窗显示在右上角或单词旁边
- **点击关闭**: 设置点击空白区域是否关闭浮窗
- **主题样式**: 选择黑色或白色主题
- **语音播放**: 设置是否自动播放发音
- **显示时间**: 设置浮窗自动消失时间
- **查词模式**: 设置是否只查询单个单词

## 技术特性

- ✅ **Manifest V3**: 使用最新的Chrome扩展规范
- ✅ **Service Worker**: 现代化的后台脚本
- ✅ **Chrome Storage API**: 云端同步设置
- ✅ **Fetch API**: 现代化的网络请求
- ✅ **Content Scripts**: 页面内容脚本注入

## 文件结构

```
buggy-translate-chrome/
├── manifest.json          # 扩展清单文件 (Manifest V3)
├── src/
│   ├── background-script.js   # Service Worker后台脚本
│   ├── init.js               # 内容脚本初始化
│   ├── dictionary.js         # 翻译核心逻辑
│   ├── dict_view.js          # 浮窗显示逻辑
│   ├── dictionary.css        # 浮窗样式
│   ├── string_utils.js       # 字符串工具
│   └── zhchlog.js           # 日志工具
├── popup/
│   ├── quick_search.html     # 快速查词页面
│   ├── quick_search.js       # 快速查词逻辑
│   └── quick_search.css      # 快速查词样式
├── option/
│   ├── option.html           # 选项设置页面
│   └── option.js            # 选项设置逻辑
├── icons/                   # 扩展图标
├── imgs/                    # 图片资源
└── lib/                     # 第三方库
```

## 开发说明

### 从Firefox版本迁移的主要变更

1. **Manifest V3**: 更新为Chrome最新扩展规范
2. **Service Worker**: 替换传统background script
3. **Chrome APIs**: 使用chrome.storage、chrome.runtime等API
4. **Fetch API**: 替换jQuery的$.get方法
5. **权限分离**: host_permissions独立于permissions

### 调试方法

1. 打开Chrome开发者工具
2. 在Console中查看日志输出
3. 在Network中监控网络请求
4. 在Application > Storage中查看存储数据

## 许可证

本项目基于原Firefox版本改造，遵循相同的开源许可证。

## 致谢

- 原Firefox版本作者
- jQuery库
- 有道词典和必应词典API
- Chrome Extensions API文档

---

**注意**: 这是Chrome版本的Buggy Translate扩展，基于原Firefox版本重构而成，完全兼容Chrome浏览器的Manifest V3规范。