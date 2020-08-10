import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

  const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/realtors-list',
    name: 'realtors-list',
    component: () => import('../views/Realtors-list.vue')
    
  },
  {
    path: '/realtor-create',
    name: 'realtor-create',
    component: () => import('../views/Realtor-create.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
