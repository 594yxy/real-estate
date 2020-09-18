// eslint-disable-next-line
import {
  UserLayout,
  BasicLayout,
  BlankLayout
} from '@/layouts'

const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view')
}

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: {
      title: '首页'
    },
    redirect: '/system/user',
    children: [

      // business
      {
        path: '/business',
        name: 'business',
        component: RouteView,
        redirect: '/business/list',
        meta: {
          title: '业务管理',
          icon: 'solution',
          permission: ['permission']
        },
        children: [{
          path: '/business/list',
          name: 'BusinessList',
          component: () => import('@/views/business/list/index'),
          meta: {
            title: '我的业务',
            keepAlive: true,
            permission: ['table']
          }
        }, {
          path: '/business/list/add',
          name: 'BusinessListAdd',
          component: () => import('@/views/business/form/index'),
          meta: {
            title: '新建业务',
            keepAlive: true,
            permission: ['form']
          }
        }]
      },

      // system
      {
        path: '/system',
        name: 'system',
        component: RouteView,
        redirect: '/system/user',
        meta: {
          title: '系统设置',
          icon: 'setting',
          permission: ['permission']
        },
        children: [{
          path: '/system/user',
          name: 'user',
          component: () => import('@/views/system/user/index'),
          meta: {
            title: '用户管理',
            keepAlive: true,
            permission: ['table']
          }
        }]
      },

      // account
      {
        path: '/account',
        component: RouteView,
        hidden: true,
        redirect: '/account/settings',
        name: 'account',
        meta: {
          title: '个人页',
          icon: 'user',
          keepAlive: true,
          permission: ['user']
        },
        children: [{
          path: '/account/settings',
          name: 'settings',
          component: () => import('@/views/account/settings/Index'),
          meta: {
            title: '个人资料',
            hideHeader: true,
            permission: ['user']
          },
          redirect: '/account/settings/base',
          hideChildrenInMenu: true,
          children: [{
              path: '/account/settings/base',
              name: 'BaseSettings',
              component: () => import('@/views/account/settings/BaseSetting'),
              meta: {
                title: '基本设置',
                hidden: true,
                permission: ['user']
              }
            },
            {
              path: '/account/settings/security',
              name: 'SecuritySettings',
              component: () => import('@/views/account/settings/Security'),
              meta: {
                title: '安全设置',
                hidden: true,
                keepAlive: true,
                permission: ['user']
              }
            },
            {
              path: '/account/settings/notification',
              name: 'NotificationSettings',
              component: () => import('@/views/account/settings/Notification'),
              meta: {
                title: '新消息通知',
                hidden: true,
                keepAlive: true,
                permission: ['user']
              }
            }
          ]
        }]
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [{
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [{
        path: 'login',
        name: 'login',
        component: () => import( /* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import( /* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import( /* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/404',
    component: () => import( /* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]