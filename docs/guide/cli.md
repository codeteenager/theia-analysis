>在之前的文章中，我们介绍了Theia的构建，其中用到了很多theia的命令，这些命令来自于@theia/cli这个库，本篇文章我们就对@theia/cli以及相关联的库进行分析。本篇文章是继构建桌面IDE，工程代码为[Theia Blueprint](https://github.com/eclipse-theia/theia-blueprint)，源码版本是1.28.0。

## 下载
首先我们在Github中下载[Theia](https://github.com/eclipse-theia/theia)的源码。
![在这里插入图片描述](/cli/1.jpeg)
## 目录结构
源码目录中我们主要关注dev-packages和packages两个包，dev-packages是开发工具包，packages下是Theia的核心依赖包，我们重点看一下dev-packages下的内容。

![在这里插入图片描述](/cli/2.jpeg)
* application-manager：应用工程管理器，提供 Frontend、Backend、Webpack 代码生成
* application-package：应用 package.json 配置解析，管理 Application、Extensions
* cli：是一个命令行工具，用于管理基于 Theia 的应用程序，为扩展和应用程序开发提供了有用的脚本和命令
* ffmpeg：是一个[Node Native 插件](https://nodejs.org/docs/latest-v14.x/api/n-api.html)，用于动态链接到 Electronffmpeg.dll并获取包含的编解码器列表
* localization-manager：用于为不同语言创建 Theia 和 Theia 扩展的本地化
* ovsx-client：该包用于通过其 REST API@theia/ovsx-client进行交互。open-vsx该包允许客户端获取扩展及其元数据、搜索注册表，并包含必要的逻辑来根据提供的支持的 API 版本确定兼容性
* private-eslint-plugin：对 Eclipse Theia 开发有用的@theia/eslint-plugin贡献规则。该插件通过静态分析帮助识别开发过程中的问题，包括代码质量、潜在问题和代码异常。
* private-ext-scripts：是一个命令行工具，用于在 Theia 包中运行共享的 npm 脚本
* private-re-exports：用于重新导出依赖项
* request：发送代理请求的库

然后我们重点看一下cli这个库。

## CLI分析
在package.json中可以看到bin字段注册的theia命令。

```js
 "bin": {
    "theia": "./bin/theia"
  }
```
然后我们看一下目录

![在这里插入图片描述](/cli/3.jpeg)
看一下bin/theia的内容。

```js
#!/usr/bin/env node
require('../lib/theia')
```

他引用了编译后lib下的theia，也就是编译前src下的theia.ts。我们具体看一下theia.ts做了哪些内容。

![在这里插入图片描述](/cli/4.jpeg)
我们可以看到这个文件中引用了@theia/application-manager、@theia/application-package、@theia/ffmpeg以及@theia/localization-manager库，并定义了一些函数，然后执行了theiaCli这个函数，我们针对theiaCli这个函数具体看一下。

![在这里插入图片描述](/cli/5.jpeg)

通过[yargs](https://github.com/yargs/yargs/blob/HEAD/docs/api.md)定义了很多命令。

* start
* clean
* copy
* generate
* build
* rebuild
* rebuild:browser
* rebuild:electron
* check:hoisted
* check:theia-version
* check:dependencies
* download:plugins
* nls-localize
* nls-extract
* test
* ffmpeg:replace
* ffmpeg:check

我们根据工程中使用了theia clean、theia build、theia rebuild:electron、theia download:plugins这四个命令。

#### theia clean
我们从代码中可以看到theia clean最终调用了ApplicationPackageManager的clean方法，我们找到application-manager包下的application-package-manager.ts文件可以看到ApplicationPackageManager中定义的clean方法。

```js
protected async remove(fsPath: string): Promise<void> {
        if (await fs.pathExists(fsPath)) {
            await fs.remove(fsPath);
        }
    }

    async clean(): Promise<void> {
        await Promise.all([
            this.remove(this.pck.lib()),
            this.remove(this.pck.srcGen()),
            this.remove(new WebpackGenerator(this.pck).genConfigPath)
        ]);
    }
```

可以看到clean删除了三个部分，分别是lib、src-gen、以及webpack的配置文件gen-webpack.config.js。其中this.pck是application-package下的application-package.ts的ApplicationPackage，我们可以看一下lib和srcGen方法的定义。

```js
  path(...segments: string[]): string {
        return paths.resolve(this.projectPath, ...segments);
    }
    lib(...segments: string[]): string {
        return this.path('lib', ...segments);
    }
    srcGen(...segments: string[]): string {
        return this.path('src-gen', ...segments);
    }
```

getConfigPath就是WebpackGenerator中定义的。

```js
get genConfigPath(): string {
        return this.pck.path('gen-webpack.config.js');
}
```

#### theia build
theia build命令会调用ApplicationPackageManager的build方法。看一下build方法的定义。

```js
async prepare(): Promise<void> {
        if (this.pck.isElectron()) {
            await this.prepareElectron();
        }
}
async generate(options: GeneratorOptions = {}): Promise<void> {
        try {
            await this.prepare();
        } catch (error) {
            if (error instanceof AbortError) {
                console.warn(error.message);
                process.exit(1);
            }
            throw error;
        }
        await Promise.all([
            new WebpackGenerator(this.pck, options).generate(),
            new BackendGenerator(this.pck, options).generate(),
            new FrontendGenerator(this.pck, options).generate(),
        ]);
}
async build(args: string[] = [], options: GeneratorOptions = {}): Promise<void> {
        await this.generate(options);
        await this.copy();
        return this.__process.run('webpack', args);
}
protected async prepareElectron(): Promise<void> {
        let theiaElectron;
        try {
            theiaElectron = await import('@theia/electron');
        } catch (error) {
            if (error.code === 'ERR_MODULE_NOT_FOUND') {
                throw new AbortError('Please install @theia/electron as part of your Theia Electron application');
            }
            throw error;
        }
        const expectedRange = theiaElectron.electronRange;
        const appPackageJsonPath = this.pck.path('package.json');
        const appPackageJson = await fs.readJSON(appPackageJsonPath) as { devDependencies?: Record<string, string> };
        if (!appPackageJson.devDependencies) {
            appPackageJson.devDependencies = {};
        }
        const currentRange: string | undefined = appPackageJson.devDependencies.electron;
        if (!currentRange || semver.compare(semver.minVersion(currentRange), semver.minVersion(expectedRange)) < 0) {
            // Update the range with the recommended one and write it on disk.
            appPackageJson.devDependencies = this.insertAlphabetically(appPackageJson.devDependencies, 'electron', expectedRange);
            await fs.writeJSON(appPackageJsonPath, appPackageJson, { spaces: 2 });
            throw new AbortError('Updated dependencies, please run "install" again');
        }
        if (!theiaElectron.electronVersion || !semver.satisfies(theiaElectron.electronVersion, currentRange)) {
            throw new AbortError('Dependencies are out of sync, please run "install" again');
        }
        await ffmpeg.replaceFfmpeg();
        await ffmpeg.checkFfmpeg();
}
async copy(): Promise<void> {
        await fs.ensureDir(this.pck.lib());
        await fs.copy(this.pck.frontend('index.html'), this.pck.lib('index.html'));
}
```

我们看到build方法做了三件事。

1. 调用generate函数，这个函数中最终会校验electron版本，调用WebpackGenerator生成gen-webpack.config.js，调用BackendGenerator生成src-gen/backend下main.js和server.js，调用FrontendGenerator生成src-gen/frontend下electron-main.js、index.html和index.js。
2. 调用copy函数，将src-gen/frontend下的index.html复制到lib目录下
3. 调用webpack进行编译

#### theia rebuild:electron
这个命令最终调用application-manager包下的rebuild.ts文件中rebuild方法。

```js
export const DEFAULT_MODULES = [
    'node-pty',
    'nsfw',
    'native-keymap',
    'find-git-repositories',
    'drivelist',
];
/**
 * @param target What to rebuild for.
 * @param options
 */
export function rebuild(target: RebuildTarget, options: RebuildOptions = {}): void {
    const {
        modules = DEFAULT_MODULES,
        cacheRoot = process.cwd(),
        forceAbi,
    } = options;
    const cache = path.resolve(cacheRoot, '.browser_modules');
    const cacheExists = folderExists(cache);
    guardExit(async token => {
        if (target === 'electron' && !cacheExists) {
            process.exitCode = await rebuildElectronModules(cache, modules, forceAbi, token);
        } else if (target === 'browser' && cacheExists) {
            process.exitCode = await revertBrowserModules(cache, modules);
        } else {
            console.log(`native node modules are already rebuilt for ${target}`);
        }
    }).catch(errorOrSignal => {
        if (typeof errorOrSignal === 'string' && errorOrSignal in os.constants.signals) {
            process.kill(process.pid, errorOrSignal);
        } else {
            throw errorOrSignal;
        }
    });
}
async function rebuildElectronModules(browserModuleCache: string, modules: string[], forceAbi: NodeABI | undefined, token: ExitToken): Promise<number> {
    const modulesJsonPath = path.join(browserModuleCache, 'modules.json');
    const modulesJson: ModulesJson = await fs.access(modulesJsonPath).then(
        () => fs.readJson(modulesJsonPath),
        () => ({})
    );
    let success = true;
    // Backup already built browser modules.
    await Promise.all(modules.map(async module => {
        let modulePath;
        try {
            modulePath = require.resolve(`${module}/package.json`, {
                paths: [process.cwd()],
            });
        } catch (_) {
            console.debug(`Module not found: ${module}`);
            return; // Skip current module.
        }
        const src = path.dirname(modulePath);
        const dest = path.join(browserModuleCache, module);
        try {
            await fs.remove(dest);
            await fs.copy(src, dest, { overwrite: true });
            modulesJson[module] = {
                originalLocation: src,
            };
            console.debug(`Processed "${module}"`);
        } catch (error) {
            console.error(`Error while doing a backup for "${module}": ${error}`);
            success = false;
        }
    }));
    if (Object.keys(modulesJson).length === 0) {
        console.debug('No module to rebuild.');
        return 0;
    }
    // Update manifest tracking the backups' original locations.
    await fs.writeJson(modulesJsonPath, modulesJson, { spaces: 2 });
    // If we failed to process a module then exit now.
    if (!success) {
        return 1;
    }
    const todo = modules.map(m => {
        // electron-rebuild ignores the module namespace...
        const slash = m.indexOf('/');
        return m.startsWith('@') && slash !== -1
            ? m.substring(slash + 1)
            : m;
    });
    let exitCode: number | undefined;
    try {
        if (process.env.THEIA_REBUILD_NO_WORKAROUND) {
            exitCode = await runElectronRebuild(todo, forceAbi, token);
        } else {
            exitCode = await electronRebuildExtraModulesWorkaround(process.cwd(), todo, () => runElectronRebuild(todo, forceAbi, token), token);
        }
    } catch (error) {
        console.error(error);
    } finally {
        // If code is undefined or different from zero we need to revert back to the browser modules.
        if (exitCode !== 0) {
            await revertBrowserModules(browserModuleCache, modules);
        }
        return exitCode ?? 1;
    }
}
async function runElectronRebuild(modules: string[], forceAbi: NodeABI | undefined, token: ExitToken): Promise<number> {
    const todo = modules.join(',');
    return new Promise(async (resolve, reject) => {
        let command = `npx --no-install electron-rebuild -f -w=${todo} -o=${todo}`;
        if (forceAbi) {
            command += ` --force-abi ${forceAbi}`;
        }
        const electronRebuild = cp.spawn(command, {
            stdio: 'inherit',
            shell: true,
        });
        token.onSignal(signal => electronRebuild.kill(signal));
        electronRebuild.on('error', reject);
        electronRebuild.on('close', (code, signal) => {
            if (signal) {
                reject(new Error(`electron-rebuild exited with "${signal}"`));
            } else {
                resolve(code!);
            }
        });
    });
}
```

在rebuild方法中会先创建.browser_modules目录，然后调用rebuildElectronModules方法将’node-pty’, ‘nsfw’, ‘native-keymap’, ‘find-git-repositories’, ‘drivelist’这几个模块源码复制到.browser_modules并生成modules.json配置文件。最终调用runElectronRebuild方法，这个方法中执行了electron-rebuild命令，将Electron项目使用的Node.js版本重建上述配置的原生Node.js模块。

#### theia download:plugins
这个命令会调用cli包下download-plugins.ts文件下downloadPlugins方法。

```js
export default async function downloadPlugins(options: DownloadPluginsOptions = {}): Promise<void> {
    const {
        packed = false,
        ignoreErrors = false,
        apiVersion = DEFAULT_SUPPORTED_API_VERSION,
        apiUrl = 'https://open-vsx.org/api',
        parallel = true,
        proxyUrl,
        proxyAuthorization,
        strictSsl
    } = options;

    requestService.configure({
        proxyUrl,
        proxyAuthorization,
        strictSSL: strictSsl
    });

    // Collect the list of failures to be appended at the end of the script.
    const failures: string[] = [];

    // Resolve the `package.json` at the current working directory.
    const pck = JSON.parse(await fs.readFile(path.resolve('package.json'), 'utf8'));

    // Resolve the directory for which to download the plugins.
    const pluginsDir = pck.theiaPluginsDir || 'plugins';

    // Excluded extension ids.
    const excludedIds = new Set<string>(pck.theiaPluginsExcludeIds || []);

    const parallelOrSequence = async (...tasks: Array<() => unknown>) => {
        if (parallel) {
            await Promise.all(tasks.map(task => task()));
        } else {
            for (const task of tasks) {
                await task();
            }
        }
    };

    // Downloader wrapper
    const downloadPlugin = (plugin: PluginDownload): Promise<void> => downloadPluginAsync(failures, plugin.id, plugin.downloadUrl, pluginsDir, packed, plugin.version);

    const downloader = async (plugins: PluginDownload[]) => {
        await parallelOrSequence(...plugins.map(plugin => () => downloadPlugin(plugin)));
    };

    await fs.mkdir(pluginsDir, { recursive: true });

    if (!pck.theiaPlugins) {
        console.log(chalk.red('error: missing mandatory \'theiaPlugins\' property.'));
        return;
    }
    try {
        console.warn('--- downloading plugins ---');
        // Download the raw plugins defined by the `theiaPlugins` property.
        // This will include both "normal" plugins as well as "extension packs".
        const pluginsToDownload = Object.entries(pck.theiaPlugins)
            .filter((entry: [string, unknown]): entry is [string, string] => typeof entry[1] === 'string')
            .map(([pluginId, url]) => ({ id: pluginId, downloadUrl: url }));
        await downloader(pluginsToDownload);

        const handleDependencyList = async (dependencies: Array<string | string[]>) => {
            const client = new OVSXClient({ apiVersion, apiUrl }, requestService);
            // De-duplicate extension ids to only download each once:
            const ids = new Set<string>(dependencies.flat());
            await parallelOrSequence(...Array.from(ids, id => async () => {
                try {
                    const extension = await client.getLatestCompatibleExtensionVersion(id);
                    const version = extension?.version;
                    const downloadUrl = extension?.files.download;
                    if (downloadUrl) {
                        await downloadPlugin({ id, downloadUrl, version });
                    } else {
                        failures.push(`No download url for extension pack ${id} (${version})`);
                    }
                } catch (err) {
                    failures.push(err.message);
                }
            }));
        };

        console.warn('--- collecting extension-packs ---');
        const extensionPacks = await collectExtensionPacks(pluginsDir, excludedIds);
        if (extensionPacks.size > 0) {
            console.warn(`--- resolving ${extensionPacks.size} extension-packs ---`);
            await handleDependencyList(Array.from(extensionPacks.values()));
        }

        console.warn('--- collecting extension dependencies ---');
        const pluginDependencies = await collectPluginDependencies(pluginsDir, excludedIds);
        if (pluginDependencies.length > 0) {
            console.warn(`--- resolving ${pluginDependencies.length} extension dependencies ---`);
            await handleDependencyList(pluginDependencies);
        }

    } finally {
        temp.cleanupSync();
    }
    for (const failure of failures) {
        console.error(failure);
    }
    if (!ignoreErrors && failures.length > 0) {
        throw new Error('Errors downloading some plugins. To make these errors non fatal, re-run with --ignore-errors');
    }
}
/**
 * Walk the plugin directory and collect available extension paths.
 * @param pluginDir the plugin directory.
 * @returns the list of all available extension paths.
 */
async function collectPackageJsonPaths(pluginDir: string): Promise<string[]> {
    const packageJsonPathList: string[] = [];
    const files = await fs.readdir(pluginDir);
    // Recursively fetch the list of extension `package.json` files.
    for (const file of files) {
        const filePath = path.join(pluginDir, file);
        if ((await fs.stat(filePath)).isDirectory()) {
            packageJsonPathList.push(...await collectPackageJsonPaths(filePath));
        } else if (path.basename(filePath) === 'package.json' && !path.dirname(filePath).includes('node_modules')) {
            packageJsonPathList.push(filePath);
        }
    }
    return packageJsonPathList;
}

/**
 * Get the mapping of extension-pack paths and their included plugin ids.
 * - If an extension-pack references an explicitly excluded `id` the `id` will be omitted.
 * @param pluginDir the plugin directory.
 * @param excludedIds the list of plugin ids to exclude.
 * @returns the mapping of extension-pack paths and their included plugin ids.
 */
async function collectExtensionPacks(pluginDir: string, excludedIds: Set<string>): Promise<Map<string, string[]>> {
    const extensionPackPaths = new Map<string, string[]>();
    const packageJsonPaths = await collectPackageJsonPaths(pluginDir);
    await Promise.all(packageJsonPaths.map(async packageJsonPath => {
        const json = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
        const extensionPack: unknown = json.extensionPack;
        if (Array.isArray(extensionPack)) {
            extensionPackPaths.set(packageJsonPath, extensionPack.filter(id => {
                if (excludedIds.has(id)) {
                    console.log(chalk.yellow(`'${id}' referred to by '${json.name}' (ext pack) is excluded because of 'theiaPluginsExcludeIds'`));
                    return false; // remove
                }
                return true; // keep
            }));
        }
    }));
    return extensionPackPaths;
}

/**
 * Get the mapping of  paths and their included plugin ids.
 * - If an extension-pack references an explicitly excluded `id` the `id` will be omitted.
 * @param pluginDir the plugin directory.
 * @param excludedIds the list of plugin ids to exclude.
 * @returns the mapping of extension-pack paths and their included plugin ids.
 */
async function collectPluginDependencies(pluginDir: string, excludedIds: Set<string>): Promise<string[]> {
    const dependencyIds: string[] = [];
    const packageJsonPaths = await collectPackageJsonPaths(pluginDir);
    await Promise.all(packageJsonPaths.map(async packageJsonPath => {
        const json = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
        const extensionDependencies: unknown = json.extensionDependencies;
        if (Array.isArray(extensionDependencies)) {
            for (const dependency of extensionDependencies) {
                if (excludedIds.has(dependency)) {
                    console.log(chalk.yellow(`'${dependency}' referred to by '${json.name}' is excluded because of 'theiaPluginsExcludeIds'`));
                } else {
                    dependencyIds.push(dependency);
                }
            }
        }
    }));
    return dependencyIds;
}
```

首先调用@theia/request包中的请求服务并配置，然后读取package.json，获取theiaPluginsDir、theiaPluginsExcludeIds和theiaPlugins的配置，根据theiaPlugins配置的插件列表将插件下载到theiaPluginsDir配置的目录下，然后遍历theiaPluginsDir目录下的插件，读取插件的package.json，获取extensionPack和extensionDependencies不包含theiaPluginsExcludeIds配置的插件，extensionPack是具有可以一起安装的扩展 ID 的数组。扩展的 id 始终是${publisher}.${name}. 例如：vscode.csharp，extensionDependencies是具有此扩展所依赖的扩展 ID 的数组。扩展的 id 始终是${publisher}.${name}. 例如：vscode.csharp。他们都是vscode插件的配置，具体可以查阅 [vscode扩展清单](https://code.visualstudio.com/api/references/extension-manifest) ，获取列表之后再下载对应的插件。

## Theia Blueprint启动
上面脚手架的一些命令了解之后，我们看一下Theia Blueprint的启动过程。我们看一下package.json中的启动脚本。

```js
"scripts": {
     "start": "electron scripts/theia-electron-main.js"
}
```

它调用electron命令执行了theia-electron-main.js的启动脚本，其中package.json中main配置也是`main”: “scripts/theia-electron-main.js`，package.json 中指定的脚本文件 main 是所有 Electron 应用的入口点。 这个文件控制 主程序 (main process)，它运行在 Node.js 环境里，负责控制您应用的生命周期、显示原生界面、执行特殊操作并管理渲染器进程 (renderer processes)。[electron](https://www.electronjs.org/)具体可以查阅对应的文档。

```js
// scripts/theia-electron-main.js
const path = require('path')
const os = require('os')

// Update to override the supported VS Code API version.
// process.env.VSCODE_API_VERSION = '1.50.0'

// Use a set of builtin plugins in our application.
process.env.THEIA_DEFAULT_PLUGINS = `local-dir:${path.resolve(__dirname, '..', 'plugins')}`

// Lookup inside the user's home folder for more plugins, and accept user-defined paths.
process.env.THEIA_PLUGINS = [
    process.env.THEIA_PLUGINS, `local-dir:${path.resolve(os.homedir(), '.theia', 'plugins')}`,
].filter(Boolean).join(',')

// Handover to the auto-generated electron application handler.
require('../src-gen/frontend/electron-main.js')
```

其中定义了一些环境变量，然后引入src-gen/frontend/electron-main.js文件。

```js
// @ts-check

require('reflect-metadata');
require('@theia/electron/shared/@electron/remote/main').initialize();

// Useful for Electron/NW.js apps as GUI apps on macOS doesn't inherit the `$PATH` define
// in your dotfiles (.bashrc/.bash_profile/.zshrc/etc).
// https://github.com/electron/electron/issues/550#issuecomment-162037357
// https://github.com/eclipse-theia/theia/pull/3534#issuecomment-439689082
require('fix-path')();

// Workaround for https://github.com/electron/electron/issues/9225. Chrome has an issue where
// in certain locales (e.g. PL), image metrics are wrongly computed. We explicitly set the
// LC_NUMERIC to prevent this from happening (selects the numeric formatting category of the
// C locale, http://en.cppreference.com/w/cpp/locale/LC_categories).
if (process.env.LC_ALL) {
    process.env.LC_ALL = 'C';
}
process.env.LC_NUMERIC = 'C';

const { default: electronMainApplicationModule } = require('@theia/core/lib/electron-main/electron-main-application-module');
const { ElectronMainApplication, ElectronMainApplicationGlobals } = require('@theia/core/lib/electron-main/electron-main-application');
const { Container } = require('inversify');
const { resolve } = require('path');
const { app } = require('electron');

// Fix the window reloading issue, see: https://github.com/electron/electron/issues/22119
app.allowRendererProcessReuse = false;

const config = {
    "applicationName": "Theia Blueprint",
    "defaultTheme": "dark",
    "defaultIconTheme": "none",
    "electron": {
        "windowOptions": {}
    },
    "defaultLocale": "",
    "validatePreferencesSchema": true,
    "preferences": {
        "toolbar.showToolbar": true
    }
};
const isSingleInstance = false;

if (isSingleInstance && !app.requestSingleInstanceLock()) {
    // There is another instance running, exit now. The other instance will request focus.
    app.quit();
    return;
}

const container = new Container();
container.load(electronMainApplicationModule);
container.bind(ElectronMainApplicationGlobals).toConstantValue({
    THEIA_APP_PROJECT_PATH: resolve(__dirname, '..', '..'),
    THEIA_BACKEND_MAIN_PATH: resolve(__dirname, '..', 'backend', 'main.js'),
    THEIA_FRONTEND_HTML_PATH: resolve(__dirname, '..', '..', 'lib', 'index.html'),
});

function load(raw) {
    return Promise.resolve(raw.default).then(module =>
        container.load(module)
    );
}

async function start() {
    const application = container.get(ElectronMainApplication);
    await application.start(config);
}

module.exports = Promise.resolve()
    .then(function () { return Promise.resolve(require('theia-blueprint-updater/lib/electron-main/update/theia-updater-main-module')).then(load) })
    .then(function () { return Promise.resolve(require('theia-blueprint-product/lib/electron-main/theia-blueprint-main-module')).then(load) })
    .then(start).catch(reason => {
        console.error('Failed to start the electron application.');
        if (reason) {
            console.error(reason);
        }
    });
```

在这个文件中定义了一个IOC容器，然后加载了@theia/core下的electronMainApplicationModule，electronMainApplicationModule是一个ContainerModule，里面绑定了ElectronMainApplication等，绑定常量THEIA_APP_PROJECT_PATH、THEIA_BACKEND_MAIN_PATH、THEIA_FRONTEND_HTML_PATH。然后加载theia-blueprint-updater和theia-blueprint-product我们自定义的扩展，然后通过container.get(ElectronMainApplication)获取ElectronMainApplication实例，调用start方法并传入config。

我们之前看到electron-main.js是由application-manager下frontend-generator.ts中FrontendGenerator生成的，其中config是由application-package读取package.json生成提供的。

```js
//application-manager/src/generator/frontend-generator.ts
const config = ${this.prettyStringify(this.pck.props.frontend.config)};
```

```js
//application-package/src/application-package.ts
get props(): ApplicationProps {
        if (this._props) {
            return this._props;
        }
        const theia = this.pck.theia || {};

        if (this.options.appTarget) {
            theia.target = this.options.appTarget;
        }

        if (theia.target && !(theia.target in ApplicationProps.ApplicationTarget)) {
            const defaultTarget = ApplicationProps.ApplicationTarget.browser;
            console.warn(`Unknown application target '${theia.target}', '${defaultTarget}' to be used instead`);
            theia.target = defaultTarget;
        }

        return this._props = deepmerge(ApplicationProps.DEFAULT, theia);
    }

    protected _pck: NodePackage | undefined;
    get pck(): NodePackage {
        if (this._pck) {
            return this._pck;
        }
        return this._pck = readJsonFile(this.packagePath);
    }
```

可以看出config是读取package.json中theia字段获取的。

其中theia-blueprint-updater和theia-blueprint-product也是自动生成的。他主要由application-package提供的，他会遍历package.json的依赖包，收集package.json中theiaExtensions有electronMain的依赖。theiaExtensions是我们列出导出 DI 模块的 JavaScript 模块，这些模块定义了我们扩展的绑定。

```js
//application-manager/src/generator/frontend-generator.ts
module.exports = Promise.resolve()${this.compileElectronMainModuleImports(electronMainModules)}
    .then(start).catch(reason => {
        console.error('Failed to start the electron application.');
        if (reason) {
            console.error(reason);
        }
    });
```

```js
//application-package/src/application-package.ts
get electronMainModules(): Map<string, string> {
        if (!this._electronMainModules) {
            this._electronMainModules = this.computeModules('electronMain');
        }
        return this._electronMainModules;
    }

    protected computeModules<P extends keyof Extension, S extends keyof Extension = P>(primary: P, secondary?: S): Map<string, string> {
        const result = new Map<string, string>();
        let moduleIndex = 1;
        for (const extensionPackage of this.extensionPackages) {
            const extensions = extensionPackage.theiaExtensions;
            if (extensions) {
                for (const extension of extensions) {
                    const modulePath = extension[primary] || (secondary && extension[secondary]);
                    if (typeof modulePath === 'string') {
                        const extensionPath = paths.join(extensionPackage.name, modulePath).split(paths.sep).join('/');
                        result.set(`${primary}_${moduleIndex}`, extensionPath);
                        moduleIndex = moduleIndex + 1;
                    }
                }
            }
        }
        return result;
    }
```

然后我们看一下ElectronMainApplication的start方法做了哪些内容。这里提及一下electron分为主进程和渲染进程，主进程负责创建窗口并加载html，而html中的代码运行在渲染进程中。

```js
//core/src/electron-main/electron-main-application.ts

async start(config: FrontendApplicationConfig): Promise<void> {
        this.useNativeWindowFrame = this.getTitleBarStyle(config) === 'native';
        this._config = config;
        this.hookApplicationEvents();
        const port = await this.startBackend();
        this._backendPort.resolve(port);
        await app.whenReady();
        await this.attachElectronSecurityToken(port);
        await this.startContributions();
        await this.launch({
            secondInstance: false,
            argv: this.processArgv.getProcessArgvWithoutBin(process.argv),
            cwd: process.cwd()
        });
}
protected async startBackend(): Promise<number> {
        // Check if we should run everything as one process.
        const noBackendFork = process.argv.indexOf('--no-cluster') !== -1;
        // We cannot use the `process.cwd()` as the application project path (the location of the `package.json` in other words)
        // in a bundled electron application because it depends on the way we start it. For instance, on OS X, these are a differences:
        // https://github.com/eclipse-theia/theia/issues/3297#issuecomment-439172274
        process.env.THEIA_APP_PROJECT_PATH = this.globals.THEIA_APP_PROJECT_PATH;
        // Set the electron version for both the dev and the production mode. (https://github.com/eclipse-theia/theia/issues/3254)
        // Otherwise, the forked backend processes will not know that they're serving the electron frontend.
        process.env.THEIA_ELECTRON_VERSION = process.versions.electron;
        if (noBackendFork) {
            process.env[ElectronSecurityToken] = JSON.stringify(this.electronSecurityToken);
            // The backend server main file is supposed to export a promise resolving with the port used by the http(s) server.
            const address: AddressInfo = await require(this.globals.THEIA_BACKEND_MAIN_PATH);
            return address.port;
        } else {
            const backendProcess = fork(
                this.globals.THEIA_BACKEND_MAIN_PATH,
                this.processArgv.getProcessArgvWithoutBin(),
                await this.getForkOptions(),
            );
            return new Promise((resolve, reject) => {
                // The backend server main file is also supposed to send the resolved http(s) server port via IPC.
                backendProcess.on('message', (address: AddressInfo) => {
                    resolve(address.port);
                });
                backendProcess.on('error', error => {
                    reject(error);
                });
                app.on('quit', () => {
                    // Only issue a kill signal if the backend process is running.
                    // eslint-disable-next-line no-null/no-null
                    if (backendProcess.exitCode === null && backendProcess.signalCode === null) {
                        try {
                            // If we forked the process for the clusters, we need to manually terminate it.
                            // See: https://github.com/eclipse-theia/theia/issues/835
                            process.kill(backendProcess.pid);
                        } catch (error) {
                            // See https://man7.org/linux/man-pages/man2/kill.2.html#ERRORS
                            if (error.code === 'ESRCH') {
                                return;
                            }
                            throw error;
                        }
                    }
                });
            });
        }
    }

async openDefaultWindow(): Promise<BrowserWindow> {
        const [uri, electronWindow] = await Promise.all([this.createWindowUri(), this.createWindow()]);
        electronWindow.loadURL(uri.withFragment(DEFAULT_WINDOW_HASH).toString(true));
        return electronWindow;
    }
 protected async createWindowUri(): Promise<URI> {
        return FileUri.create(this.globals.THEIA_FRONTEND_HTML_PATH)
            .withQuery(`port=${await this.backendPort}`);
    }
```
其中hookApplicationEvents中app模块监听应用的声明周期以及ipcMain监听渲染进程的事件。调用startBackend，然后fork一个子进程执行this.globals.THEIA_BACKEND_MAIN_PATH脚本，这个脚本就是在electron-main.js中绑定的常量，值为src-gen/backend/main.js。最后调用this.launch，这个方法最终调用了openDefaultWindow方法，可以看到默认调用了createWindow和createWindowUri，createWindowUri是在electron-main.js中定义的常量为lib/index.html，createWindow最终会new一个BrowserWindow窗口，然后加载uri。这样我们的应用就启动了。

我们看一下startBackend执行的脚本src-gen/backend/main.js的内容。

```js
//src-gen/backend/main.js
// @ts-check
const { BackendApplicationConfigProvider } = require('@theia/core/lib/node/backend-application-config-provider');
const main = require('@theia/core/lib/node/main');

BackendApplicationConfigProvider.set({
    "singleInstance": false,
    "startupTimeout": -1,
    "resolveSystemPlugins": false
});

const serverModule = require('./server');
const serverAddress = main.start(serverModule());

serverAddress.then(({ port, address }) => {
    if (process && process.send) {
        process.send({ port, address });
    }
});

module.exports = serverAddress;
```

其中主要通过@theia/core/lib/node/main的模块调用start加载serverModule模块，我们看一下serverModule模块的内容。

```js
//src-gen/backend/main.js
// @ts-check
require('reflect-metadata');

// Patch electron version if missing, see https://github.com/eclipse-theia/theia/pull/7361#pullrequestreview-377065146
if (typeof process.versions.electron === 'undefined' && typeof process.env.THEIA_ELECTRON_VERSION === 'string') {
    process.versions.electron = process.env.THEIA_ELECTRON_VERSION;
}

// Erase the ELECTRON_RUN_AS_NODE variable from the environment, else Electron apps started using Theia will pick it up.
if ('ELECTRON_RUN_AS_NODE' in process.env) {
    delete process.env.ELECTRON_RUN_AS_NODE;
}

const path = require('path');
const express = require('express');
const { Container } = require('inversify');
const { BackendApplication, BackendApplicationServer, CliManager } = require('@theia/core/lib/node');
const { backendApplicationModule } = require('@theia/core/lib/node/backend-application-module');
const { messagingBackendModule } = require('@theia/core/lib/node/messaging/messaging-backend-module');
const { loggerBackendModule } = require('@theia/core/lib/node/logger-backend-module');

const container = new Container();
container.load(backendApplicationModule);
container.load(messagingBackendModule);
container.load(loggerBackendModule);

function defaultServeStatic(app) {
    app.use(express.static(path.resolve(__dirname, '../../lib')))
}

function load(raw) {
    return Promise.resolve(raw.default).then(
        module => container.load(module)
    );
}

function start(port, host, argv = process.argv) {
    if (!container.isBound(BackendApplicationServer)) {
        container.bind(BackendApplicationServer).toConstantValue({ configure: defaultServeStatic });
    }
    return container.get(CliManager).initializeCli(argv).then(() => {
        return container.get(BackendApplication).start(port, host);
    });
}

module.exports = (port, host, argv) => Promise.resolve()
    .then(function () { return Promise.resolve(require('@theia/core/lib/node/i18n/i18n-backend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/core/lib/electron-node/keyboard/electron-backend-keyboard-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/core/lib/electron-node/token/electron-token-backend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/core/lib/electron-node/hosting/electron-backend-hosting-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/core/lib/electron-node/request/electron-backend-request-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/filesystem/lib/node/filesystem-backend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/filesystem/lib/node/download/file-download-backend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/workspace/lib/node/workspace-backend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/process/lib/common/process-common-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/process/lib/node/process-backend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/terminal/lib/node/terminal-backend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/task/lib/node/task-backend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/debug/lib/node/debug-backend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/external-terminal/lib/electron-node/external-terminal-backend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/file-search/lib/node/file-search-backend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/metrics/lib/node/metrics-backend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/mini-browser/lib/node/mini-browser-backend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/search-in-workspace/lib/node/search-in-workspace-backend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/plugin-ext/lib/plugin-ext-backend-electron-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/plugin-dev/lib/node-electron/plugin-dev-electron-backend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/plugin-ext-vscode/lib/node/plugin-vscode-backend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/vsx-registry/lib/node/vsx-registry-backend-module')).then(load) })
    .then(function () { return Promise.resolve(require('theia-blueprint-product/lib/node/theia-blueprint-backend-module')).then(load) })
    .then(() => start(port, host, argv)).catch(error => {
        console.error('Failed to start the backend application:');
        console.error(error);
        process.exitCode = 1;
        throw error;
    });
```

其中初始化了一个IOC容器，然后加载了@theia/core下backendApplicationModule模块，使用express托管了lib下的静态文件绑定到容器中，然后遍历package.json中依赖，加载依赖项package.json中theiaExtensions下配置backend和backendElectron的DI模块，然后调用BackendApplication的start方法启动。

```js
//@theia/core/src/node/backend-application.ts

async start(aPort?: number, aHostname?: string): Promise<http.Server | https.Server> {
        const hostname = aHostname !== undefined ? aHostname : this.cliParams.hostname;
        const port = aPort !== undefined ? aPort : this.cliParams.port;

        const deferred = new Deferred<http.Server | https.Server>();
        let server: http.Server | https.Server;

        if (this.cliParams.ssl) {

            if (this.cliParams.cert === undefined) {
                throw new Error('Missing --cert option, see --help for usage');
            }

            if (this.cliParams.certkey === undefined) {
                throw new Error('Missing --certkey option, see --help for usage');
            }

            let key: Buffer;
            let cert: Buffer;
            try {
                key = await fs.readFile(this.cliParams.certkey as string);
            } catch (err) {
                console.error("Can't read certificate key");
                throw err;
            }

            try {
                cert = await fs.readFile(this.cliParams.cert as string);
            } catch (err) {
                console.error("Can't read certificate");
                throw err;
            }
            server = https.createServer({ key, cert }, this.app);
        } else {
            server = http.createServer(this.app);
        }

        server.on('error', error => {
            deferred.reject(error);
            /* The backend might run in a separate process,
             * so we defer `process.exit` to let time for logging in the parent process */
            setTimeout(process.exit, 0, 1);
        });

        server.listen(port, hostname, () => {
            const scheme = this.cliParams.ssl ? 'https' : 'http';
            console.info(`Theia app listening on ${scheme}://${hostname || 'localhost'}:${(server.address() as AddressInfo).port}.`);
            deferred.resolve(server);
        });

        /* Allow any number of websocket servers.  */
        server.setMaxListeners(0);

        for (const contribution of this.contributionsProvider.getContributions()) {
            if (contribution.onStart) {
                try {
                    await this.measure(contribution.constructor.name + '.onStart',
                        () => contribution.onStart!(server)
                    );
                } catch (error) {
                    console.error('Could not start contribution', error);
                }
            }
        }
        return this.stopwatch.startAsync('server', 'Finished starting backend application', () => deferred.promise);
    }
```

通过https.createServer/http.createServer来创建服务。然后再遍历contributionsProvider并调用其onStart方法，contributionsProvider收集了BackendApplicationContribution的实现类，接口BackendApplicationContribution有四个钩子方法initialize、configure、onStart、onStop，并在BackendApplication初始化后端生命周期过程中去调用，这样我们可以去注册BackendApplicationContribution在Theia 后端启动过程中去做一些自定义操作。

这样我们的服务子进程启动完成，然后我们看一下渲染进程加载的html。

打开lib/index.html，其中引入了bundle.js，bundle.js是在gen-webpack.config.js中以src-gen/frontend/index.js为入口打包生成的。我们看一下src-gen/frontend/index.js的代码。

```js
// @ts-check

require('reflect-metadata');
require('setimmediate');
const { Container } = require('inversify');
const { FrontendApplicationConfigProvider } = require('@theia/core/lib/browser/frontend-application-config-provider');

FrontendApplicationConfigProvider.set({
    "applicationName": "Theia Blueprint",
    "defaultTheme": "dark",
    "defaultIconTheme": "none",
    "electron": {
        "windowOptions": {}
    },
    "defaultLocale": "",
    "validatePreferencesSchema": true,
    "preferences": {
        "toolbar.showToolbar": true
    }
});


self.MonacoEnvironment = {
    getWorkerUrl: function (moduleId, label) {
        return './editor.worker.js';
    }
}


const preloader = require('@theia/core/lib/browser/preloader');

// We need to fetch some data from the backend before the frontend starts (nls, os)
module.exports = preloader.preload().then(() => {
    const { FrontendApplication } = require('@theia/core/lib/browser');
    const { frontendApplicationModule } = require('@theia/core/lib/browser/frontend-application-module');
    const { messagingFrontendModule } = require('@theia/core/lib/electron-browser/messaging/electron-messaging-frontend-module');
    const { loggerFrontendModule } = require('@theia/core/lib/browser/logger-frontend-module');

    const container = new Container();
    container.load(frontendApplicationModule);
    container.load(messagingFrontendModule);
    container.load(loggerFrontendModule);

    return Promise.resolve()
    .then(function () { return Promise.resolve(require('@theia/core/lib/browser/i18n/i18n-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/core/lib/electron-browser/menu/electron-menu-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/core/lib/electron-browser/window/electron-window-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/core/lib/electron-browser/keyboard/electron-keyboard-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/core/lib/electron-browser/token/electron-token-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/core/lib/electron-browser/request/electron-browser-request-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/variable-resolver/lib/browser/variable-resolver-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/editor/lib/browser/editor-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/filesystem/lib/browser/filesystem-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/filesystem/lib/browser/download/file-download-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/filesystem/lib/electron-browser/file-dialog/electron-file-dialog-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/workspace/lib/browser/workspace-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/markers/lib/browser/problem/problem-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/outline-view/lib/browser/outline-view-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/monaco/lib/browser/monaco-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/bulk-edit/lib/browser/bulk-edit-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/callhierarchy/lib/browser/callhierarchy-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/console/lib/browser/console-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/output/lib/browser/output-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/process/lib/common/process-common-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/terminal/lib/browser/terminal-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/userstorage/lib/browser/user-storage-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/task/lib/browser/task-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/debug/lib/browser/debug-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/navigator/lib/browser/navigator-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/navigator/lib/electron-browser/electron-navigator-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/editor-preview/lib/browser/editor-preview-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/external-terminal/lib/electron-browser/external-terminal-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/file-search/lib/browser/file-search-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/preferences/lib/browser/preference-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/keymaps/lib/browser/keymaps-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/getting-started/lib/browser/getting-started-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/messages/lib/browser/messages-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/mini-browser/lib/browser/mini-browser-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/mini-browser/lib/electron-browser/environment/electron-mini-browser-environment-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/scm/lib/browser/scm-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/search-in-workspace/lib/browser/search-in-workspace-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/timeline/lib/browser/timeline-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/plugin-ext/lib/plugin-ext-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/plugin-ext/lib/plugin-ext-frontend-electron-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/plugin-dev/lib/browser/plugin-dev-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/plugin-ext-vscode/lib/browser/plugin-vscode-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/property-view/lib/browser/property-view-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/scm-extra/lib/browser/scm-extra-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/toolbar/lib/browser/toolbar-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/typehierarchy/lib/browser/typehierarchy-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('@theia/vsx-registry/lib/browser/vsx-registry-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('theia-blueprint-updater/lib/electron-browser/theia-updater-frontend-module')).then(load) })
    .then(function () { return Promise.resolve(require('theia-blueprint-product/lib/browser/theia-blueprint-frontend-module')).then(load) })
        .then(start).catch(reason => {
            console.error('Failed to start the frontend application.');
            if (reason) {
                console.error(reason);
            }
        });

    function load(jsModule) {
        return Promise.resolve(jsModule.default)
            .then(containerModule => container.load(containerModule));
    }

    function start() {
        (window['theia'] = window['theia'] || {}).container = container;
        return container.get(FrontendApplication).start();
    }
});
```

前端这部分创建了一个IOC容器，然后加载了@theia/core下browser中的DI容器模块，然后遍历package.json中依赖，加载依赖项package.json中theiaExtensions下配置frontend和frontendElectron的DI模块，然后调用FrontendApplication的start方法启动。

```js
// @theia/core/src/browser/frontend-application.ts
 
async start(): Promise<void> {
        const startup = this.backendStopwatch.start('frontend');

        await this.measure('startContributions', () => this.startContributions(), 'Start frontend contributions', false);
        this.stateService.state = 'started_contributions';

        const host = await this.getHost();
        this.attachShell(host);
        this.attachTooltip(host);
        await animationFrame();
        this.stateService.state = 'attached_shell';

        await this.measure('initializeLayout', () => this.initializeLayout(), 'Initialize the workbench layout', false);
        this.stateService.state = 'initialized_layout';
        await this.fireOnDidInitializeLayout();

        await this.measure('revealShell', () => this.revealShell(host), 'Replace loading indicator with ready workbench UI (animation)', false);
        this.registerEventListeners();
        this.stateService.state = 'ready';

        startup.then(idToken => this.backendStopwatch.stop(idToken, 'Frontend application start', []));
    }
 /**
     * Initialize and start the frontend application contributions.
     */
    protected async startContributions(): Promise<void> {
        for (const contribution of this.contributions.getContributions()) {
            if (contribution.initialize) {
                try {
                    await this.measure(contribution.constructor.name + '.initialize',
                        () => contribution.initialize!()
                    );
                } catch (error) {
                    console.error('Could not initialize contribution', error);
                }
            }
        }

        for (const contribution of this.contributions.getContributions()) {
            if (contribution.configure) {
                try {
                    await this.measure(contribution.constructor.name + '.configure',
                        () => contribution.configure!(this)
                    );
                } catch (error) {
                    console.error('Could not configure contribution', error);
                }
            }
        }

        /**
         * FIXME:
         * - decouple commands & menus
         * - consider treat commands, keybindings and menus as frontend application contributions
         */
        await this.measure('commands.onStart',
            () => this.commands.onStart()
        );
        await this.measure('keybindings.onStart',
            () => this.keybindings.onStart()
        );
        await this.measure('menus.onStart',
            () => this.menus.onStart()
        );
        for (const contribution of this.contributions.getContributions()) {
            if (contribution.onStart) {
                try {
                    await this.measure(contribution.constructor.name + '.onStart',
                        () => contribution.onStart!(this)
                    );
                } catch (error) {
                    console.error('Could not start contribution', error);
                }
            }
        }
    }
  /**
     * Attach the application shell to the host element. If a startup indicator is present, the shell is
     * inserted before that indicator so it is not visible yet.
     */
    protected attachShell(host: HTMLElement): void {
        const ref = this.getStartupIndicator(host);
        Widget.attach(this.shell, host, ref);
    }
```

start方法主要做了这样几件事，1、初始化并启动frontend application contributions，和BackendApplicationContribution类似在前端通常用于打开和排列视图、注册侦听器、添加状态栏项或在应用程序启动时自定义应用程序的布局，2、调用@phosphor/widgets的Widget.attach方法，将ApplicationShell布局插入到document.body中class为theia-preload的节点前，3、初始化ApplicationShell的布局，4、隐藏启动动画，展示页面。

以上就是Theia Blueprint启动的过程。

## 自定义配置
在上面的分析过程中，我们发现package.json中有一个theia的配置，用于自定义theia的一些配置，通过使用application-package解析生成src-gen下配置的内容。

```js
//application-package/src/application-package.ts

get props(): ApplicationProps {
        if (this._props) {
            return this._props;
        }
        const theia = this.pck.theia || {};

        if (this.options.appTarget) {
            theia.target = this.options.appTarget;
        }

        if (theia.target && !(theia.target in ApplicationProps.ApplicationTarget)) {
            const defaultTarget = ApplicationProps.ApplicationTarget.browser;
            console.warn(`Unknown application target '${theia.target}', '${defaultTarget}' to be used instead`);
            theia.target = defaultTarget;
        }

        return this._props = deepmerge(ApplicationProps.DEFAULT, theia);
}

protected _pck: NodePackage | undefined;
get pck(): NodePackage {
        if (this._pck) {
            return this._pck;
        }
        return this._pck = readJsonFile(this.packagePath);
}
```

我们配置的属性最终合并到ApplicationProps中，我们看一下定义：

```js
export interface ApplicationProps extends NpmRegistryProps {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly [key: string]: any;

    /**
     * Whether the extension targets the browser or electron. Defaults to `browser`.
     */
    readonly target: ApplicationProps.Target;

    /**
     * Frontend related properties.
     */
    readonly frontend: {
        readonly config: FrontendApplicationConfig
    };

    /**
     * Backend specific properties.
     */
    readonly backend: {
        readonly config: BackendApplicationConfig
    };

    /**
     * Generator specific properties.
     */
    readonly generator: {
        readonly config: GeneratorConfig
    };
}
```

* target：打包平台的类型，browser（浏览器）和electron（桌面端）
* frontend：前端相关属性
* backend：后端特定属性
* generator：生成器特定属性

#### frontend配置
前端相关属性主要包括以下内容：

```js
export const DEFAULT: FrontendApplicationConfig = {
        applicationName: 'Eclipse Theia',
        defaultTheme: 'dark',
        defaultIconTheme: 'none',
        electron: ElectronFrontendApplicationConfig.DEFAULT,
        defaultLocale: '',
        validatePreferencesSchema: true
};
```

* applicationName：应用名称
* defaultTheme：默认主题
* defaultIconTheme： 默认文件图标主题
* electron：electron配置，主要是BrowserWindow的相关配置
* defaultLocale：默认区域语言
* validatePreferencesSchema：是否在启动时验证首选项的JSON模式

#### backend配置
```js
export const DEFAULT: BackendApplicationConfig = {
        singleInstance: false,
    };
```

electron模式下，如果为true则一次只允许运行应用程序的一个实例。

#### generator配置
```js
export const DEFAULT: GeneratorConfig = {
        preloadTemplate: ''
};
```

preloadTemplate用于自定义启动页面模板的文件路径。

以上就是自定义配置的相关内容。

