import request from '@/utils/request';

// 获取 spu 数据
// GET /admin/product/{page}/{limit}
export const reqGetSpuList = (page, limit, category3Id) => {
  return request({
    url: `/admin/product/${page}/${limit}`,
    method: 'GET',
    params: { category3Id }
  })
}

// 获取 spu 基本信息
// GET /admin/product/getSpuById/{spuId}
export const reqGetSpu = spuId => {
  return request({
    url: `/admin/product/getSpuById/${spuId}`,
    method: 'GET'
  })
}

// 获取品牌信息
// GET /admin/product/baseTrademark/getTrademarkList
export const reqGetTradeMark = () => {
  return request({
    url: '/admin/product/baseTrademark/getTrademarkList',
    method: 'GET'
  })
}

// 获取 spu 图片信息
// GET /admin/product/spuImageList/{spuId}
export const reqGetSpuImage = spuId => {
  return request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: 'GET'
  })
}

// 获取平台全部销售属性
// GET /admin/product/baseSaleAttrList
export const reqGetBaseSaleAttr = () => {
  return request({
    url: '/admin/product/baseSaleAttrList',
    method: 'GET'
  })
}

// 添加|修改 spu
// POST /admin/product/saveSpuInfo
// POST /admin/product/updateSpuInfo
export const reqAddOrUpdateSpu = spu => {
  if (spu.id) {
    return request({url:'/admin/product/updateSpuInfo',method:'POST',data:spu})
  } else {
    return request({url:'/admin/product/saveSpuInfo',method:'POST',data:spu})
  }
}

// 删除 spu
// DELETE /admin/product/deleteSpu/{spuId}
export const reqDeleteSpu = spuId => {
  return request({
    url: `/admin/product/deleteSpu/${spuId}`,
    method: 'DELETE'
  })
}

// 获取销售属性
// GET /admin/product/spuSaleAttrList/{spuId}
export const reqGetSaleAttr = spuId => {
  return request({
    url: `/admin/product/spuSaleAttrList/${spuId}`,
    method: 'GET'
  })
}

// 获取sku平台属性
// GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqGetAttrInfo = categoryId => {
  const { category1Id,category2Id,category3Id } = categoryId;
  return request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'GET'
  })
}

// 添加 sku
// POST /admin/product/saveSkuInfo
export const reqAddSku = skuInfo => {
  return request({
    url: '/admin/product/saveSkuInfo',
    method: 'POST',
    data: skuInfo
  })
}

// 获取 sku 列表数据
// GET /admin/product/findBySpuId/{spuId}
export const reqGetSkuList = spuId => {
  return request({
    url: `/admin/product/findBySpuId/${spuId}`,
    method: 'GET'
  })
}
