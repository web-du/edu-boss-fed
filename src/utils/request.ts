import axios from 'axios'
import qs from 'qs'

const request = axios.create({

})

// 请求拦截器
request.interceptors.request.use(function (config) {
  console.log(config, '请求拦截器config')
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
