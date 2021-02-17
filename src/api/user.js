import axios from '@/utils/custom-axios'

export const getUsers = (() => {
  return axios.request({
    url: '/api/users',
    method: 'get'
  })
})

export const searchUsers = ((keyword) => {
  return axios.request({
    url: '/api/users',
    params: {
      search: keyword
    },
    method: 'get'
  })
})

export const addUser = ((user) => {
  let url = '/api/users'
  return axios.request({
    url: url,
    data: user,
    method: 'post'
  })
})

export const editUser = ((user) => {
  let url = '/api/users/' + user.id
  return axios.request({
    url: url,
    data: user,
    method: 'patch'
  })
})

export const updateUser = ((user) => {
  let url = '/api/users/' + user.id
  return axios.request({
    url: url,
    data: user,
    method: 'put'
  })
})

export const delUser = ((id) => {
  let url = '/api/users/' + id
  return axios.request({
    url: url,
    method: 'delete'
  })
})

export const getUserRoles = ((id) => {
  let url = '/api/users/' + id + '/roles'
  return axios.request({
    url: url,
    method: 'get'
  })
})

export const updateUserRoles = ((id, data) => {
  let url = '/api/users/' + id + '/roles'
  return axios.request({
    url: url,
    data: data,
    method: 'post'
  })
})

export const deleteUserRole = ((user_id, role_id) => {
  let url = '/api/users/' + user_id + '/roles/' + role_id
  return axios.request({
    url: url,
    method: 'delete'
  })
})

export const updatePassword = ((data) => {
  return axios.request({
    url: '/api/users/' + data.id + '/password',
    data: data,
    method: 'post'
  })
})

export const batchDelUser = ((idList) => {
  let url = '/api/user/batch-delete'
  let data = {ids: idList}
  return axios.request({
    url: url,
    data: data,
    method: 'post'
  })
})