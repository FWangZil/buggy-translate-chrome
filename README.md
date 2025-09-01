<p align="right">Language: <a href="#zh">中文</a> | <a href="#en">English</a></p>

<a id="zh"></a>

# Buggy Translate（Chrome 版）

一个轻量、好用的网页划词翻译扩展。你只需在任意网页上用鼠标选中单词或短句，页面右上角或选区附近即可弹出翻译浮窗，支持主题切换与发音。

## 关于本项目

本项目为从 Firefox 版本 fork 并迁移至 Chrome Manifest V3 的版本，原始仓库：https://github.com/qinglangee/buggy-translate
同时致敬并感谢原作者的工作与开源精神。

> 注：本仓库保留了与 Firefox 版一致的核心体验，并针对 Chrome 生态进行了适配与优化（如使用 Service Worker、runtime 消息、storage 同步等）。

## 功能介绍

- 实时划词翻译：在网页上选中英文单词或句子，自动显示翻译结果浮窗
- 浮窗定位灵活：可在页面右上角或鼠标选区附近显示
- 主题切换：内置深色/浅色主题，适配不同阅读环境
- 发音支持：支持英文单词发音播放
- 个性化设置：是否自动播放发音、浮窗自动关闭时长、仅查单词模式等
- 多词典来源：目前支持有道词典与必应词典（可在设置中切换）

## 安装与使用（开发者模式）

1. 打开 Chrome，访问 `chrome://extensions/`
2. 开启右上角「开发者模式」
3. 点击「加载已解压的扩展程序」
4. 选择本项目文件夹完成安装
5. 在任意网页上选中单词/句子即可弹出翻译浮窗

可在扩展的「选项」页面中，自定义主题、位置、词典、发音等偏好设置。

## 贡献与反馈

欢迎提交 Issue 或 PR 来一起完善体验。如果你遇到问题：
- 请在控制台或扩展 Service Worker 日志中查看报错信息
- 附上可复现页面、复现步骤与截图，有助于快速定位问题

## 许可与致谢

- 许可：遵循与上游一致的开源许可，见仓库根目录 LICENSE
- 感谢与致谢：
  - 上游 Firefox 版本与原作者的贡献（见上文链接）
  - jQuery
  - Chrome Extensions 平台与相关文档
  - 有道词典与必应词典

## Buy me a coffee

如果这个项目对你有帮助，欢迎打赏支持：

- Buy Me A Coffee（替换为你的页面链接）：https://buymeacoffee.com/acewzk3

非常感谢你的支持，这将帮助我持续维护与改进本项目！

<p align="right"><a href="#en">Switch to English</a> ▲</p>

---

<a id="en"></a>

# Buggy Translate (Chrome)

A lightweight and handy on-page translation extension. Select a word or a short sentence on any webpage and a floating popup will show the translation near your selection or at the top-right corner. Theme switching and pronunciation are supported.

## About this project

This repository is a Chrome Manifest V3 port forked from the original Firefox version: https://github.com/qinglangee/buggy-translate
Huge thanks to the original author and the open-source community.

> Note: The core experience is kept consistent with the Firefox edition while adapted and optimized for the Chrome ecosystem (Service Worker, runtime messaging, storage sync, etc.).

## Features

- Instant selection translation: translate selected words or sentences in-place
- Flexible popup position: near the selection or at the top-right corner
- Theme switching: built-in dark and light themes
- Pronunciation: English word audio playback
- Customization: auto-play audio, auto-dismiss timeout, word-only mode, etc.
- Multiple dictionaries: Youdao and Bing (switchable in Options)

## Install & Use (Developer Mode)

1. Open Chrome and go to `chrome://extensions/`
2. Turn on "Developer mode" (top right)
3. Click "Load unpacked"
4. Select this project folder to install
5. Select a word/sentence on any page to see the translation popup

Open the extension "Options" page to customize theme, position, dictionaries, pronunciation preferences, and more.

## Contributing & Feedback

Issues and PRs are welcome. If you encounter a problem:
- Check the console or the extension Service Worker logs for errors
- Provide a reproducible page, steps, and screenshots to help diagnose

## License & Credits

- License: same as upstream (see LICENSE at repo root)
- Credits:
  - Upstream Firefox version and original author (see the link above)
  - jQuery
  - Chrome Extensions platform and docs
  - Youdao Dictionary and Bing services

## Buy me a coffee

If this project helps you, consider supporting it:

- Buy Me A Coffee (replace with your page): https://buymeacoffee.com/acewzk3

Thanks a lot! Your support keeps this project maintained and improved.

<p align="right"><a href="#zh">切换到中文</a> ▲</p>
