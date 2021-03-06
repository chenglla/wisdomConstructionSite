import request from '@/utils/request'

// 查询部门列表
export function listBanzu(query) {
  return request({
    url: '/peopleback/teams/listnew',
    method: 'get',
    params: query
  })
}

export function addBanzu(data) {
    return request({
      url: '/peopleback/teams',
      method: 'post',
      data: data
    })
}

export function updateBanzu(data) {
    return request({
      url: '/peopleback/teams',
      method: 'put',
      data: data
    })
}

export function delBanzu(id) {
    return request({
      url: '/peopleback/teams/' + id,
      method: 'delete'
    })
}

export function getBanzuTree(data) {
    return request({
      url: '/peopleback/teams/tree',
      method: 'get',
      params: data
    })
}

export function getGangwei(data) {
    return request({
      url: '/peopleback/profession/list',
      method: 'get',
      params: data
    })
}


export function getDetail(classId) {
    return request({
      url: `/peopleback/teams/info/${classId}`,
      method: 'get'
    })
}