---
title: "Windows Terminal 与 Oh My Posh 配置记录"
description: "一次 Windows 终端配置记录：先厘清 Terminal 与 Shell 的区别，再用 Windows Terminal + PowerShell + Oh My Posh 完成字体、主题与外观配置，并附上可直接复用的配置片段。"
pubDate: "2024-03-07"
heroImage: "/title/win-terminal.png"
badge: "Featured"
tags: [ "美化","终端","Windows Terminal","oh my posh" ]
---

## 一、背景与几个概念

在 macOS 上，iTerm2 配合 Oh My Zsh 的终端体验已经比较完整；切换到 Windows 后，默认终端在字体、提示符和配色上相对朴素。网上关于 Windows 终端美化的资料比较分散，这里把自己完整配置一次的过程整理下来，供有同样需求的读者参考。

动手之前，建议先厘清几个容易被混用的概念。如果只是照着步骤执行而不清楚每一步的作用，配置过程中遇到问题时往往无从排查。

**终端（Terminal）**：早期指物理设备，例如电传打字机或字符显示器，用于与计算机交互。用户通过终端输入命令，计算机执行后把结果返回给终端显示。

**Shell**：命令行解释器程序，负责接收用户输入的命令并交给操作系统执行。最早的 Shell 是 Steve Bourne 开发的 Bourne Shell（sh），后来成为 UNIX 系统的标准 Shell。

**小结一下：终端最初是一个物理设备，Shell 则是一个程序，负责接收命令并转交操作系统执行。**

> 随着发展，两者的边界逐渐模糊，日常交流中常常被混用。例如 Windows Terminal、iTerm2、Hyper 都属于终端，但它们各自可以使用不同的 Shell：Windows Terminal 默认使用 PowerShell，iTerm2、Hyper 等通常配合 Zsh 或 Bash 使用。本文中出现的 Windows Terminal 是终端，PowerShell 则是它的 Shell。

## 二、安装 Windows Terminal

理解以上概念之后就可以开始了。终端本身是可替换的，你也可以选择 Hyper 等其他终端工具，本文以 Windows Terminal 为例。

![](./../../../public/images/113736320537300.png)

安装完成后打开 Windows Terminal，默认 Shell 是 Windows 自带的 PowerShell，功能已经比较完善。

![](./../../../public/images/113886636855000.png)

在设置的「启动」页面可以看到，Windows Terminal 支持接入多个 Shell，也可以在这里添加或调整默认 Shell。

![](./../../../public/images/113991292616000.png)

## 三、安装 PowerShell（可选）

Windows 一般已自带 PowerShell，如果希望使用更新的版本，可以安装 PowerShell 7，安装方式见[官方文档](https://learn.microsoft.com/zh-cn/powershell/scripting/install/installing-powershell-on-windows?view=powershell-7.4#installing-the-zip-package)。

![](./../../../public/images/114349223000700.png)

## 四、安装与初始化 Oh My Posh

### 1. Oh My Posh 是什么

用过 macOS 的读者可能熟悉 Oh My Zsh——从名字就能看出，它是 Zsh 的配置工具，主要用于美化提示符。Oh My Posh 的定位与之类似，作用于 PowerShell。

> 按官网说明，Oh My Posh 并不绑定 PowerShell，它支持任意 Shell，因此同样可以用于 Bash、Zsh 等。笔者也把它安装在了 WSL 的 Ubuntu Bash 上。
> ![](./../../../public/images/114911248223000.png)

### 2. 安装

进入 [Oh My Posh 官网](https://ohmyposh.dev/)，依次打开 Get started → Installation → Windows，可以看到官网提供了四种安装方式。

![](./../../../public/images/115098948997200.png)
![](./../../../public/images/115223037734500.png)

这里选择 manual 方式，把命令复制到 PowerShell 中执行：

```shell
Set-ExecutionPolicy Bypass -Scope Process -Force; Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://ohmyposh.dev/install.ps1'))
```

![](./../../../public/images/115407251733600.png)
![](./../../../public/images/115506770591200.png)

### 3. 初始化配置

安装完成后提示符不会立刻发生变化，还需要为 Oh My Posh 添加初始化配置。

重启 PowerShell，打开官网的 prompt 页面：

![](./../../../public/images/116169255815200.png)

页面中的 `notepad $PROFILE` 表示用记事本打开 `$PROFILE` 这个配置文件，它是 PowerShell 的配置文件，Oh My Posh 的主题等设置都写在这里。为了编辑方便，这里改用 VS Code 打开：

```shell
code $PROFILE
```

如果此前没有配置过 PowerShell，该文件可能并不存在，此时编辑器会新建一个，编辑完直接保存即可。

![](./../../../public/images/116735109284600.png)

在配置文件中写入以下内容并保存：

```shell
oh-my-posh init pwsh | Invoke-Expression
```

重启 PowerShell。如果出现脚本被禁止执行的报错：

![](./../../../public/images/116983808590000.png)

需要调整执行策略，以管理员身份运行 PowerShell 后执行：

```shell
set-executionpolicy remotesigned
```

> `Set-ExecutionPolicy RemoteSigned` 用于修改执行策略：本地脚本可以不受限制地运行，从网络下载的脚本则需要带有数字签名。如果只想对当前用户生效，可以改用 `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`，这样无需管理员权限。

重启 PowerShell，提示符应该已经发生变化：

![](./../../../public/images/117222813557800.png)

### 4. 安装 Nerd Font 字体

如果提示符显示为乱码或方框，通常是因为缺少字体：部分 Oh My Posh 主题依赖 Nerd Font 提供图标和特殊符号。官网推荐安装 MesloLGM Nerd Font，可到 [Nerd Fonts 官网](https://www.nerdfonts.com/)下载。

![](./../../../public/images/117499210814100.png)

解压后全选字体文件，右键安装：

![](./../../../public/images/117621862548800.png)

接着为 Windows Terminal 指定该字体：使用快捷键 `Ctrl + Shift + ,` 打开设置界面，搜索 `font`，在 **profiles → defaults** 中设置 `fontFace`（对应配置文件中的 `face` 字段）：

```json
{
  "font": {
    "face": "MesloLGM Nerd Font"
  }
}
```

![](./../../../public/images/118001588816300.png)

保存并重启 Windows Terminal，显示即可恢复正常。

![](./../../../public/images/118256079554600.png)

到此，基础配置已经完成。以下两项为可选配置，可按需调整。

## 五、更换主题

Oh My Posh 内置了较多主题，可以先预览再选择。在 PowerShell 中执行：

```shell
Get-PoshThemes
```

![](./../../../public/images/118498895538000.png)

输出末尾会给出主题文件的存放位置以及修改主题的方式：

![](./../../../public/images/118566261751600.png)

再次打开 `$PROFILE`，把所选主题的完整路径写入初始化命令。以 `gmay` 主题为例：

```shell
oh-my-posh init pwsh --config 'C:\Users\jeeun\AppData\Local\Programs\oh-my-posh\themes\gmay.omp.json' | Invoke-Expression
```

> 主题文件存放在当前用户目录下，路径中的用户名需要替换为你自己的，不能直接照抄上面的路径。如果希望配置在不同机器间通用，也可以使用 `$env:POSH_THEMES_PATH` 环境变量拼接主题路径。

重启 Windows Terminal 即可看到主题变化：

![](./../../../public/images/119075552385100.png)

## 六、Windows Terminal 其他外观配置

除字体之外，Windows Terminal 本身也支持配色方案、背景、透明度等设置，这些同样写在它的配置文件中。配置结构上，`profiles` 下分为两部分：`defaults` 是全局默认值，对所有终端生效；`list` 则用于逐个终端单独配置。

完整字段可参考[官方文档](https://docs.microsoft.com/zh-cn/windows/terminal/)。下面这份 `defaults` 配置仅供参考：

```json
{
  "antialiasingMode": "cleartype",   // 抗锯齿模式
  "colorScheme": "Tango Dark",       // 配色方案
  "cursorShape": "filledBox",        // 光标形状
  "font": {
    "face": "MesloLGM Nerd Font",
    "size": 8.0
  },
  "opacity": 65,                     // 透明度
  "useAcrylic": true                 // 亚克力（毛玻璃）效果
}
```

最终效果：

![](./../../../public/images/119841556830700.png)

## 七、小结

Windows Terminal 还支持更多自定义项，例如配色方案、背景图与命令面板等，也可以到 GitHub 上找现成的配置片段替换到自己的 `settings.json` 中，按需组合即可。本文的配置均为个人使用场景下的选择，具体主题、字体与透明度还是以自己的观感为准。
