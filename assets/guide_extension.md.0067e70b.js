import{_ as e,c as a,o as t,V as o}from"./chunks/framework.321cd8c6.js";const u=JSON.parse('{"title":"开发一个扩展","description":"","frontmatter":{},"headers":[],"relativePath":"guide/extension.md","filePath":"guide/extension.md","lastUpdated":1683276962000}'),i={name:"guide/extension.md"},n=o('<h1 id="开发一个扩展" tabindex="-1">开发一个扩展 <a class="header-anchor" href="#开发一个扩展" aria-label="Permalink to &quot;开发一个扩展&quot;">​</a></h1><p>Theia 应用程序由 Theia 扩展组成的。Theia 本身提供了许多扩展，例如用于编辑器、终端、项目视图等。要创建一个Theia应用程序，你可以选择Theia项目提供的一些Theia扩展（核心扩展），添加自定义Theia扩展，然后编译并运行结果。</p><p>自定义 Theia 扩展将有权访问与核心扩展相同的 API。这种模块化允许您根据您的要求扩展、调整或删除 Theia 中的几乎所有内容。</p><p>与 VS Code 扩展相比，使用 Theia 扩展开发复杂视图也更容易。从技术上讲，扩展是一个 npm 包，它公开了任意数量的 DI 模块<code>(ContainerModule)</code> 有助于创建 DI 容器。</p><h2 id="扩展程序目录" tabindex="-1">扩展程序目录 <a class="header-anchor" href="#扩展程序目录" aria-label="Permalink to &quot;扩展程序目录&quot;">​</a></h2><p>在扩展程序的文件夹中，我们按平台分类：</p><ul><li>该common文件夹包含不依赖于任何运行时的代码</li><li>该browser文件夹包含需要现代浏览器作为平台 (DOM API) 的代码</li><li>该electron-browser文件夹包含需要 DOM API 以及 Electron 渲染器进程特定 API 的前端代码</li><li>该node文件夹包含需要 Node.js 作为平台的（后端）代码</li><li>该node-electron文件夹包含特定于 Electron 的（后端）代码</li></ul>',7),r=[n];function l(s,d,c,_,h,p){return t(),a("div",null,r)}const m=e(i,[["render",l]]);export{u as __pageData,m as default};