import request from '@/utils/request'

export function getList(data) {
  return request({
    url: `/scheduleManageback/supervise/list`,
    method: 'get',
    params: data
  })
}

// 任务方法
export function taskList(data) {
  return request({
    url: `/scheduleback/task/list`,
    method: 'get',
    params: data
  })
}

export function addTask(data) {
  return request({
    url: `/scheduleback/task`,
    method: 'post',
    data: data
  })
}



// 节点方法
export function nodeList(data) {
  return request({
    url: `/scheduleManageback/node/list`,
    method: 'get',
    params: data
  })
}

export function nodeTemplate(data) {
  return request({
    url: `/scheduleManageback/template/list`,
    method: 'get',
    params: data
  })
}

export function getTeamTree(id) {
  return request({
    url: `/people/teams/tree?siteId=${id}`,
    method: 'get'
  })
}

export function broadsideInfo(id) {
  return request({
    url: `/scheduleManageback/node/tree?taskId=${id}`,
    method: 'get'
  })
}

export function addNodeTemplate(data) {
  return request({
    url: `/scheduleManageback/template`,
    method: 'post',
    data: data
  })
}

export function addNode(data) {
  return request({
    url: `/scheduleManageback/node`,
    method: 'post',
    data: data
  })
}

export function putNode(data) {
  return request({
    url: `/scheduleManageback/node`,
    method: 'put',
    data: data
  })
}

export function exportNodeTemplate(data) {
  return request({
    url: `/scheduleManageback/template/export`,
    method: 'get',
    params: data
  })
}

export function exportNodeList(data) {
  return request({
    url: `/scheduleManageback/node/export`,
    method: 'get',
    params: data
  })
}

export function importNodeList(data) {
  return request({
    url: `/scheduleManageback/node/exportNode`,
    method: 'post',
    data: data
  })
}









// 新增支持设备
export function addDevice(data) {
  return request({
    url: '/device/supportDevice',
    method: 'post',
    data: data
  })
}
export function listDevice(query) {
  return request({
    url: '/device/supportDevice/list',
    method: 'get',
    params: query
  })
}

// 修改支持设备
export function updateDevice(data) {
  return request({
    url: '/device/supportDevice',
    method: 'put',
    data: data
  })
}




