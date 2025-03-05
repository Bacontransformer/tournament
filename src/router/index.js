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
    }
  ]
})

export default router
