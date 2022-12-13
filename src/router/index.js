import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
]

/**
 * 异步路由
 */
export const asyncRoutes = [
  {
    path: '/product',
    component: Layout,
    redirect: '/product/tradeMark',
    name: 'Product',
    meta: { title: '商品管理', icon: 'el-icon-goods'},
    children: [{
      path: 'trademark',
      name: 'Trademark',
      component: () => import('@/views/product/tradeMark'),
      meta: { title: '品牌管理' }
    }, {
      path: 'attr',
      name: 'Attr',
      component: () => import('@/views/product/Attr'),
      meta: { title: '平台属性管理' }
    }, {
      path: 'spu',
      name: 'Spu',
      component: () => import('@/views/product/Spu'),
      meta: { title: 'Spu管理' }
    }, {
      path: 'sku',
      name: 'Sku',
      component: () => import('@/views/product/Sku'),
      meta: { title: 'Sku管理' }
    }]
  },

  {
    path: '/acl',
    name: 'Acl',
    component: Layout,
    redirect: '/acl/user/list',
    meta: { title: '权限管理', icon: 'el-icon-lock' },
    children: [{
      name: 'User',
      path: 'user/list',
      component: () => import('@/views/Acl/User'),
      meta: { title: '用户管理' },
    }, {
      name: 'Role',
      path: 'role/list',
      component: () => import('@/views/Acl/Role'),
      meta: { title: '角色管理' },
    }, {
      name: 'roleAuth',
      path: 'role/auth/:id',
      component: () => import('@/views/Acl/Role/RoleAuth'),
      meta: { title: '角色授权' },
      hidden: true
    }, {
      name: 'Permission',
      path: 'permission/list',
      component: () => import('@/views/Acl/Permission'),
      meta: { title: '菜单管理' },
    }]

  },
]

/**
 * 任意路由
 */
export const anyRoutes = { path: '*', redirect: '/404', hidden: true }

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  // 权限展示路由功能尚不完善，暂时测试用
  routes: constantRoutes.concat(asyncRoutes, anyRoutes)
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
