import axios from '@/utils/custom-axios'

export const getPermissions = (() => {
  return axios.request({
    url: '/api/permissions',
    method: 'get'
  })
})

export const addPermission = ((data) => {
  let url = '/api/permissions'
  return axios.request({
    url: url,
    data: data,
    method: 'post'
  })
})

export const editPermission = ((data) => {
  let url = '/api/permissions/' + data.id
  return axios.request({
    url: url,
    data: data,
    method: 'patch'
  })
})

export const delPermission = ((id) => {
  let url = '/api/permissions/' + id
  return axios.request({
    url: url,
    method: 'delete'
  })
})
