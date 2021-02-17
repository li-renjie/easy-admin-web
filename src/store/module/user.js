import { login, getToken, getNewToken, getUserInfo, logout } from '@/api/auth'
import {
  setUserName, getUserName, removeUserName,
  setLocalToken, getLocalToken, removeLocalToken,
  getLocalRefreshToken, setLocalRefreshToken, removeLocalRefreshToken
} from '@/utils/user'

export default {
  state: {
    userName: getUserName(),
    email: '',
    avatar: '',
    token: getLocalToken(),
    refreshToken: getLocalRefreshToken(),
    roles: [],          // 用户角色
    permissions: [],    // 用户权限
    hasGetUserInfo: false,
  },
  getters: {
    //
  },
  mutations: {
    setUserName (state, name) {
      state.userName = name
      //localStorage.setItem('username',name);
      setUserName(name)
    },
    removeUserName (state) {
      state.userName = ''
      removeUserName()
    },
    setEmail (state, email) {
      state.userName = email
    },
    setToken (state, token) {
      state.token = token
      setLocalToken(token)
    },
    removeToken (state) {
      state.token = ''
      removeLocalToken()
    },
    setRefreshToken (state, token) {
      state.refreshToken = token
      setLocalRefreshToken(token)
    },
    removeRefreshToken (state) {
      state.refreshToken = ''
      removeLocalRefreshToken()
    },
    setRoles (state, roles) {
      state.roles = roles
    },
    setPermissions (state, permissions) {
      state.permissions = permissions
    },
    setHasGetUserInfo (state, status) {
      state.hasGetUserInfo = status
    }
    
  },
  actions: {
    // 登陆，获取 access token 和 refresh token
    handleLogin ({ commit }, { username, password }) {
      return new Promise((resolve, reject) => {
        getToken({ username, password }).then( res => {
          const data = res.data
          console.log(data)
          if (data.access && data.refresh) {
            commit('setToken', data.access)
            commit('setRefreshToken', data.refresh)
            resolve()
          } else {
            reject('Can not get access token and refresh token in response!')
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取并更新 access token
    handleNewToken ({ commit }) {
      return new Promise((resolve, reject) => {
        getNewToken().then(res => {
          const data = res.data
          if (data.access) {
            commit('setToken', data.access)
            resolve()
          } else {
            reject('Can not get access token in response!')
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 清理 token
    resetToken ({commit}) {
      return new Promise((resolve) => {
        commit('removeToken')
        commit('removeRefreshToken')
        resolve()
      })
    },
    // 获取用户信息
    handleUserInfo ({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(res => {
          const data = res.data
          commit('setUserName', data.username)
          commit('setEmail', data.email)
          commit('setRoles', data.roles)
          commit('setPermissions', data.permissions)
          commit('setHasGetUserInfo', true)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登陆
    handleLogout ({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout().then((res) => {
          commit('removeUserName')
          commit('removeToken')
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },

  }
}
