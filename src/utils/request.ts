import axios from 'axios'
import qs from 'qs'
import store from '@/store'

const request = axios.create({

})

// 请求拦截器
request.interceptors.request.use(function (config) {
  console.log(config, '请求拦截器config')

  // 我们就在这里通过改写 config 配置信息来实现业务功能的统一处理
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  if (config.headers['content-type'] === 'application/x-www-form-urlencoded') {
    config.data = qs.stringify(config.data)
  }
  // 注意：这里一定要返回 config，否则请求就发不出去了
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

export default request
