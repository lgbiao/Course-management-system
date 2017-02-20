export function showIndex(req, res, next) {
  // 如果用户没有登陆，则让该用户跳转到登陆页面
  if (!req.session.manager) {
    return res.redirect('/login')
  }
  res.render('index.html', {
    manager: req.session.manager
  })
}
