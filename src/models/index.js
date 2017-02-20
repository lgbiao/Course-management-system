import mongoose from 'mongoose'
import Manager from './manager'
import Advert from './advert'
import Course from './course'

mongoose.connect('mongodb://localhost/edu')

export { 
  Manager,
  Advert,
  Course
}

// 通过 export default 暴露的接口对象，无法直接使用 import 解构赋值加载
// export default {
//   Manager,
//   Advert
// }
