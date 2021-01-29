import request from '@/utils/request'

export function findDoc(data) {
  return request({
    url: '/doc/list',
    method: 'get',
    params: data
  })
}

export function insertDoc(data) {
  return request({
    url: '/doc/insertDoc',
    method: 'post',
    params: data,
    dataType: 'json',
    data: JSON.stringify(data),
    headers: {
      'content-Type': 'application/json;',
    }
  })
}

export function changeDoc(data) {
  return request({
    url: '/doc/changeDocInfo',
    method: 'put',
    data
  })
}

export function docType(data) {
  return request({
    url: '/docTypeDict/list',
    method: 'get',
    params: data
  })
}

export function getSite(data) {
  return request({
    url: '/getSite',
    method: 'get',
    params: data
  })
}

export function toPdfFile(data) {
  return request({
    url: '/doc/toPdfFile',
    method: 'get',
    params: data
  })
}

export function listFolder(proId) {
  return request({
    url: `/document/folder/listFolder?proId=${proId}`,
    method: 'get'
  })
}

export function getFolderInfo(siteId, id) {
  return request({
    url: `/doc/listFolderContent?siteId=${siteId}&urlId=${id}`,
    method: 'get'
  })
}

export function addFolder(data) {
  return request({
    url: "/document/folder",
    method: 'post',
    data:data
  })
}

export function getFolderContent(data) {
  return request({
    url: "/doc/getFolderContent",
    method: 'get',
    params:data
  })
}

export function delFile(id) {
  return request({
    url: `/doc/deleteDocManagement?fileId=${id}`,
    method: 'delete'
  })
}

