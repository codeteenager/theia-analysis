# 依赖注入框架InversifyJS
> InversifyJS源码：https://github.com/inversify/InversifyJS<br/>
> InversifyJS官网：https://inversify.io/<br/>
> InversifyJS中文翻译：https://doc.inversify.cloud/zh_cn/

## 前言
之前在做IDE这方面的时候，对比VSCode和Theia，VSCode定制能力很差，尤其是UI部分，随着VSCode版本的更新也需要同步的更改，相比而言Theia扩展定制能力很强，毕竟Theia核心就是一个一个的扩展包，这得益于Theia使用了InversifyJS这套框架作为基石。

大家都知道面向对象有五大设计原则SOLID

* 单一职责原则SRP（Single Responsibility Principle）：就一个类而言，应该仅有一个引起它变化的原因。
* 开放封闭原则OCP（Open Close Principle）：一个软件实体如类、模块和函数应该对扩展开放，对修改关闭
* 里氏替换原则LSP（Liskov Substitution Principle）：子类必须能够替换它们的基类（IS-A）的关系
* 接口隔离原则ISP（Interface Segregation Principle）：不应该强迫客户程序依赖它不用的方法
* 依赖倒置原则DIP（Dependence Inversion Principle）：高层模块(稳定)不应该依赖于低层模块（变化），二者都应该依赖于抽象（稳定）。抽象（稳定）不应该依赖于实现细节（变化），实现细节应该依赖于抽象（稳定）。针对接口编程，不要针对实现编程

IoC：Inversion of Control (IoC) 是软件工程（software engineering）中的一种编程原则（programming principle），在面向对象编程或其他编程范式中得到应用，它是依赖倒置原则的一种设计思路，其中最常见的方式叫做依赖注入（Dependency Injection，简称DI），还有一种方式叫“依赖查找”（Dependency Lookup）。通过控制反转，对象在被创建的时候，由一个调控系统内所有对象的外界实体，将其所依赖的对象的引用传递给它。也可以说，依赖被注入到对象中。InversifyJS就是一个IOC容器，用来映射依赖，管理对象创建和生存周期。

## InversifyJS简介
InversifyJS 是一个轻量的 (4KB) 控制反转容器 (IoC)，可用于编写 TypeScript 和 JavaScript 应用。 它使用类构造函数去定义和注入它的依赖。InversifyJS API 很友好易懂, 鼓励对 OOP 和 IoC 最佳实践的应用。InversifyJS 是一个工具，它能帮助 JavaScript 开发者，写出出色的面向对象设计的代码。

InversifyJS有4个主要目标：

* 允许JavaScript开发人员编写遵循 SOLID 原则的代码
* 促进并鼓励遵守最佳的面向对象编程和依赖注入实践
* 尽可能少的运行时开销
* 提供[艺术编程体验和生态](https://github.com/inversify/InversifyJS/blob/master/wiki/ecosystem.md)

## 开始使用

先通过npm init创建工程，然后安装一下InversifyJS的相关依赖。

```js
npm install inversify reflect-metadata --save
```

> 由于 InversifyJS 通过反射来获取装饰器的相关元数据，所以需要额外安装库 reflect-metadata

Inversify npm 包已经包含了 InversifyJS 的类型定义

> 警示: 重要! InversifyJS 需要 TypeScript 的版本 >= 2.0 还有 experimentalDecorators, emitDecoratorMetadata, types and lib 在 tsconfig.json 中 compilerOptions 的配置如下:

```js
{
    "compilerOptions": {
        "target": "es5",
        "lib": ["es6"],
        "types": ["reflect-metadata"],
        "module": "commonjs",
        "moduleResolution": "node",
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true
    }
}
```

inversifyjs需要现代JavaScript引擎，支持以下特性

* [Reflect metadata](https://rbuckton.github.io/reflect-metadata/)
* [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
* [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) (Only required if using [provider injection](https://github.com/inversify/InversifyJS/blob/master/wiki/provider_injection.md))
* [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) (Only required if using [activation handlers](https://github.com/inversify/InversifyJS/blob/master/wiki/activation_handler.md))

如果您的运行环境不支持这些特性，您可能需要导入 shim 或 polyfill

> 警示： reflect-metadata polyfill 应该在您整个应用中只导入一次 因为 Reflect 对象需要成为一个全局的单例

### 基础概念

1. container

容器本身就是一个类实例，而inversify要做的就是利用这么一个类实例来管理诸多别的类实例，而且依靠一套有序的方法实现。容器本身还有父容器和子容器的概念，所以Container对象有一个字段parent来表示，这样可以做到继承。这个概念在使用Container.resolve的时候有用到。

2. scope

在inversify.js中，或者说是在IoC的概念中存在一个叫做scope的单词，它是和class的注入关联在一起的。一个类的注入scope可以支持以下三种模式：

* Transient：每次从容器中获取的时候(也就是每次请求)都是一个新的实例
* Singleton：每次从容器中获取的时候（也就是每次请求）都是同一个实例
* Request：社区里也成为Scoped模式，每次请求的时候都会获取新的实例，如果在这次请求中该类被require多次，那么依然还是用同一个实例返回

Scope可以全局配置，通过defaultScope参数传参进去，也可以针对每个类进行区别配置，使用方法是：

```js
container.bind<Shuriken>("Shuriken").to(Shuriken).inTransientScope(); // Default
container.bind<Shuriken>("Shuriken").to(Shuriken).inSingletonScope();
container.bind<Shuriken>("Shuriken").to(Shuriken).inRequestScope();
```

3. typescript中的装饰器

InversifyJS用了依赖注入（DI）的方式，优雅的实现了注册过程。这里有2个非常重要的装饰器函数injectable和inject。前者将模块信息注册到IoC容器里，后者则通过属性注入（也可以通过构造函数注入）建立模块间的依赖关系。

装饰器可以看 ：[ES6入门：装饰器](https://es6.ruanyifeng.com/#docs/decorator)和[TS-装饰器](https://www.tslang.cn/docs/handbook/decorators.html)

我们都知道 Reflect 全局对象和 Proxy 对象一样，也是 ES6 为了操作对象而提供的新 API。而 Reflect Metadata 是 ES7 的一个提案，它主要用来在声明的时候为类与类属性添加和读取元信息。而之所以用Metadata这种方式保存相关信息，可以理解为是避免了对目标模块的侵入和污染。Reflect Metadata 利用健值对对元信息的保存，本质上也是一种WeakMap的映射，但在数据结构上会有更多的设计。InversifyJS的依赖注入就是通过结合Reflect Metadata和装饰器函数来实现的。

Reflect Metadata相关方法并不是标准的API，而是由引入的reflect-metadata库提供的扩展能力。

reflect-metadata 拆成两个单词，reflect 反射和 metadata，通俗理解利用反射的原理修改元数据。元数据就是配置数据的数据，reflect-metadata 利用反射的原理通过key、value的形式给对象、对象属性设置数据，从而不改变其数据结构。

Metadata也被称为“元信息”，通常是指需要隐藏在程序内部的与业务逻辑无关的附加信息。TypeScript 在 1.5+ 的版本已经支持它：

* 安装：npm i reflect-metadata --save
* 配置tsconfig.json：emitDecoratorMetadata: true Reflect Metadata 的 API 可以用于类或者类的属性上：
* 通过Reflect.getMetadata("design:type", target, key)，装饰器函数能获取属性类型
* 通过Reflect.getMetadata("design:paramtypes", target, key)可以获取函数参数类型
* 通过Reflect.getMetadata("design:returntype", target, key)可以获取返回值类型
* 通过Reflect.defineMetadata("keyName", "value", target, key)可自定义 metadataKey和值，并在合适的时机获取它的值

### 声明接口和类型

```js
interface Warrior {
    fight(): string;
    sneak(): string;
}

interface Weapon {
    hit(): string;
}

interface ThrowableWeapon {
    throw(): string;
}

export {
    Warrior,
    Weapon,
    ThrowableWeapon
}
```

Inversifyjs 需要在运行时使用类型标记作为标识符，在非常大型的应用程序里，字符串作为类型标识被 InversifyJS 注入，会导致命名冲突。 InversifyJS 支持和推荐使用 Symbol 而不是字符串字面量。

```js
// file types.ts

const TYPES = {
    Warrior: Symbol.for("Warrior"),
    Weapon: Symbol.for("Weapon"),
    ThrowableWeapon: Symbol.for("ThrowableWeapon")
};

export { TYPES };
```

### 使用 @injectable 和 @inject 装饰器声明依赖
声明一些类，实现刚刚声明接口。他们都需要使用 @injectable 装饰器去注解。

当一个类依赖于某个接口时，我们也需要使用 @inject 装饰器，来定义在运行时可用的接口标识。在这种情况下，我们将使用 Symbol, 如 Symbol.for("Weapon") 和 Symbol.for("ThrowableWeapon") 作为运行时的标识。

```js
import { injectable, inject } from "inversify";
import "reflect-metadata";
import { Weapon, ThrowableWeapon, Warrior } from "./interfaces"
import { TYPES } from "./types";

@injectable()
class Katana implements Weapon {
    public hit() {
        return "cut!";
    }
}

@injectable()
class Shuriken implements ThrowableWeapon {
    public throw() {
        return "hit!";
    }
}

@injectable()
class Ninja implements Warrior {

    @inject(TYPES.Weapon)
    private katana: Weapon;
    
    @inject(TYPES.ThrowableWeapon)
    private shuriken: ThrowableWeapon;

    public fight() { return this.katana.hit(); }
    public sneak() { return this.shuriken.throw(); }

}

export { Ninja, Katana, Shuriken };
```

### 创建和配置容器

在命名为 inversify.config.ts 的文件中创建和配置容器。这是唯一有耦合的地方。 在项目其余部分中的类，不应该包含对其他类的引用。

```js
import { Container } from "inversify";
import { TYPES } from "./types";
import { Warrior, Weapon, ThrowableWeapon } from "./interfaces";
import { Ninja, Katana, Shuriken } from "./entities";

const myContainer = new Container();
myContainer.bind<Warrior>(TYPES.Warrior).to(Ninja);
myContainer.bind<Weapon>(TYPES.Weapon).to(Katana);
myContainer.bind<ThrowableWeapon>(TYPES.ThrowableWeapon).to(Shuriken);

export { myContainer };
```

### 解析依赖

使用方法 `get<T>` 从 Container 中获得依赖。

```js
import { myContainer } from "./inversify.config";
import { TYPES } from "./types";
import { Warrior } from "./interfaces";

const ninja = myContainer.get<Warrior>(TYPES.Warrior);

console.log(ninja.fight());
```

## inversify常见用法

### @postConstruct 
该装饰器通常应用于类中的某个方法。这个装饰器将在一个对象被实例化之后调用， 当构造器已经被调用但是组件还没有初始化或者你想在构造器被调用后执行一个初始化逻辑时。该方法在该对象被用作单例时的生命周期里只会被调用一次，而且不能在同一个类上使用多个 @postConstruct 装饰器，会报错。

```js
@injectable()
class Ninja {
    constructor() {
        
    }

    @postConstruct()
    public init() {
        console.log("init")
    }
}
```

### @Named
当有两个或者更多具体实现被绑定到同一个抽象时，会报“Error: Ambiguous match found for serviceIdentifier”错误，我们可以用命名绑定来修复模糊匹配的错误，记得绑定时使用whenTargetNamed。

```js
@injectable()
class Ninja implements Ninja {
    public katana: Weapon;
    public shuriken: Weapon;
    public constructor(
        @inject("Weapon") @named("strong")katana: Weapon,
        @inject("Weapon") @named("weak") shuriken: Weapon
    ) {
        this.katana = katana;
        this.shuriken = shuriken;
    }
}

container.bind<Weapon>("Weapon").to(Katana).whenTargetNamed("strong");
container.bind<Weapon>("Weapon").to(Shuriken).whenTargetNamed("weak");
```

## 参考文章

* [应用前端的IoC框架——InversifyJS](https://juejin.cn/post/6951269906629427236)
* [Inversify源码浅析](https://zhuanlan.zhihu.com/p/73771486)
* [Theia之inversify](https://juejin.cn/post/6971722030831894542)
* [掌握 JS 高级编程基础 - Reflect Metadata](https://developer.aliyun.com/article/792498#slide-9)