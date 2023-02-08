const state = {
  tableIndexWidth: '',
  paginationLayout: '',
  paginationCount: 0,
  buttonSize: '',
  logoWidth: '',
  attrValueWdith: '',
  spuWidth: '',
  skuWidth: '',
  skuListWidth: '',
  skuImgWidth: '',
  skuDrawerSize: '',
  skuDrawerImgWidth: '',
  dashboardTableWidth: '',
  roleWidth: '',
  permissionWidth: '',
}

const mutations = {
  GET_STYLE(state) {
    let root = document.querySelector(':root')
    let cs = getComputedStyle(root)
    state.tableIndexWidth = cs.getPropertyValue('--table-index-width')
    state.paginationLayout = cs.getPropertyValue('--pagepagination-layout')
    state.paginationCount = cs.getPropertyValue('--pagepagination-count') * 1
    state.buttonSize = cs.getPropertyValue('--button-size')
    state.logoWidth = cs.getPropertyValue('--logo-width')
    state.attrValueWdith = cs.getPropertyValue('--attr-value-width')
    state.spuWidth = cs.getPropertyValue('--spu-width')
    state.skuWidth = cs.getPropertyValue('--sku-width')
    state.skuListWidth = cs.getPropertyValue('--sku-list-width')
    state.skuImgWidth = cs.getPropertyValue('--sku-img-width')
    state.skuDrawerSize = cs.getPropertyValue('--sku-drawer-size')
    state.skuDrawerImgWidth = cs.getPropertyValue('--sku-drawer-img-width')
    state.dashboardTableWidth = cs.getPropertyValue('--dashboard-search-table-width')
    state.roleWidth = cs.getPropertyValue('--role-width')
    state.permissionWidth = cs.getPropertyValue('--permission-width')
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}