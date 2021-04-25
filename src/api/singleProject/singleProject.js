import request from '@/utils/request'

// 查询单体工程列表
export function listSingleProject(query) {
  return request({
    url: '/singleProject/list',
    method: 'get',
    params: query
  })
}

export function listSingleProjectTree(query) {
  return request({
    url: '/singleProject/treeselect',
    method: 'get',
    params: query
  })
}

// 查询单体工程详细
export function getSingleProject(id) {
  return request({
    url: '/singleProject/' + id,
    method: 'get'
  })
}

// 新增单体工程
export function addSingleProject(data) {
  return request({
    url: '/singleProject',
    method: 'post',
    data: data
  })
}

// 修改单体工程
export function updateSingleProject(data) {
  return request({
    url: '/singleProject',
    method: 'put',
    data: data
  })
}

// 删除单体工程
export function delSingleProject(id) {
  return request({
    url: '/singleProject/' + id,
    method: 'delete'
  })
}

// 导出单体工程
export function exportSingleProject(query) {
  return request({
    url: '/singleProject/export',
    method: 'get',
    params: query
  })
}