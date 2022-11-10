# 构建桌面IDE
>在上一篇文章 Eclipse Theia技术揭秘——初识Theia 简单介绍了一下Eclipse Theia这套IDE平台，这篇文章介绍一下如何基于Eclipse Theia构建桌面IDE。

## Eclipse Theia Blueprint介绍
首先我们先介绍一下Eclipse Theia Blueprint这套模板，它是用于构建基于 Eclipse Theia 平台的基于桌面的产品，以及展示 Eclipse Theia 功能。它由现有 Eclipse Theia 功能和扩展的子集组成，可以轻松下载并安装在所有主要操作系统平台上。大家可以去 [https://theia-ide.org/docs/blueprint_download/](https://theia-ide.org/docs/blueprint_download/) 下载体验一下，它也是开源的，可以在Github上参考其代码 [https://github.com/eclipse-theia/theia-blueprint](https://github.com/eclipse-theia/theia-blueprint) 。我们可以基于这套模板去定制我们的IDE产品。

## 下载
我们先下载Github的代码在本地运行一下。

```js
$ git clone git@github.com:eclipse-theia/theia-blueprint.git
```

## 工程结构
然后我们打开工程看一下目录结构。
![在这里插入图片描述](/build/1.jpeg)

在最外层目录组织结构中可以看到整个工程使用 [Lerna](https://www.lernajs.cn/) 配置 mono-repo构建，applications下存放不同端的产品工程，比如当前electron包含应用到打包、打包配置和电子目标的 E2E 测试。theia-extensions下存放自定义的Theia扩展包，其中theia-blueprint-product包含当前自定义产品品牌的 Theia 扩展（关于对话和欢迎页面），theia-blueprint-updater包含更新机制和相关界面的Theia扩展。

接下来看一下applications下electron包中的内容。

* resources：electron打包常用一些资源，像应用的图标。
* scripts：存放打包使用的脚本，像签名应用程序的脚本。
* test：存放测试脚本
* electron-builder.yml：[electron-builder](https://www.electron.build/)打包的配置文件
* webpack.config.js：webpack的相关配置

然后我们再安装一下依赖

```js
$ yarn
```

安装依赖之后会执行package.json中的prepare脚本，我们来看一下。

![在这里插入图片描述](/build/2.jpeg)
prepare脚本会执行yarn build和yarn download:plugins，这两个脚本最终会执行theia rebuild:electron、theia build和theia download:plugins。theia这个命令是来自devDependencies配置的@theia/cli。

执行完成后会发现electron工程下新增了一些文件。

![在这里插入图片描述](/build/3.jpeg)
* lib：构建生成的Bundle包
* plugins：执行download:plugins时下载的插件包
* src-gen：theia命令自动生成的工程文件
* gen-webpack.config.js：theia自动生成的webpack配置文件，由webpack.config.js引入

## 运行
我们在工程根目录下执行

```js
$ yarn electron start
```

启动后界面如下

![在这里插入图片描述](/build/4.jpeg)
## 打包
```js
$ yarn electron package
```

执行完命令后，在electron目录下dist中生成安装包文件，windows是.exe安装程序，mac是.dmg安装程序。

## 预览
```js
$ yarn electron package:preview
```

这个命令可以生成安装后的绿色版应用程序，可以直接打开不需安装。

以上就是Theia Blueprint提供的一些构建命令。