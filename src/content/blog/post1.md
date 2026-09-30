---
title: "📝 Alfred 进阶笔记：通过 Keyword 触发并获取选中文本（零剪贴板污染）"
description: "在 Alfred 工作流中，使用 Keyword（关键词）触发 Run Script，并在脚本中获取当前系统（其他软件）中选中的文本。"
pubDate: "Sep 10 2026"
heroImage: "/alfred-selection-hero.jpg"
tags: ["Alfred", "macOS", "AppleScript"]
---

## 一、背景与痛点

**需求**：在 Alfred 工作流中，使用 Keyword（关键词）触发 Run Script，并在脚本中获取当前系统（其他软件）中选中的文本。

**难点**：

1. Keyword 节点先天没有 "Selection in macOS" 选项（只有 Argument Required / Optional / No Argument）。
2. 使用 `$1` 获取到的永远是用户在 Alfred 搜索框里输入的内容，而非系统选中文本。
3. 传统的「模拟 Cmd+C + pbpaste」方案会污染剪贴板历史，且需要等待，体验不佳。

## 二、核心原理

- **焦点交还机制**：当你输入 Keyword 并按下回车后，Alfred 窗口会立刻隐藏，macOS 会将焦点短暂交还给原应用，然后才在后台执行 Run Script。利用这个毫秒级的窗口期，脚本可以向原应用发起读取请求。
- **辅助功能 API（Accessibility API）**：利用 AppleScript 调用 macOS 的 System Events，直接读取当前聚焦 UI 元素的 `AXSelectedText` 属性。
- **优势**：全程不碰剪贴板（无 Cmd+C，无 pbpaste），因此不会污染剪贴板历史，也没有恢复剪贴板的繁琐逻辑。

## 三、一次性配置：封装公共脚本

为了避免在每个 Run Script 节点里重复复制长篇代码，建议将其封装为独立文件。

### 1. 创建脚本文件

打开终端，执行：

```bash
mkdir -p ~/bin
nano ~/bin/get_selection.sh
```

### 2. 粘贴以下代码并保存

```zsh
#!/bin/zsh
osascript <<'APPLESCRIPT'
tell application "System Events"
	set frontApp to first application process whose frontmost is true
	try
		-- 获取当前聚焦的 UI 元素
		set focusedElement to value of attribute "AXFocusedUIElement" of frontApp
		-- 读取该元素的 AXSelectedText 属性
		return value of attribute "AXSelectedText" of focusedElement
	on error
		return ""
	end try
end tell
APPLESCRIPT
```

按 `Ctrl + O` 保存，回车确认，`Ctrl + X` 退出。

### 3. 赋予执行权限

```bash
chmod +x ~/bin/get_selection.sh
```

## 四、日常使用：在 Alfred 工作流中极简调用

以后在 Alfred 工作流的 Run Script（Language 选择 `/bin/zsh`）中，只需要写这几行：

```zsh
#!/bin/zsh

# 1. 调用封装脚本获取选中文本
SELECTED_TEXT=$(~/bin/get_selection.sh)

# 2. 异常处理（可选，用于调试）
if [[ -z "$SELECTED_TEXT" ]]; then
	osascript -e 'display notification "未能获取到选中文本" with title "Alfred 提示"'
	exit 1
fi

# 3. 在这里编写你的后续业务逻辑
# 例如：将选中的文本转为大写
UPPER_TEXT=$(echo "$SELECTED_TEXT" | tr '[:lower:]' '[:upper:]')
echo "处理后的结果：$UPPER_TEXT"

# 4. 将结果传递给 Alfred 的下一个节点
echo "$UPPER_TEXT"
```

## 五、必知的局限性与注意事项

虽然这个方法非常优雅，但它并非万能，存在以下限制：

### 1. 必须开启辅助功能权限

前往 macOS 系统设置 → 隐私与安全性 → 辅助功能，确保 Alfred 已被勾选。

### 2. 应用兼容性差异（最常见的问题）

| 支持情况 | 应用 | 说明 |
| --- | --- | --- |
| ✅ 完美支持 | 备忘录、Safari、Chrome、Edge、TextEdit | 大部分原生应用都可正常读取 |
| ❌ 不支持（返回空） | 终端（Terminal / iTerm2）、部分 Electron 应用（如旧版 VS Code、Discord）、Adobe 系列、部分 Java 应用 | 这些应用没有向系统暴露 `AXSelectedText` 属性 |

### 3. 焦点切换延迟

在极少数情况下（如电脑卡顿、应用启动缓慢），Alfred 脚本已经执行，但焦点尚未完全交还给原应用，会导致获取失败。如果遇到，可以考虑在脚本开头加 `sleep 0.05` 缓冲一下。

### 4. 备选兜底方案

如果在某些必须支持的 App 中 API 失效，可在 `get_selection.sh` 中加入「模拟 Cmd+C + 备份恢复剪贴板」的兜底逻辑。

> ⚠️ 注意：此操作仍会覆盖剪贴板，且无法备份图片/文件。

## 六、为什么 Alfred 官方不提供 Keyword 直接传参？

- **逻辑歧义**：Keyword 的本质是接收用户输入，同时支持「选中文本」会造成传参优先级混乱。
- **稳定性优先**：Keyword 回车后的焦点交还时间不可控，官方为了保证体验，只将 "Selection in macOS" 绑定给焦点绝对不变的 Hotkey 和 Universal Action。
- **结论**：通过公共脚本调用 API 是一种「高级 Hacker 玩法」，在特定场景（原生 App、浏览器）下极其强大且零污染。
