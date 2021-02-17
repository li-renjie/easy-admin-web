import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
//import router from '@/router'

axios.defaults.baseURL = process.env.VUE_APP_AXIOS_BASE_URL

let isRefreshing = false    // 标记是否正在刷新 access token

// 请求拦截器
axios.interceptors.request.use(
  config => {
    // Do something before request is sent
    const token = store.state.user.token
    if (token) {
      console.log('token:', token);
      config.headers.Authorization = 'Bearer ' + token
    } else {
      //console.log('没有token，需要登陆')
    }
    return config
  },
  error => {
    // Do something with request error
    return Promise.reject(error)
  })

// 响应拦截器
axios.interceptors.response.use(
  response => {
    // Do something with response data
    // 可以根据响应数据中的code值来做不同的处理（和后端约定）
    // console.log('请求响应数据：', response)
    return response
  },
  error => {
    // Do something with response error
    if (error && error.response) {
      switch (error.response.status) {
        case 400: {
          console.log('请求错误(400)')
          showError('请求错误(400)')
          break
        }
        case 401: {
          console.log('未授权，请重新登录(401)')
          const { config } = error

          // 登录接口返回 401，跳过
          if(error.config.url === '/api/token' ) {
            break
          }

          // 更新 token 接口返回 401，需重新登录
          if (error.config.url.includes('/api/token/refresh')) {
            store.dispatch('resetToken').then(() => {
              location.reload()
            })
            break
          }

          // 尝试更新 token，并重新发起请求
          if (!isRefreshing) {
            isRefreshing = true
            store.dispatch('handleNewToken').then(res => {
              config.headers.Authorization = 'Bearer ' + store.state.user.token
              return axios.request(config)
            }).finally(() => {
              isRefreshing = false
            })
          } else {
            // 正在更新 token，等待后重试
            setTimeout(() => {
              config.headers.Authorization = 'Bearer ' + store.state.user.token
              return axios.request(config)
            }, 1000)
          }
          break
        }
        case 403: {
          console.log('拒绝访问(403)')
          showError('拒绝访问(403)')
          break
        }
        default: {
          console.log(error.response.status)
          showError('请求错误：' + error.response.status)
        }
      }
    } else {
       console.log('连接服务器失败！')
       showError('连接服务器失败！')
    }
    return Promise.reject(error)    //如果用Promise.resolve(err)，则回调中能收到通知
  })

let showError = ((message) => {
  Message({
    message: message,
    type: 'error',
    duration: 3 * 1000
  })
})

export default axios
