import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'basic-layout',
    component: () => import('../layouts/basic.vue'),
    children: [
      {
        path: '',
        name: 'login',
        beforeEnter: (to, _, next) => {
          if (to.query.redirect) {
            return next(to.query.redirect.toString() || '/')
          }
          return next()
        },
        props: route => ({ backUrl: route.query['backUrl'] }),
        component: () => import('../pages/login.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    redirect: { name: '404' },
  },
]

export default routes
