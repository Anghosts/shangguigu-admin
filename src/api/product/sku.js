import request from '@/utils/request';

// 获取 sku 列表数据
// GET /admin/product/list/{page}/{limit}
export const reqGetSkuList = (page, limit) => {
  return request({
    url: `/admin/product/list/${page}/${limit}`,
    method: 'GET'
  })
}

// 上架
// GET /admin/product/onSale/{skuId}
export const reqOnSale = skuId => {
  return request({
    url: `/admin/product/onSale/${skuId}`,
    method: 'GET'
  })
}

// 下架
// GET /admin/product/cancelSale/{skuId}
export const reqCancelSale = skuId => {
  return request({
    url: `/admin/product/cancelSale/${skuId}`,
    method: 'GET'
  })
}

// 获取 sku 详情信息
// GET /admin/product/getSkuById/{skuId}
export const reqGetSkuInfo = skuId => {
  return request({
    url: `/admin/product/getSkuById/${skuId}`,
    method: 'GET'
  })
}

// 删除 sku
// DELETE /admin/product/deleteSku/{skuId}
export const reqDeleteSku = skuId => {
  return request({
    url: `/admin/product/deleteSku/${skuId}`,
    method: 'DELETE'
  })
}
