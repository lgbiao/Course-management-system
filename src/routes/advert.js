import express from 'express'
import { Advert } from '../models'
import formidable from 'formidable'
import config from '../config'
import { basename } from 'path'
import moment from 'moment'

const router = express.Router()

router.get('/advert/count', (req, res, next) => {
  Advert.count((err, count) => {
    if (err) {
      return next(err)
    }
    res.json({
      err_code: 0,
      result: count
    })
  })
})

router.get('/advert', (req, res, next) => {
  res.render('advert_list.html', {
    foo: 'bar'
  })
})

router.get('/advert/add', (req, res, next) => {
  res.render('advert_add.html')
})

/**
 * POST /advert/add
 * body: { title, image, link, start_time, end_time }
 */
router.post('/advert/add', (req, res, next) => {

  pmFormidable(req)
    .then((result) => {
      const [fields, files] = result
      const body = fields // 普通表单字段
      body.image = basename(files.image.path) // 这里解析提取上传的文件名，保存到数据库
      const advert = new Advert({
        title: body.title,
        image: body.image,
        link: body.link,
        start_time: body.start_time,
        end_time: body.end_time,
      })
      return advert.save()
    })
    .then(result => {
      res.json({
        err_code: 0
      })
    })
    .catch(err => {
      next(err)
    })
})

router.get('/advert/list', (req, res, next) => {
  let { page, pageSize } = req.query
  page = Number.parseInt(page)
  pageSize = Number.parseInt(pageSize)

  Advert
    .find()
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .exec((err, adverts) => {
      if (err) {
        return next(err)
      }
      res.json({
        err_code: 0,
        result: adverts
      })
    })
})

router.get('/advert/available', (req, res, next) => {
  // 把当前时间大于等于开始时间和小于等于结束时间的数据查询出来
  Advert
    .find()
    .where('start_time').lt(new Date())
    .where('end_time').gt(new Date())
    .exec()
    .then(result => {
      res.json({
        err_code: 0,
        result: result
      })
    })
    .catch(err => {
      next(err)
    })
})

// /advert/one/:advertId 是一个模糊匹配路径
// 可以匹配 /advert/one/* 的路径形式
// 例如：/advert/one/1 /advert/one/2 /advert/one/a /advert/one/abc 等路径
// 但是 /advert/one 或者 /advert/one/a/b 是不行的
// 至于 advertId 是自己起的一个名字，可以在处理函数中通过 req.params 来进行获取
router.get('/advert/one/:advertId', (req, res, next) => {
  Advert.findById(req.params.advertId, (err, result) => {
    if (err) {
      return next(err)
    }
    res.json({
      err_code: 0,
      result: result
    })
  })
})

// /advert/edit
// id 可以通过查询字符串进行传递 post /advert/edit?id=xxx req.query.id req.query永远是通过查询字符串来获取数据的
// id 也可以通过路径进行传递 /advert/edit/:advertId req.params.advertId req.params 永远是通过路径参数来获取数据
// id 也可以通过表单请求体传递 req.body.id req.body永远是通过表单 POST 请求体来获取数据的
router.post('/advert/edit', (req, res, next) => {
  const body = {}
  pmFormidable(req)
    .then(result => {
      body.fields = result[0]
      body.files = result[1]
      return Advert.findById(body.fields.id)
    })
    .then(advert => {
      // 我需要在当前的 then 中获取到上一个 then 里面某个数据
      advert.title = body.fields.title

      // advert.image = body.image 如果用户选择了新的文件，则使用新的，如果用户没有选择新文件，则使用原来的
      advert.link = body.fields.link
      advert.start_time = body.fields.start_time
      advert.end_time = body.fields.end_time
      advert.last_modified = Date.now()

      // 如果本次提交上传的文件大小不为 0 ，说明用户上传了新的文件
      if (body.files.image.size !== 0) {
        advert.image = basename(body.files.image.path)
      }

      return advert.save()
    })
    .then(result => {
      res.json({
        err_code: 0
      })
    })
    .catch(err => {
      next(err)
    })
})

router.get('/advert/remove/:advertId', (req, res, next) => {
  Advert.remove({ _id: req.params.advertId }, err => {
    if (err) {
      return next(err)
    }
    res.json({
      err_code: 0
    })
  })
})

router.get('/advert/edit/:advertId', (req, res, next) => {
  Advert
    .findOne({
      _id: req.params.advertId
    })
    .then(result => {
      res.render('advert_edit.html', {
        advert: result,
        moment: moment // 这里直接将 moment 传递模板引擎中，这样就可以在模板引擎中直接使用 moment 时间处理函数了
      })
    })
    .catch(err => {
      next(err)
    })
})

function pmFormidable(req) {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm()
    form.uploadDir = config.uploadDir // 配置 formidable 文件上传接收路径
    form.keepExtensions = true // 配置保持文件原始的扩展名
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err)
      }
      resolve([fields, files])
    })
  })
}

export default router
