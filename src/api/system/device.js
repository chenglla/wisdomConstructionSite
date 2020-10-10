import request from '@/utils/request'

// 查询支持设备列表
export function listDevice(query) {
  return request({
    url: '/device/sysDev/list',
    method: 'get',
    params: query
  })
}

// 查询支持设备详细
export function getDevice(id) {
  return request({
    url: '/system/device/' + id,
    method: 'get'
  })
}

// 新增支持设备
export function addDevice(data) {
  return request({
    url: '/system/device',
    method: 'post',
    data: data
  })
}

// 修改支持设备
export function updateDevice(data) {
  return request({
    url: '/system/device',
    method: 'put',
    data: data
  })
}

// 删除支持设备
export function delDevice(id) {
  return request({
    url: '/system/device/' + id,
    method: 'delete'
  })
}

// 导出支持设备
export function exportDevice(query) {
  return request({
    url: '/system/device/export',
    method: 'get',
    params: query
  })
}
