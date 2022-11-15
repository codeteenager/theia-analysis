module.exports = {
    title: 'Eclipse Theia技术揭秘',
    description: 'Eclipse Theia技术揭秘',
    base: '/theia-analysis/',
    head: [
        ['link', { rel: 'icon', href: '/theia-analysis/favicon.ico' }]
    ],
    markdown: {
        lineNumbers: true, //显示代码行数
    },
    lastUpdated: true,
    themeConfig: {
        siteTitle: false,
        logo: "/logo.svg",
        nav: [
            { text: "博文", link: "/guide/introduction" }
        ],
        outlineTitle: '在本页面',
        lastUpdatedText: '最近更新时间',
        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2022-present codeteenager'
        },
        smoothScroll: true,
        socialLinks: [{ icon: "github", link: "https://github.com/codeteenager/theia-analysis" }],
        sidebar: {
            "/guide/": [
                {
                    text: "IDE开发",
                    items: [
                        {
                            text: "初识Theia",
                            link: "/guide/introduction",
                        },
                        {
                            text: "构建桌面IDE",
                            link: "/guide/build",
                        }
                    ],
                },
                {
                    text: "源码解析",
                    items: [
                        {
                            text: "脚手架源码分析",
                            link: "/guide/cli",
                        },
                        {
                            text: "依赖注入框架InversifyJS",
                            link: "/guide/inversifyjs",
                        },
                        {
                            text: "自定义布局",
                            link: "/guide/layout",
                        },
                    ],
                },
                {
                    text: "其他",
                    items: [
                        {
                            text: "相关文章",
                            link: "/guide/learn",
                        },
                        {
                            text: "技术分享",
                            link: "/guide/share",
                        }
                    ],
                },
            ],
        },
        docFooter: {
            prev: '上一页',
            next: '下一页'
        }
    }
}