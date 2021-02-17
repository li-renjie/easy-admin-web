import axios from '@/utils/custom-axios'
import { getLocalRefreshToken } from '@/utils/user'

/* 
 * token已在custom-axios.js中的请求拦截部分添加至报文头部，这里不再添加token。
 */

export const login = ({ username, password }) => {
  const data = {
    username,
    password
  }
  //这里返回一个Promise，request方法传入一个配置对象，配置项参考axios
  return axios.request({
    url: '/api/user/login',
    data,
    method: 'post'
  })
}

export const logout = (() => {
  return axios.request({
    url: '/api/user/logout',
    method: 'post'
  })
})

export const getToken = ({ username, password }) => {
  const data = {
    username,
    password
  }
  return axios.request({
    url: '/api/token',
    data: data,
    method: 'post'
  })
}

export const getNewToken = (() => {
  const data = {
    refresh: getLocalRefreshToken()
  }
  return axios.request({
    url: '/api/token/refresh',
    data: data,
    method: 'post'
  })
})

export const getUserInfo = (() => {
  return axios.request({
    url: '/api/userinfo',
    method: 'get'
  })
})
