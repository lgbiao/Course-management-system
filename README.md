# 目录结构

```
假如要添加一个课程管理功能：

1. 在 routers 目录中新建一个课程相关的路由模块
   设计路由规则
   根据不同的请求映射到具体的处理函数（在 controllers 目录中）
2. 在 controllers 目录中添加一个专门用来处理课程相关的请求处理模块
   该模块内部提供所有的课程相关的处理方法，导出用来给 routes 使用的
3. 在 models 中添加对应的课程相关的数据模型模块
   导出接口对象，用来给 controllers 使用的
```

## 分页

假设现在集合中有 185 条数据：

- 每页展示 20 条数据
- 共分多少页
  + 185(totalCount) / 20(pageSize) = 10(totalPage)
- 查看某一页数据如何计算（从哪到哪）
- 1 1 20
- 2 21 40
- 3 41 60
- n 从 ((n-1) * 20 + 1) 开始 到 n*20

## npm install 安装源问题

一般一个第三方项目都会存放在 github 上和 npm 上。
github 上的仓库和 npm 上的包，其实都是一个东西，都是一个开发人员推上去的。
有时候会有问题，例如 npm 上的包和 github 源代码仓库中的代码版本不一致，那这个
时候如果需要使用 github 上最新的源代码，则就不要去 npm 上下载了，npm 支持直接
通过 github 源代码仓库进行下载：

```bash
# npm install --save https://github.com/esimakin/twbs-pagination.git
yarn add https://github.com/esimakin/twbs-pagination.git
```

通过这种形式安装下来的包，也会自动放到 node_modules 目录中，同时 package.json 文件中的依赖项变为：

```json
"dependencies": {
    "twbs-pagination": "https://github.com/esimakin/twbs-pagination.git"
  }
```

## Cookie

- [维基百科 - Cookie](https://zh.wikipedia.org/wiki/Cookie)
- [Cookie - 阮一峰](http://javascript.ruanyifeng.com/bom/cookie.html)

### Cookie 的分类

- 会话 Cookie
  + 浏览器开启期间写的没有指定过期时间的 Cookie 就是 会话 Cookie
  + 只要浏览器关闭，则会话Cookie会丢失

- 持久 Cookie
  + 持久 Cookie 可以通过 expires 属性指定过期时间
  + 即便浏览器关闭，只要过期时间不到，则 Cookie 永远不会丢失
  + 除非你手动删除
  + expires 指定一个具体的时间
  + maxAge  指定滑动过期时间

- 清除 cookie
  + 可以通过设置 cookie 的过期时间为过去时间就可以清楚 cookie

### 浏览器操作 Cookie

document.cookie

### Cookie 的应用场景

适用于不太注重安全性的一些功能，一般用来实现以下功能：

- 记住用户名
- 购物车
- 记住我
  + 用户名密码免登陆

### 客户端一些常用操作 Cookie 的库

- https://github.com/carhartl/jquery-cookie
- https://github.com/js-cookie/js-cookie
