import request from '@/utils/request';

// 获取品牌管理列表的接口
// GET /admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList = (page, limit) => {
  return request({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: 'GET'
  })
}

// -添加品牌
// POST /admin/product/baseTrademark/save
// data: {logoUrl, tmName}
// -修改品牌
// PUT /admin/product/baseTrademark/update
// data: {id, logoUrl, tmName}
export const reqAddorUpdateTradeMark = (data) => {
  if (data.id) {
    // 修改品牌
    return request({
      url: '/admin/product/baseTrademark/update',
      method: 'PUT',
      data
    })
  } else {
    // 添加品牌
    return request({
      url: '/admin/product/baseTrademark/save',
      method: 'POST',
      data
    })
  }
}

// 删除品牌
// DELETE /admin/product/baseTrademark/remove/{id}
export const reqRemoveTradeMark = (id) => {
  return request({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: 'DELETE'
  })
}