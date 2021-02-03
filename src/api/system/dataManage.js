import request from '@/utils/request'

export function findDoc(data) {
  return request({
    url: '/docback/list',
    method: 'get',
    params: data
  })
}

export function insertDoc(data) {
  return request({
    url: '/docback/insertDoc',
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
    url: '/docback/changeDocInfo',
    method: 'put',
    data
  })
}

export function docType(data) {
  return request({
    url: '/docTypeDictback/list',
    method: 'get',
    params: data
  })
}

export function getSite(data) {
  return request({
    url: '/getSiteback',
    method: 'get',
    params: data
  })
}

export function toPdfFile(data) {
  return request({
    url: '/docback/toPdfFile',
    method: 'get',
    params: data
  })
}

export function listFolder(proId) {
  return request({
    url: `/documentback/folder/listFolder?proId=${proId}`,
    method: 'get'
  })
}

export function getFolderInfo(siteId, id, taskId) {
  return request({
    url: `/docback/listFolderContent?siteId=${siteId}&urlId=${id}&taskId=${taskId}`,
    method: 'get'
  })
}

export function addFolder(data) {
  return request({
    url: "/documentback/folder",
    method: 'post',
    data:data
  })
}

export function getFolderContent(data) {
  return request({
    url: "/docback/getFolderContent",
    method: 'get',
    params:data
  })
}

export function delFile(id) {
  return request({
    url: `/docback/deleteDocManagement?fileId=${id}`,
    method: 'delete'
  })
}

