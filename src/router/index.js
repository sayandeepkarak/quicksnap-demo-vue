import { defineRouter } from '#q-app/wrappers'
import { createRouter, createMemoryHistory, createWebHistory } from 'vue-router'
import routes from './routes'

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER ? createMemoryHistory : createWebHistory // ⬅ force history mode

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  return Router
})
