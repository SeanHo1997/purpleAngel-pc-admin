import { createRouter, createWebHashHistory } from 'vue-router'

const cosntantRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login/index.vue'),
    meta: { title: '登录' }
  },
  { path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('../views/404/index.vue'),
    meta: { title: '404' }
  },
  {
    path: '',
    component: () => import('@/views/layout/index.vue'),
    children: [
      {
        path: '',
        name: '',
        component: () => import('@/views/index/index.vue'),
        meta: { title: '首页' }
      }
    ]
  }
]

const asyncRoutes = [
  {
    path: '',
    component: () => import('@/views/layout/index.vue'),
    children: [
      {
        path: '/goods/list',
        name: '/goods/list',
        component: () => import('@/views/Goods/index.vue'),
        meta: { title: '商品管理' }
      },
      {
        path: '/category/list',
        name: '/category/list',
        component: () => import('@/views/Category/index.vue'),
        meta: { title: '分类管理 ' }
      },
      {
        path: '/user/list',
        name: '/user/list',
        component: () => import('@/views/User/index.vue'),
        meta: { title: '用户管理 ' }
      },
      {
        path: '/order/list',
        name: '/order/list',
        component: () => import('@/views/Orders/index.vue'),
        meta: { title: '订单管理 ' }
      },
      {
        path: '/comment/list',
        name: '/comment/list',
        component: () => import('@/views/GoodsComment/index.vue'),
        meta: { title: '评论管理 ' }
      },
      {
        path: '/image/list',
        name: '/image/list',
        component: () => import('@/views/ImageMaterial/index.vue'),
        meta: { title: '图库管理 ' }
      },
      {
        path: '/notice/list',
        name: '/notice/list',
        component: () => import('@/views/Notification/index.vue'),
        meta: { title: '公告' }
      },
      {
        path: '/setting/base',
        name: '/setting/base',
        component: () => import('@/views/Setting/index.vue'),
        meta: { title: '配置' }
      },
      {
        path: '/coupon/list',
        name: '/coupon/list',
        component: () => import('@/views/Coupon/index.vue'),
        meta: { title: '优惠券管理' }
      },
      {
        path: '/manager/list',
        name: '/manager/list',
        component: () => import('@/views/Manager/index.vue'),
        meta: { title: '管理员设置' }
      },
      {
        path: '/access/list',
        name: '/access/list',
        component: () => import('@/views/Access/index.vue'),
        meta: { title: '权限管理' }
      },
      {
        path: '/role/list',
        name: '/role/list',
        component: () => import('@/views/Role/index.vue'),
        meta: { title: '角色管理' }
      },
      {
        path: '/skus/list',
        name: '/skus/list',
        component: () => import('@/views/Skus/index.vue'),
        meta: { title: '规格管理' }
      },
      {
        path: '/level/list',
        name: '/level/list',
        component: () => import('@/views/Level/index.vue'),
        meta: { title: '会员等级' }
      },
      {
        path: '/comment/list',
        name: '/comment/list',
        component: () => import('@/views/GoodsComment/index.vue'),
        meta: { title: '评论管理' }
      },
      {
        path: '/setting/buy',
        name: '/setting/buy',
        component: () => import('@/views/PaySetting/index.vue'),
        meta: { title: '交易设置' }
      },
      {
        path: '/setting/ship',
        name: '/setting/ship',
        component: () => import('@/views/ShipSetting/index.vue'),
        meta: { title: '物流设置' }
      },
      {
        path: '/distribution/index',
        name: '/distribution/index',
        component: () => import('@/views/Distribution/index.vue'),
        meta: { title: '分销员管理' }
      },
      {
        path: '/distribution/setting',
        name: '/distribution/setting',
        component: () => import('@/views/DistributionSetting/index.vue'),
        meta: { title: '分销设置' }
      }
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...cosntantRoutes, ...asyncRoutes]
})


export default router

export const addAsyncRoutes = (menus, asyncroutes) => {
  menus.forEach(menu => {
    const route = asyncRoutes.find(route => route.path === menu.frontPath)
    if (route && !router.hasRoute(route)) {
      router.addRoute(route)
    }
    // 递归查找
    if (menu.child && menu.child.length) {
      addAsyncRoutes(menu.child)
    }
  })
}
