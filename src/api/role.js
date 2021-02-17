import axios from '@/utils/custom-axios'

export const getRoles = (() => {
  return axios.request({
    url: '/api/roles',
    method: 'get'
  })
})

export const addRole = ((data) => {
  let url = '/api/roles'
  return axios.request({
    url: url,
    data: data,
    method: 'post'
  })
})

export const editRole = ((data) => {
  let url = '/api/roles/' + data.id
  return axios.request({
    url: url,
    data: data,
    method: 'patch'
  })
})

export const delRole = ((id) => {
  let url = '/api/roles/' + id
  return axios.request({
    url: url,
    method: 'delete'
  })
})

export const getRoleUsers = ((id) => {
  let url = '/api/roles/' + id + '/users'
  return axios.request({
    url: url,
    method: 'get'
  })
})

export const updateRoleUsers = ((id, data) => {
  let url = '/api/roles/' + id + '/users'
  return axios.request({
    url: url,
    data: data,
    method: 'post'
  })
})

export const deleteRoleUser = ((role_id, user_id) => {
  let url = '/api/roles/' + role_id + '/roles/' + user_id
  return axios.request({
    url: url,
    method: 'delete'
  })
})

export const getRolePermissions = ((id) => {
  let url = '/api/roles/' + id + '/permissions'
  return axios.request({
    url: url,
    method: 'get'
  })
})

export const updateRolePermissions = ((id, data) => {
  let url = '/api/roles/' + id + '/permissions'
  return axios.request({
    url: url,
    data: data,
    method: 'post'
  })
})

export const deleteRolePermission = ((role_id, permission_id) => {
  let url = '/api/roles/' + role_id + '/roles/' + permission_id
  return axios.request({
    url: url,
    method: 'delete'
  })
})
