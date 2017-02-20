const sessionStorage = {}

export default (options) => {
  return (req, res, next) => {
    const { sidName } = options
    // 当客户端请求过来的时候，先判断一下是否有 sessionid
    // 如果有，则直接跳过去
    // 如果没有，则生成一把钥匙发送给用户
    const sidCookie = req.cookies[sidName]

    // req.getSession = function () {
    //   !sessionStorage[sidCookie] && (sessionStorage[sidCookie] = {})
    //   return sessionStorage[sidCookie]
    // }

    // req.setSession = function (name, value) {
    //   console.log('setSession')
    //   req.getSession()[name] = value
    // }

    // 添加一个属性成员 req.session
    // 作用：用来根据当前请求客户端的 sessionid 对 Session 数据的取值和赋值
    Object.defineProperty(req, 'session', {
      get: function () {
        !sessionStorage[sidCookie] && (sessionStorage[sidCookie] = {})
        return sessionStorage[sidCookie]
      }
    })
    
    // 如果没有 sessionid ，则生成一个，发送给客户端
    if (!sidCookie) {
     res.cookie(sidName, generateSid())
     return next()
    }

    // 如果有 sessionid ，则直接跳过
    next()
  }
}

function generateSid() {
  return `it_${Math.random().toString().substr(2)}cast${Math.random().toString().substr(2)}`
}

// export default (req, res, next) => {

// }
