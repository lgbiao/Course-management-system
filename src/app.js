import path from 'path'
import express from 'express'
import config from './config'
import nunjucks from 'nunjucks'
import bodyParser from './middlewares/body-parser'
import errLog from './middlewares/error-log'
import cookieParser from 'cookie-parser'
import session from './middlewares/session'
import mountRouter from './middlewares/mount-router'
// import session from 'express-session'

const app = express()

app.use('/node_modules', express.static(config.node_modules_path))
app.use('/public', express.static(config.public_path))

// 配置使用 nunjucks 模板引擎
// nunjucks 模板引擎没有对模板文件名的后缀名做特定限制
// 如果文件名是 a.html 则渲染的时候就需要传递 a.html
// 如果文件名是 b.nujs 则传递 b.nujs
// nunjucks 模板引擎默认会缓存输出过的文件
// 这里为了开发方便，所以把缓存禁用掉，可以实时的看到模板文件修改的变化
nunjucks.configure(config.viewPath, {
  autoescape: true,
  express: app,
  noCache: true
})

// 挂载解析表单 POST 请求体中间件
app.use(bodyParser)

// 挂载 cookie-parser 中间件：专门用来处理对 cookie 的操作的
// cookie-parser 中间件做两件事儿：
//    req.cookies 通过该中间件会自动将当前请求报文中的 cookie 解析为一个对象挂载到 req.cookies 属性上
//    res.cookie(name, value) 通过 res.cookie 可以向当前请求客户端发送 cookie 数据
app.use(cookieParser())

/**
 * 配置挂载处理 Session 的中间件
 * 只要配置了该中间件，在 request 请求对象上会增加一个属性 req.session
 * req.session 会自动根据当前请求客户端中携带的 Session-key 找到对应的存储数据对象
 * Set：req.session.key = value
 * Get：req.session.key
 */
// app.use(session({
//   secret: 'itcast',
//   resave: false,
//   saveUninitialized: true
// }))

// 挂载自己写的 Session 处理中间件
app.use(session({
  sidName: 'itcast_sid'
}))

// 配置自动挂载路由
mountRouter.configure(path.join(__dirname, 'routes'), {
  express: app
})

app.use((req, res, next) => {
  res.end('404')
})

// 获取所有路由的模块标识
// 循环所有标识，调用 app.use(router)

// 挂载全局错误处理中间件
app.use(errLog)

app.listen(3000, () => {
  console.log('server is running at port 3000...')
})
