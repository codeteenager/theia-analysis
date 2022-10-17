module.exports = {
    title: 'Eclipse Theia技术揭秘',
    description: 'Eclipse Theia技术揭秘',
    base: '/theia-analysis/',
    themeConfig: {
        siteTitle: false,
        logo: "/logo.svg",
        nav: [
            { text: "技术解析", link: "/guide/introduction" },
            // { text: "", link: "/examples/button/" },
        ],
        socialLinks: [{ icon: "github", link: "https://github.com/codeteenager/theia-analysis" }],
        sidebar: {
            "/guide/": [
                {
                    text: "基础",
                    items: [
                        {
                            text: "初识Theia",
                            link: "/guide/introduction",
                        },
                        {
                            text: "构建桌面IDE",
                            link: "/guide/build",
                        },
                        {
                            text: "依赖注入框架InversifyJS",
                            link: "/guide/inversifyjs",
                        },
                        {
                            text: "脚手架源码分析",
                            link: "/guide/cli",
                        },
                        {
                            text: "自定义布局",
                            link: "/guide/layout",
                        },
                    ],
                }
            ],
        }
    }
}