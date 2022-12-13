import request from '@/utils/request';

// 获取一级分类标签
// GET /admin/product/getCategory1
export const reqGetCategoty1 = () => {
  return request({
    url: '/admin/product/getCategory1',
    method: 'GET'
  })
}

// 获取二级分类标签
// GET /admin/product/getCategory2/{category1Id}
export const reqGetCategoty2 = (category1Id) => {
  return request({
    url: `/admin/product/getCategory2/${category1Id}`,
    method: 'GET'
  })
}

// 获取三级分类标签
// GET /admin/product/getCategory3/{category2Id}
export const reqGetCategoty3 = (category2Id) => {
  return request({
    url: `/admin/product/getCategory3/${category2Id}`,
    method: 'GET'
  })
}

// 获取平台属性数据列表
// GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqGetAttrList = (category1Id, category2Id, category3Id) => {
  return request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'GET'
  })
}

// 删除属性
// DELETE /admin/product/deleteAttr/{attrId}
export const reqDeleteAttr = attrId => {
  return request({
    url: `/admin/product/deleteAttr/${attrId}`,
    method: 'DELETE'
  })
}

// 添加属性
// POST /admin/product/saveAttrInfo
/*
{
  attrName: "",
  attrValueList: [
    {
      attrId: 0,
      valueName: ""
    }
  ],
  categoryId: 0,
  categoryLevel: 3,
} 
*/
export const reqSaveAttrInfo = (data) => {
  return request({
    url: '/admin/product/saveAttrInfo',
    method: 'POST',
    data
  })
}