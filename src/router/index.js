import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)



const router = new VueRouter({
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  },
  routes : [
    {
      path: '/login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/visitor',
      component: () => import('../views/VisitorView.vue')
    },
    {
      path: '/leader/register',
      component: () => import('../views/LeaderRegisterView.vue')
    },
    {
      path: '/referee/register',
      component: () => import('../views/RefereeRegisterView.vue')
    },
    {
      path: '/leader',
      component: () => import('../views/LeaderView.vue')
    },
    {
      path: '/referee',
      component: () => import('../views/RefereeView.vue')
    },
    {
      path: '/admin',
      component: () => import('../views/AdminView.vue')
    },
  ]
})

export default router
