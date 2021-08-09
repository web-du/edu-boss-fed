import axios from 'axios'
import qs from 'qs'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'

const request = axios.create({

})

function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

function refreshToken () {
  return axios.create()({
    method: 'POST',
    url: '/front/user/refresh_token',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify({
      // refresh_token 只能使用1次
      refreshtoken: store.state.user.refresh_token
    })
  })
}

// 请求拦截器
request.interceptors.request.use(function (config) {
  console.log('请求拦截成功', config)

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
  console.log('请求拦截失败', error)
  console.dir(error)
  // Do something with request error
  return Promise.reject(error)
})
let isRfreshing = false // 控制刷新 token 的状态
let requests: any[] = [] // 存储刷新 token 期间过来的 401 请求
request.interceptors.response.use(function (response) { // 状态码为 2xx 都会进入这里
  console.log('响应拦截成功 => ', response)
  // 如果是自定义错误状态码，错误处理就写到这里
  return response
}, async function (error) { // 超出 2xx 状态码都都执行这里
  console.log('响应拦截失败 => ', error)
  console.dir(error)
  if (error.response) {
    // 请求发出去收到响应了，但是状态码超出了 2xx 范围
    const { status } = error.response
    if (status === 400) {
      Message.error(`请求参数错误[${status}]`)
    } else if (status === 401) {
      // token 无效（没有提供 token、token 是无效的、token 过期了）
      if (!store.state.user) {
        redirectLogin()
        return Promise.reject(error)
      }
      if (!isRfreshing) {
        isRfreshing = true
        return refreshToken().then(res => {
          if (!res.data.success) {
            throw new Error('刷新Token失败')
          }
          requests.forEach(cb => cb())
          requests = []
          store.commit('setUser', res.data.content)
          return request(error.config)
        }).catch(err => {
          // 刷新token失败
          store.commit('setUser', null)
          redirectLogin()
          return Promise.reject(err)
        }).finally(() => {
          isRfreshing = false
        })
      }
      new Promise((resolve) => {
        requests.push(() => {
          resolve(request(error.config))
        })
      })
    } else if (status === 403) {
      Message.error(`没有权限，请联系管理员[${status}]`)
    } else if (status === 404) {
      Message.error(`请求资源不存在[${status}]`)
    } else if (status >= 500) {
      Message.error(`服务端错误，请联系管理员[${status}]`)
    }
  } else if (error.request) {
    // 请求发出去没有收到响应
    Message.error('请求超时，请刷新重试')
  } else {
    // 在设置请求时发生了一些事情，触发了一个错误
    Message.error(`请求失败：${error.message}`)
  }
  // 把请求失败的错误对象继续抛出，扔给上一个调用者
  return Promise.reject(error)
})

export default request
