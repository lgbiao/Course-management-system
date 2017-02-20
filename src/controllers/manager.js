import { Manager } from '../models'

export function showRegister(req, res, next) {
  res.render('register.html')
}

export function showLogin(req, res, next) {
  res.render('login.html')
}

export function doRegister(req, res, next) {
  const { username, password, email } = req.body
  Manager
    .findOne({
      username
    })
    .then(result => {
      if (result) {
        return res.json({
          err_code: 1,
          message: '用户名被占用'
        })
      }
      const manager = new Manager({
        username,
        password,
        email
      })
      return manager.save()
    })
    .then(result => {
      res.json({
        err_code: 0
      })
    })
    .catch(err => {
      next(err)
    })
}

export function doLogin(req, res, next) {
  const { username, password } = req.body
  Manager
    .findOne({
      username: username
    })
    .then(manager => {
      // 校验用户是否存在
      if (!manager) {
        return res.json({
          err_code: 1,
          message: '用户名或密码不正确'
        })
      }

      // 校验密码是否正确
      if (password !== manager.password) {
        return res.json({
          err_code: 1,
          message: '用户名或密码不正确'
        })
      }

      // 登陆成功，通过 Session 记录登陆状态
      req.session.manager = manager
      // req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 3 // 设置当前客户端登陆过期时间
      // req.setSession('manager', manager)

      // 登陆成功
      res.json({
        err_code: 0
      })
    })
}

export function logout(req, res, next) {
  // 1. 清除登陆状态
  req.session.manager = null
  // 2. 跳转到登陆页
  res.redirect('/login')
}
