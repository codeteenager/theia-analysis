## 概述
自从接触IDE这方面的技术以来，一直关注其他厂商是如何做IDE的，刚开始了解IDE是从微信、百度、支付宝等这些开发者工具知道这些开发者工具是基于electron或NW.js去构建的，但是从头开始写成本比较高。后来也看了一些其他的IDE，像 [Weex Studio](http://emas.weex.io/zh/tools/ide.html)、[白鹭Egret Wing](https://www.egret.com/products/wing.html)、[快应用IDE](https://www.quickapp.cn/docCenter/IDEPublicity)、[APICloud Studio](https://docs.apicloud.com/apicloud3/index.html#/overview/devtools)这类的是基于VSCode源码定制的，技术相对成熟，大部分功能现成的，工作量相对较少，于是就基于VSCode去定制了第一版的开发工具，详情可以看之前写的[VSCode技术揭秘](https://www.jiangshuaijie.cn/archives/34)。直到后面了解到Theia这个框架，发现样式和功能与VSCode差不多，而且也部分支持VSCode的插件，最主要是能够通过扩展的形式去丰富IDE的视图功能，与VSCode修改UI源码相比，Theia的方式更加好用，只不过前提是要对Theia的源码有所了解才可以去定制，所以当时就把Theia作为IDE的主要研究方向。

## 总体架构
Theia被设计成一个桌面应用程序，也可以在浏览器和远程服务器的环境中工作。为了支持这两种情况，Theia在两个单独的进程中运行。这些进程分别称为前端和后端，它们通过WebSocket上的JSON-RPC消息或HTTP上的REST API进行通信。对于Electron，后端和前端都在本地运行，而在远程上下文中，后端将在远程主机上运行。前端和后端进程都有它们的依赖注入（DI）容器方便扩展功能。

## 扩展
Theia是以一种非常模块化和可扩展的方式设计的。它支持以下三种扩展方式，相比VSCode只支持插件扩展而言，可定制化的成都更高。

* VSCode扩展：易于编写，可在运行时安装。Theia提供了与VSCode相同的扩展API，因此扩展是兼容的。因此，要开发自己的扩展，请参考[VSCode扩展文档](https://code.visualstudio.com/api)。也可以使用Theia中现有的VSCode扩展，可以从[Open VSX registry](https://open-vsx.org/)安装或下载扩展。
* Theia扩展：Theia扩展是在Theia应用程序内并直接与其他模块通信的模块（Theia扩展）。Theia项目本身也由Theia扩展组成。要创建Theia应用程序，您可以选择Theia项目提供的大量Theia扩展（核心扩展），添加自己的自定义Theia扩展，然后编译并运行结果。您的自定义Theia扩展将可以访问与核心扩展相同的API。这种模块化允许您根据自己的需求扩展、调整或删除Theia中的几乎任何内容。此外，与VSCode扩展相比，使用Theia扩展开发特定用例（如复杂视图）更容易。从技术上讲，扩展是一个npm包，它公开了有助于创建DI容器的任意数量的DI模块（ContainerModule）。扩展通过在package.json中声明依赖项来使用，并在编译时安装。
* Theia插件：Theia插件是一种特殊类型的VSCode扩展，只在Theia中运行。它们共享VSCode扩展的体系结构和其他属性，但它们也可以访问仅在Theia中可用的附加API，而不在VSCode中可用。最值得注意的是，Theia插件也可以直接用于前端，而VS代码扩展仅限于后端。因此，Theia插件可以直接操作UI，而无需经过webview抽象，从而简化了开发过程。

下图显示了所有三个选项的高级体系结构。VSCode扩展和Theia插件运行在一个专用进程中，可以在运行时安装，并针对定义的API工作。Theia扩展在编译时添加，并成为Theia应用程序的核心部分。他们可以访问Theia的完整API。

![在这里插入图片描述](/introduction/1.png)


## VSCode与Theia区别
* 维护：VSCode是MIT 协议，基本上属于微软公司。Theia是EPL 协议，由 Eclipse Theia 基金委员会主导，可用于商业用途。
* 插件市场：VSCode有自己独立的插件市场，插件丰富，但只能安装到 VS Code 中。Theia仅支持从 openVSX 插件市场中下载，实际上是支持 VS Code 插件，但由于 VS Code 插件市场的限制，无法完全使用 VS Code 插件，只能由插件开发者将插件托管到 openVSX 上才行，所以插件数量小于 VS Code。
* 插件开发：VS Code 提供扩展注册命令、菜单、视图、语言服务器等相关功能，目前只能通过 VS Code 提供的 API 进行扩展，无法更换 logo，移除默认菜单、命令，创建复杂视图等功能。而Theia 其实提供了两种插件机制，一种是类似于 VS Code 的插件开发机制， Plugin，它依赖于 Theia 提供的 API 进行插件开发，用户可在 IDE 运行时进行插件的安装、卸载。另外一种是 extension，这是直接构建在了我们工具当中，用户无法进行修改，它可以访问 Theia 内部的所有方法，我们可以对 Theia 所有的功能进行个性化开发。这种插件开发的缺点是，对开发人员要求相对而言比较高，需要了解 Theia 的内部机制，现有文档基本上也无法满足高定制化的开发需求。
## 环境搭建
刚开始研究Theia的时候版本是1.11.0，那时候相对环境问题比较多，windows兼容性也有，文档不全面等各种问题，不过现在文档相对全面一点，环境问题可以看这篇文章[Windows下运行Eclipse Theia源码指南](https://my.oschina.net/u/1773694/blog/3220784)相对详细一些。

接下来我们研究Theia那肯定先把官方项目运行起来，我们可以学习一下官方文档[Eclipse Theia文档](https://theia-ide.org/)，如果文档访问不了可以查看文档的github源码 [https://github.com/eclipse-theia/theia-website](https://github.com/eclipse-theia/theia-website)。当然我们也可以查看[快速入门](https://github.com/eclipse-theia/theia/blob/master/doc/Developing.md#prerequisites)，注意这里面的基础环境：

* Node.js >= 14.18.0，推荐使用 Node 的 LTS：目前是 16.x
* Yarn package manager >= 1.7.0 AND < 2.x.x
* git (If you would like to use the Git-extension too, you will need to have git version 2.11.0 or higher.)
* python3，因为需要node-gyp@8.4.1

然后就拉取代码，安装依赖，在这里如果安装依赖很慢甚至报错，基本上是网络问题，可以翻墙去下载，也可以在项目根目录下添加.npmrc配置帮助快速安装。
```js
chromedriver_cdnurl=https://npm.taobao.org/mirrors/chromedriver
phantomjs_cdnurl=http://npm.taobao.org/mirrors/phantomjs
operadriver_cdnurl=http://npm.taobao.org/mirrors/operadriver
ELECTRON_MIRROR=http://npm.taobao.org/mirrors/electron/ 
puppeteer_skip_chromium_download = 1
```
这里介绍一下windows环境的配置。

python3版本为Python 3.6 或更高版本

Visual Studio[构建工具](https://visualstudio.microsoft.com/zh-hans/downloads/)17，构建工具可以参考[Windows下运行Eclipse Theia源码指南](https://my.oschina.net/u/1773694/blog/3220784)这篇文章。

如果安装了多个版本的python或Visual Studio，可以通过 npm config 调整使用的版本。
```js
npm config set python /path/to/executable/python --global
npm config set msvs_version 2017 --global
```
安装windows-build-tools，以前，windows-build-tools在 Windows 上构建 Native Nodes 模块是必需的。npm 包现在是deprecated因为 NodeJS 安装程序现在可以安装它需要的所有必需工具，包括 Windows 构建工具。

我们使用管理员身份打开PowserShell，然后运行命令安装
```js
npm --add-python-to-path install --global --production windows-build-tools
```
这样我们的环境配置完成。

## 构建自己的IDE工具
Theia官方文档提供了两种构建基于Theia的产品方式：

* Theia Extension Yeoman 生成器：生成基于 Theia 的产品以及示例扩展
* Theia Blueprint：用于创建基于 Theia 的可安装桌面应用程序的模板工具
这两种方式会生成配置好的Theia工程，不需要自己去重新搭建。

当然官方文档介绍了从零配置Theia工程的步骤。首先创建一个工程目录
```js
$ mkdir theia-demo
$ cd theia-demo
```
然后在工程根目录创建package.json
```js
{
    "private": true,
    "dependencies": {
      "@theia/callhierarchy": "next",
      "@theia/file-search": "next",
      "@theia/git": "next",
      "@theia/markers": "next",
      "@theia/messages": "next",
      "@theia/navigator": "next",
      "@theia/outline-view": "next",
      "@theia/plugin-ext-vscode": "next",
      "@theia/preferences": "next",
      "@theia/preview": "next",
      "@theia/search-in-workspace": "next",
      "@theia/terminal": "next",
      "@theia/vsx-registry": "next"
    },
    "devDependencies": {
      "@theia/cli": "next"
    },
    "scripts": {
      "prepare": "yarn run clean && yarn build && yarn run download:plugins",
      "clean": "theia clean",
      "build": "theia build --mode development",
      "start": "theia start --plugins=local-dir:plugins",
      "download:plugins": "theia download:plugins"
    },
    "theiaPluginsDir": "plugins",
    "theiaPlugins": {
      "vscode-builtin-extensions-pack": "https://open-vsx.org/api/eclipse-theia/builtin-extension-pack/1.50.1/file/eclipse-theia.builtin-extension-pack-1.50.1.vsix"
    },
    "theiaPluginsExcludeIds": [
      "vscode.extension-editing",
      "vscode.git",
      "vscode.git-ui",
      "vscode.github",
      "vscode.markdown-language-features",
      "vscode.microsoft-authentication"
    ]
  }
  ```
其中可以看到Theia核心依赖都是一个一个的扩展包，[@theia/cli](https://www.npmjs.com/package/@theia/cli)列为构建时依赖项。它提供脚本来构建和运行应用程序。其中还有一些其他配置项。

* theiaPluginsDir：部署插件的相对路径
* theiaPlugins：要下载的插件集合（单个插件或扩展包） – 可以指向任何有效的下载 URL（例如：Open VSX、Github Releases 等）
* theiaPluginsExcludeIds：解析扩展包时要排除的插件列表

然后安装依赖包
```js
yarn
```
然后，使用Theia CLI 构建应用程序
```js
yarn theia build
```
yarn在我们的应用程序的上下文中查找由theia提供的可执行文件@theia/cli，然后build使用theia. 这可能需要一段时间，因为默认情况下应用程序是在生产模式下构建的，即经过混淆和缩小。当然我们也可以使用yarn build调用scripts脚本。

构建完成后，我们调用命令来启动。
```js
yarn theia start --plugins=local-dir:plugins
```
也可以调用yarn start来执行scripts脚本。
![在这里插入图片描述](/introduction/2.jpeg)


启动后默认运行在3000端口上，然后打开浏览器可以看到运行起来的Theia IDE。
![在这里插入图片描述]((/introduction/3.jpeg)


我们也可以启动的时候指定特定网络和端口。
```js
yarn start --hostname 0.0.0.0 --port 8080
```
以上是我们简单启动一个Theia的工程，作为一个WEB IDE在浏览器中访问，后续我们会介绍如果开发一个桌面客户端版的IDE。

## 相关源码
* [openvsx](https://github.com/eclipse/openvsx)
* [theia-apps](https://github.com/theia-ide/theia-apps)
* [theia](https://github.com/eclipse-theia/theia)
## 参考源码
由于文档内容比较欠缺，可以参考其他定制Theia的代码。

* [che-theia](https://github.com/eclipse-che/che-theia)
* [Mbed Studio](https://os.mbed.com/studio/)
* [Arduino IDE](https://www.arduino.cc/en/software)
## 参考文章
* [KAITIAN IDE 是如何构建扩展能力极强的插件体系的？](https://developer.aliyun.com/article/747644)
* [为未来研发模式而生，KAITIAN IDE 在业务中的探索](https://developer.aliyun.com/article/762768)
* [前端工程下一站 IDE](https://tool.lu/deck/j9/detail?slide=49)
* [基于 KAITIAN 的前端工程研发模式变革](https://my.oschina.net/u/4662964/blog/4871341)
* [跑在浏览器上的小程序 IDE](http://www.360doc.com/content/20/0506/03/36367108_910463884.shtml)
* [基于 React 打造高自由度的 IDE 布局系统](https://blog.csdn.net/weixin_40906515/article/details/107527421)
* [Tide 研发平台 · 布局研发新基建](https://mp.weixin.qq.com/s/7lMyU5l4EzzRYK4l6bVYmA)
* [如何在团队内快速落地WebIDE](https://juejin.cn/post/7008428269317914661)
* [我们开源了一个轻量的 Web IDE UI 框架](https://segmentfault.com/a/1190000041128062)
* [阿里 & 蚂蚁自研 IDE 研发框架 OpenSumi 正式开源](https://developer.aliyun.com/article/873828?utm_content=g_1000328446)
* [云端IDE基础框架介绍—ECLIPSE THEIA——兆松科技](https://www.terapines.com/post/813/)
## 其他IDE产品
* [Molecule](https://dtstack.github.io/molecule/)
* [KAITIAN](https://github.com/opensumi/core)