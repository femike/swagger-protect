import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'
import routes from './routes'

const createHistory = import.meta.env['SSR']
  ? createMemoryHistory
  : import.meta.env.VITE_VUE_ROUTER_MODE === 'history'
  ? createWebHistory
  : createWebHashHistory

const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes,
  history: createHistory(
    import.meta.env['SSR'] ? void 0 : import.meta.env.VITE_VUE_ROUTER_API_BASE,
  ),
})

export default router
