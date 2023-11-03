import{_ as s,o as a,c as n,Q as l}from"./chunks/framework.0847507f.js";const e="/theia-analysis/introduction/1.png",o="/theia-analysis/introduction/2.jpeg",p="/theia-analysis/introduction/3.jpeg",m=JSON.parse('{"title":"概述","description":"","frontmatter":{},"headers":[],"relativePath":"guide/introduction.md","filePath":"guide/introduction.md","lastUpdated":1683276962000}'),t={name:"guide/introduction.md"},r=l('<h1 id="概述" tabindex="-1">概述 <a class="header-anchor" href="#概述" aria-label="Permalink to &quot;概述&quot;">​</a></h1><p>自从接触IDE这方面的技术以来，一直关注其他厂商是如何做IDE的，刚开始了解IDE是从微信、百度、支付宝等这些开发者工具知道这些开发者工具是基于electron或NW.js去构建的，但是从头开始写成本比较高。后来也看了一些其他的IDE，像 <a href="http://emas.weex.io/zh/tools/ide.html" target="_blank" rel="noreferrer">Weex Studio</a>、<a href="https://www.egret.com/products/wing.html" target="_blank" rel="noreferrer">白鹭Egret Wing</a>、<a href="https://www.quickapp.cn/docCenter/IDEPublicity" target="_blank" rel="noreferrer">快应用IDE</a>、<a href="https://docs.apicloud.com/apicloud3/index.html#/overview/devtools" target="_blank" rel="noreferrer">APICloud Studio</a>这类的是基于VSCode源码定制的，技术相对成熟，大部分功能现成的，工作量相对较少，于是就基于VSCode去定制了第一版的开发工具，详情可以看之前写的<a href="https://www.jiangshuaijie.cn/archives/34" target="_blank" rel="noreferrer">VSCode技术揭秘</a>。直到后面了解到Theia这个框架，发现样式和功能与VSCode差不多，而且也部分支持VSCode的插件，最主要是能够通过扩展的形式去丰富IDE的视图功能，与VSCode修改UI源码相比，Theia的方式更加好用，只不过前提是要对Theia的源码有所了解才可以去定制，所以当时就把Theia作为IDE的主要研究方向。</p><h2 id="总体架构" tabindex="-1">总体架构 <a class="header-anchor" href="#总体架构" aria-label="Permalink to &quot;总体架构&quot;">​</a></h2><p>Theia被设计成一个桌面应用程序，也可以在浏览器和远程服务器的环境中工作。为了支持这两种情况，Theia在两个单独的进程中运行。这些进程分别称为前端和后端，它们通过WebSocket上的JSON-RPC消息或HTTP上的REST API进行通信。对于Electron，后端和前端都在本地运行，而在远程上下文中，后端将在远程主机上运行。前端和后端进程都有它们的依赖注入（DI）容器方便扩展功能。</p><h2 id="扩展" tabindex="-1">扩展 <a class="header-anchor" href="#扩展" aria-label="Permalink to &quot;扩展&quot;">​</a></h2><p>Theia是以一种非常模块化和可扩展的方式设计的。它支持以下三种扩展方式，相比VSCode只支持插件扩展而言，可定制化的成都更高。</p><ul><li>VSCode扩展：易于编写，可在运行时安装。Theia提供了与VSCode相同的扩展API，因此扩展是兼容的。因此，要开发自己的扩展，请参考<a href="https://code.visualstudio.com/api" target="_blank" rel="noreferrer">VSCode扩展文档</a>。也可以使用Theia中现有的VSCode扩展，可以从<a href="https://open-vsx.org/" target="_blank" rel="noreferrer">Open VSX registry</a>安装或下载扩展。</li><li>Theia扩展：Theia扩展是在Theia应用程序内并直接与其他模块通信的模块（Theia扩展）。Theia项目本身也由Theia扩展组成。要创建Theia应用程序，您可以选择Theia项目提供的大量Theia扩展（核心扩展），添加自己的自定义Theia扩展，然后编译并运行结果。您的自定义Theia扩展将可以访问与核心扩展相同的API。这种模块化允许您根据自己的需求扩展、调整或删除Theia中的几乎任何内容。此外，与VSCode扩展相比，使用Theia扩展开发特定用例（如复杂视图）更容易。从技术上讲，扩展是一个npm包，它公开了有助于创建DI容器的任意数量的DI模块（ContainerModule）。扩展通过在package.json中声明依赖项来使用，并在编译时安装。</li><li>Theia插件：Theia插件是一种特殊类型的VSCode扩展，只在Theia中运行。它们共享VSCode扩展的体系结构和其他属性，但它们也可以访问仅在Theia中可用的附加API，而不在VSCode中可用。最值得注意的是，Theia插件也可以直接用于前端，而VS代码扩展仅限于后端。因此，Theia插件可以直接操作UI，而无需经过webview抽象，从而简化了开发过程。</li></ul><p>下图显示了所有三个选项的高级体系结构。VSCode扩展和Theia插件运行在一个专用进程中，可以在运行时安装，并针对定义的API工作。Theia扩展在编译时添加，并成为Theia应用程序的核心部分。他们可以访问Theia的完整API。</p><p><img src="'+e+`" alt="在这里插入图片描述"></p><h2 id="vscode与theia区别" tabindex="-1">VSCode与Theia区别 <a class="header-anchor" href="#vscode与theia区别" aria-label="Permalink to &quot;VSCode与Theia区别&quot;">​</a></h2><ul><li>维护：VSCode是MIT 协议，基本上属于微软公司。Theia是EPL 协议，由 Eclipse Theia 基金委员会主导，可用于商业用途。</li><li>插件市场：VSCode有自己独立的插件市场，插件丰富，但只能安装到 VS Code 中。Theia仅支持从 openVSX 插件市场中下载，实际上是支持 VS Code 插件，但由于 VS Code 插件市场的限制，无法完全使用 VS Code 插件，只能由插件开发者将插件托管到 openVSX 上才行，所以插件数量小于 VS Code。</li><li>插件开发：VS Code 提供扩展注册命令、菜单、视图、语言服务器等相关功能，目前只能通过 VS Code 提供的 API 进行扩展，无法更换 logo，移除默认菜单、命令，创建复杂视图等功能。而Theia 其实提供了两种插件机制，一种是类似于 VS Code 的插件开发机制， Plugin，它依赖于 Theia 提供的 API 进行插件开发，用户可在 IDE 运行时进行插件的安装、卸载。另外一种是 extension，这是直接构建在了我们工具当中，用户无法进行修改，它可以访问 Theia 内部的所有方法，我们可以对 Theia 所有的功能进行个性化开发。这种插件开发的缺点是，对开发人员要求相对而言比较高，需要了解 Theia 的内部机制，现有文档基本上也无法满足高定制化的开发需求。</li></ul><h2 id="环境搭建" tabindex="-1">环境搭建 <a class="header-anchor" href="#环境搭建" aria-label="Permalink to &quot;环境搭建&quot;">​</a></h2><p>刚开始研究Theia的时候版本是1.11.0，那时候相对环境问题比较多，windows兼容性也有，文档不全面等各种问题，不过现在文档相对全面一点，环境问题可以看这篇文章<a href="https://my.oschina.net/u/1773694/blog/3220784" target="_blank" rel="noreferrer">Windows下运行Eclipse Theia源码指南</a>相对详细一些。</p><p>接下来我们研究Theia那肯定先把官方项目运行起来，我们可以学习一下官方文档<a href="https://theia-ide.org/" target="_blank" rel="noreferrer">Eclipse Theia文档</a>，如果文档访问不了可以查看文档的github源码 <a href="https://github.com/eclipse-theia/theia-website" target="_blank" rel="noreferrer">https://github.com/eclipse-theia/theia-website</a>。当然我们也可以查看<a href="https://github.com/eclipse-theia/theia/blob/master/doc/Developing.md#prerequisites" target="_blank" rel="noreferrer">快速入门</a>，注意这里面的基础环境：</p><ul><li>Node.js &gt;= 14.18.0，推荐使用 Node 的 LTS：目前是 16.x</li><li>Yarn package manager &gt;= 1.7.0 AND &lt; 2.x.x</li><li>git (If you would like to use the Git-extension too, you will need to have git version 2.11.0 or higher.)</li><li>python3，因为需要node-gyp@8.4.1</li></ul><p>然后就拉取代码，安装依赖，在这里如果安装依赖很慢甚至报错，基本上是网络问题，可以翻墙去下载，也可以在项目根目录下添加.npmrc配置帮助快速安装。</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">chromedriver_cdnurl</span><span style="color:#F97583;">=</span><span style="color:#B392F0;">https</span><span style="color:#E1E4E8;">:</span><span style="color:#6A737D;">//npm.taobao.org/mirrors/chromedriver</span></span>
<span class="line"><span style="color:#E1E4E8;">phantomjs_cdnurl</span><span style="color:#F97583;">=</span><span style="color:#B392F0;">http</span><span style="color:#E1E4E8;">:</span><span style="color:#6A737D;">//npm.taobao.org/mirrors/phantomjs</span></span>
<span class="line"><span style="color:#E1E4E8;">operadriver_cdnurl</span><span style="color:#F97583;">=</span><span style="color:#B392F0;">http</span><span style="color:#E1E4E8;">:</span><span style="color:#6A737D;">//npm.taobao.org/mirrors/operadriver</span></span>
<span class="line"><span style="color:#79B8FF;">ELECTRON_MIRROR</span><span style="color:#F97583;">=</span><span style="color:#B392F0;">http</span><span style="color:#E1E4E8;">:</span><span style="color:#6A737D;">//npm.taobao.org/mirrors/electron/ </span></span>
<span class="line"><span style="color:#E1E4E8;">puppeteer_skip_chromium_download </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">1</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">chromedriver_cdnurl</span><span style="color:#D73A49;">=</span><span style="color:#6F42C1;">https</span><span style="color:#24292E;">:</span><span style="color:#6A737D;">//npm.taobao.org/mirrors/chromedriver</span></span>
<span class="line"><span style="color:#24292E;">phantomjs_cdnurl</span><span style="color:#D73A49;">=</span><span style="color:#6F42C1;">http</span><span style="color:#24292E;">:</span><span style="color:#6A737D;">//npm.taobao.org/mirrors/phantomjs</span></span>
<span class="line"><span style="color:#24292E;">operadriver_cdnurl</span><span style="color:#D73A49;">=</span><span style="color:#6F42C1;">http</span><span style="color:#24292E;">:</span><span style="color:#6A737D;">//npm.taobao.org/mirrors/operadriver</span></span>
<span class="line"><span style="color:#005CC5;">ELECTRON_MIRROR</span><span style="color:#D73A49;">=</span><span style="color:#6F42C1;">http</span><span style="color:#24292E;">:</span><span style="color:#6A737D;">//npm.taobao.org/mirrors/electron/ </span></span>
<span class="line"><span style="color:#24292E;">puppeteer_skip_chromium_download </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>这里介绍一下windows环境的配置。</p><p>python3版本为Python 3.6 或更高版本</p><p>Visual Studio<a href="https://visualstudio.microsoft.com/zh-hans/downloads/" target="_blank" rel="noreferrer">构建工具</a>17，构建工具可以参考<a href="https://my.oschina.net/u/1773694/blog/3220784" target="_blank" rel="noreferrer">Windows下运行Eclipse Theia源码指南</a>这篇文章。</p><p>如果安装了多个版本的python或Visual Studio，可以通过 npm config 调整使用的版本。</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">npm config set python </span><span style="color:#F97583;">/</span><span style="color:#E1E4E8;">path</span><span style="color:#F97583;">/</span><span style="color:#E1E4E8;">to</span><span style="color:#F97583;">/</span><span style="color:#E1E4E8;">executable</span><span style="color:#F97583;">/</span><span style="color:#E1E4E8;">python </span><span style="color:#F97583;">--</span><span style="color:#E1E4E8;">global</span></span>
<span class="line"><span style="color:#E1E4E8;">npm config set msvs_version </span><span style="color:#79B8FF;">2017</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">--</span><span style="color:#E1E4E8;">global</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">npm config set python </span><span style="color:#D73A49;">/</span><span style="color:#24292E;">path</span><span style="color:#D73A49;">/</span><span style="color:#24292E;">to</span><span style="color:#D73A49;">/</span><span style="color:#24292E;">executable</span><span style="color:#D73A49;">/</span><span style="color:#24292E;">python </span><span style="color:#D73A49;">--</span><span style="color:#24292E;">global</span></span>
<span class="line"><span style="color:#24292E;">npm config set msvs_version </span><span style="color:#005CC5;">2017</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">--</span><span style="color:#24292E;">global</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>安装windows-build-tools，以前，windows-build-tools在 Windows 上构建 Native Nodes 模块是必需的。npm 包现在是deprecated因为 NodeJS 安装程序现在可以安装它需要的所有必需工具，包括 Windows 构建工具。</p><p>我们使用管理员身份打开PowserShell，然后运行命令安装</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">npm </span><span style="color:#F97583;">--</span><span style="color:#E1E4E8;">add</span><span style="color:#F97583;">-</span><span style="color:#E1E4E8;">python</span><span style="color:#F97583;">-</span><span style="color:#E1E4E8;">to</span><span style="color:#F97583;">-</span><span style="color:#E1E4E8;">path install </span><span style="color:#F97583;">--</span><span style="color:#E1E4E8;">global </span><span style="color:#F97583;">--</span><span style="color:#E1E4E8;">production windows</span><span style="color:#F97583;">-</span><span style="color:#E1E4E8;">build</span><span style="color:#F97583;">-</span><span style="color:#E1E4E8;">tools</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">npm </span><span style="color:#D73A49;">--</span><span style="color:#24292E;">add</span><span style="color:#D73A49;">-</span><span style="color:#24292E;">python</span><span style="color:#D73A49;">-</span><span style="color:#24292E;">to</span><span style="color:#D73A49;">-</span><span style="color:#24292E;">path install </span><span style="color:#D73A49;">--</span><span style="color:#24292E;">global </span><span style="color:#D73A49;">--</span><span style="color:#24292E;">production windows</span><span style="color:#D73A49;">-</span><span style="color:#24292E;">build</span><span style="color:#D73A49;">-</span><span style="color:#24292E;">tools</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>这样我们的环境配置完成。</p><h2 id="构建自己的ide工具" tabindex="-1">构建自己的IDE工具 <a class="header-anchor" href="#构建自己的ide工具" aria-label="Permalink to &quot;构建自己的IDE工具&quot;">​</a></h2><p>Theia官方文档提供了两种构建基于Theia的产品方式：</p><ul><li>Theia Extension Yeoman 生成器：生成基于 Theia 的产品以及示例扩展</li><li>Theia Blueprint：用于创建基于 Theia 的可安装桌面应用程序的模板工具 这两种方式会生成配置好的Theia工程，不需要自己去重新搭建。</li></ul><p>当然官方文档介绍了从零配置Theia工程的步骤。首先创建一个工程目录</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">$ mkdir theia</span><span style="color:#F97583;">-</span><span style="color:#E1E4E8;">demo</span></span>
<span class="line"><span style="color:#E1E4E8;">$ cd theia</span><span style="color:#F97583;">-</span><span style="color:#E1E4E8;">demo</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">$ mkdir theia</span><span style="color:#D73A49;">-</span><span style="color:#24292E;">demo</span></span>
<span class="line"><span style="color:#24292E;">$ cd theia</span><span style="color:#D73A49;">-</span><span style="color:#24292E;">demo</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>然后在工程根目录创建package.json</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#9ECBFF;">&quot;private&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#9ECBFF;">&quot;dependencies&quot;</span><span style="color:#E1E4E8;">: {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#9ECBFF;">&quot;@theia/callhierarchy&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;next&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#9ECBFF;">&quot;@theia/file-search&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;next&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#9ECBFF;">&quot;@theia/git&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;next&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#9ECBFF;">&quot;@theia/markers&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;next&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#9ECBFF;">&quot;@theia/messages&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;next&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#9ECBFF;">&quot;@theia/navigator&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;next&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#9ECBFF;">&quot;@theia/outline-view&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;next&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#9ECBFF;">&quot;@theia/plugin-ext-vscode&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;next&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#9ECBFF;">&quot;@theia/preferences&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;next&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#9ECBFF;">&quot;@theia/preview&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;next&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#9ECBFF;">&quot;@theia/search-in-workspace&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;next&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#9ECBFF;">&quot;@theia/terminal&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;next&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#9ECBFF;">&quot;@theia/vsx-registry&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;next&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">    },</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#9ECBFF;">&quot;devDependencies&quot;</span><span style="color:#E1E4E8;">: {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#9ECBFF;">&quot;@theia/cli&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;next&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">    },</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#9ECBFF;">&quot;scripts&quot;</span><span style="color:#E1E4E8;">: {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#9ECBFF;">&quot;prepare&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;yarn run clean &amp;&amp; yarn build &amp;&amp; yarn run download:plugins&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#9ECBFF;">&quot;clean&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;theia clean&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#9ECBFF;">&quot;build&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;theia build --mode development&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#9ECBFF;">&quot;start&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;theia start --plugins=local-dir:plugins&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#9ECBFF;">&quot;download:plugins&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;theia download:plugins&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">    },</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#9ECBFF;">&quot;theiaPluginsDir&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;plugins&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#9ECBFF;">&quot;theiaPlugins&quot;</span><span style="color:#E1E4E8;">: {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#9ECBFF;">&quot;vscode-builtin-extensions-pack&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;https://open-vsx.org/api/eclipse-theia/builtin-extension-pack/1.50.1/file/eclipse-theia.builtin-extension-pack-1.50.1.vsix&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">    },</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#9ECBFF;">&quot;theiaPluginsExcludeIds&quot;</span><span style="color:#E1E4E8;">: [</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#9ECBFF;">&quot;vscode.extension-editing&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#9ECBFF;">&quot;vscode.git&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#9ECBFF;">&quot;vscode.git-ui&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#9ECBFF;">&quot;vscode.github&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#9ECBFF;">&quot;vscode.markdown-language-features&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#9ECBFF;">&quot;vscode.microsoft-authentication&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">    ]</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#032F62;">&quot;private&quot;</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#032F62;">&quot;dependencies&quot;</span><span style="color:#24292E;">: {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#032F62;">&quot;@theia/callhierarchy&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;next&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#032F62;">&quot;@theia/file-search&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;next&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#032F62;">&quot;@theia/git&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;next&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#032F62;">&quot;@theia/markers&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;next&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#032F62;">&quot;@theia/messages&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;next&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#032F62;">&quot;@theia/navigator&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;next&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#032F62;">&quot;@theia/outline-view&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;next&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#032F62;">&quot;@theia/plugin-ext-vscode&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;next&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#032F62;">&quot;@theia/preferences&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;next&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#032F62;">&quot;@theia/preview&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;next&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#032F62;">&quot;@theia/search-in-workspace&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;next&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#032F62;">&quot;@theia/terminal&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;next&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#032F62;">&quot;@theia/vsx-registry&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;next&quot;</span></span>
<span class="line"><span style="color:#24292E;">    },</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#032F62;">&quot;devDependencies&quot;</span><span style="color:#24292E;">: {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#032F62;">&quot;@theia/cli&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;next&quot;</span></span>
<span class="line"><span style="color:#24292E;">    },</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#032F62;">&quot;scripts&quot;</span><span style="color:#24292E;">: {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#032F62;">&quot;prepare&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;yarn run clean &amp;&amp; yarn build &amp;&amp; yarn run download:plugins&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#032F62;">&quot;clean&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;theia clean&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#032F62;">&quot;build&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;theia build --mode development&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#032F62;">&quot;start&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;theia start --plugins=local-dir:plugins&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#032F62;">&quot;download:plugins&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;theia download:plugins&quot;</span></span>
<span class="line"><span style="color:#24292E;">    },</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#032F62;">&quot;theiaPluginsDir&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;plugins&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#032F62;">&quot;theiaPlugins&quot;</span><span style="color:#24292E;">: {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#032F62;">&quot;vscode-builtin-extensions-pack&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;https://open-vsx.org/api/eclipse-theia/builtin-extension-pack/1.50.1/file/eclipse-theia.builtin-extension-pack-1.50.1.vsix&quot;</span></span>
<span class="line"><span style="color:#24292E;">    },</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#032F62;">&quot;theiaPluginsExcludeIds&quot;</span><span style="color:#24292E;">: [</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#032F62;">&quot;vscode.extension-editing&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#032F62;">&quot;vscode.git&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#032F62;">&quot;vscode.git-ui&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#032F62;">&quot;vscode.github&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#032F62;">&quot;vscode.markdown-language-features&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#032F62;">&quot;vscode.microsoft-authentication&quot;</span></span>
<span class="line"><span style="color:#24292E;">    ]</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br></div></div><p>其中可以看到Theia核心依赖都是一个一个的扩展包，<a href="https://www.npmjs.com/package/@theia/cli" target="_blank" rel="noreferrer">@theia/cli</a>列为构建时依赖项。它提供脚本来构建和运行应用程序。其中还有一些其他配置项。</p><ul><li>theiaPluginsDir：部署插件的相对路径</li><li>theiaPlugins：要下载的插件集合（单个插件或扩展包） – 可以指向任何有效的下载 URL（例如：Open VSX、Github Releases 等）</li><li>theiaPluginsExcludeIds：解析扩展包时要排除的插件列表</li></ul><p>然后安装依赖包</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">yarn</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">yarn</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>然后，使用Theia CLI 构建应用程序</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">yarn theia build</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">yarn theia build</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>yarn在我们的应用程序的上下文中查找由theia提供的可执行文件@theia/cli，然后build使用theia. 这可能需要一段时间，因为默认情况下应用程序是在生产模式下构建的，即经过混淆和缩小。当然我们也可以使用yarn build调用scripts脚本。</p><p>构建完成后，我们调用命令来启动。</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">yarn theia start </span><span style="color:#F97583;">--</span><span style="color:#E1E4E8;">plugins</span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;">local</span><span style="color:#F97583;">-</span><span style="color:#B392F0;">dir</span><span style="color:#E1E4E8;">:plugins</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">yarn theia start </span><span style="color:#D73A49;">--</span><span style="color:#24292E;">plugins</span><span style="color:#D73A49;">=</span><span style="color:#24292E;">local</span><span style="color:#D73A49;">-</span><span style="color:#6F42C1;">dir</span><span style="color:#24292E;">:plugins</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>也可以调用yarn start来执行scripts脚本。</p><p><img src="`+o+'" alt="在这里插入图片描述"></p><p>启动后默认运行在3000端口上，然后打开浏览器可以看到运行起来的Theia IDE。</p><p><img src="'+p+'" alt="在这里插入图片描述"></p><p>我们也可以启动的时候指定特定网络和端口。</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">yarn start </span><span style="color:#F97583;">--</span><span style="color:#E1E4E8;">hostname </span><span style="color:#79B8FF;">0.0</span><span style="color:#E1E4E8;">.</span><span style="color:#79B8FF;">0.0</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">--</span><span style="color:#E1E4E8;">port </span><span style="color:#79B8FF;">8080</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">yarn start </span><span style="color:#D73A49;">--</span><span style="color:#24292E;">hostname </span><span style="color:#005CC5;">0.0</span><span style="color:#24292E;">.</span><span style="color:#005CC5;">0.0</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">--</span><span style="color:#24292E;">port </span><span style="color:#005CC5;">8080</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>以上是我们简单启动一个Theia的工程，作为一个WEB IDE在浏览器中访问，后续我们会介绍如果开发一个桌面客户端版的IDE。</p><h2 id="相关源码" tabindex="-1">相关源码 <a class="header-anchor" href="#相关源码" aria-label="Permalink to &quot;相关源码&quot;">​</a></h2><ul><li><a href="https://github.com/eclipse/openvsx" target="_blank" rel="noreferrer">openvsx</a></li><li><a href="https://github.com/theia-ide/theia-apps" target="_blank" rel="noreferrer">theia-apps</a></li><li><a href="https://github.com/eclipse-theia/theia" target="_blank" rel="noreferrer">theia</a></li></ul><h2 id="参考源码" tabindex="-1">参考源码 <a class="header-anchor" href="#参考源码" aria-label="Permalink to &quot;参考源码&quot;">​</a></h2><p>由于文档内容比较欠缺，可以参考其他定制Theia的代码。</p><ul><li><a href="https://github.com/eclipse-che/che-theia" target="_blank" rel="noreferrer">che-theia</a></li><li><a href="https://os.mbed.com/studio/" target="_blank" rel="noreferrer">Mbed Studio</a></li><li><a href="https://www.arduino.cc/en/software" target="_blank" rel="noreferrer">Arduino IDE</a></li></ul><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li><a href="https://developer.aliyun.com/article/747644" target="_blank" rel="noreferrer">KAITIAN IDE 是如何构建扩展能力极强的插件体系的？</a></li><li><a href="https://developer.aliyun.com/article/762768" target="_blank" rel="noreferrer">为未来研发模式而生，KAITIAN IDE 在业务中的探索</a></li><li><a href="https://tool.lu/deck/j9/detail?slide=49" target="_blank" rel="noreferrer">前端工程下一站 IDE</a></li><li><a href="https://my.oschina.net/u/4662964/blog/4871341" target="_blank" rel="noreferrer">基于 KAITIAN 的前端工程研发模式变革</a></li><li><a href="http://www.360doc.com/content/20/0506/03/36367108_910463884.shtml" target="_blank" rel="noreferrer">跑在浏览器上的小程序 IDE</a></li><li><a href="https://blog.csdn.net/weixin_40906515/article/details/107527421" target="_blank" rel="noreferrer">基于 React 打造高自由度的 IDE 布局系统</a></li><li><a href="https://mp.weixin.qq.com/s/7lMyU5l4EzzRYK4l6bVYmA" target="_blank" rel="noreferrer">Tide 研发平台 · 布局研发新基建</a></li><li><a href="https://juejin.cn/post/7008428269317914661" target="_blank" rel="noreferrer">如何在团队内快速落地WebIDE</a></li><li><a href="https://segmentfault.com/a/1190000041128062" target="_blank" rel="noreferrer">我们开源了一个轻量的 Web IDE UI 框架</a></li><li><a href="https://developer.aliyun.com/article/873828?utm_content=g_1000328446" target="_blank" rel="noreferrer">阿里 &amp; 蚂蚁自研 IDE 研发框架 OpenSumi 正式开源</a></li><li><a href="https://www.terapines.com/post/813/" target="_blank" rel="noreferrer">云端IDE基础框架介绍—ECLIPSE THEIA——兆松科技</a></li></ul><h2 id="其他ide产品" tabindex="-1">其他IDE产品 <a class="header-anchor" href="#其他ide产品" aria-label="Permalink to &quot;其他IDE产品&quot;">​</a></h2><ul><li><a href="https://dtstack.github.io/molecule/" target="_blank" rel="noreferrer">Molecule</a></li><li><a href="https://github.com/opensumi/core" target="_blank" rel="noreferrer">OpenSumi</a></li></ul>',58),c=[r];function i(E,u,y,h,d,b){return a(),n("div",null,c)}const g=s(t,[["render",i]]);export{m as __pageData,g as default};
