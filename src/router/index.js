import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const router = new VueRouter({
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  },
  routes: [
    {
      path: '/login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/admin',
      component: () => import('../views/admin/AdminView.vue'),
      redirect: '/admin/authorize/leader',
      children: [
        {
          path: 'authorize/leader',
          component:() => import('../views/admin/AuthorizeLeaderView.vue')
        },
        {
          path: 'authorize/referee',
          component:() => import('../views/admin/AuthorizeRefereeView.vue')
        }
      ]
    },
    {
      path: '/visitor',
      component: () => import('../views/visitor/VisitorView.vue'),
      redirect: '/visitor/match-a',
      children: [
        {
          path: 'match-a', // 相对于 /visitor
          component: () => import('../views/visitor/MatchAView.vue')
        },
        {
          path: 'match-b', // 相对于 /visitor
          component: () => import('../views/visitor/MatchBView.vue')
        }
      ]
    },
    {
      path: '/leader/register',
      component: () => import('../views/leader/LeaderRegisterView.vue')
    },
    {
      path: '/referee/register',
      component: () => import('../views/referee/RefereeRegisterView.vue')
    },
    {
      path: '/leader',
      component: () => import('../views/leader/LeaderView.vue')
    },
    {
      path: '/referee',
      component: () => import('../views/referee/RefereeView.vue')
    }
  ]
});

export default router;