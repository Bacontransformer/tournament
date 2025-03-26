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
        },
        {
          path: 'event',
          component:() => import('../views/admin/EventView.vue')
        },
        {
          path: 'event/edit/:eventId?', // 新增路由（支持新建和编辑）
          component: () => import('../views/admin/EventDialogView.vue')
        },
        {
          path: 'event/match-a/:eventId',
          component: () => import('../views/admin/MatchAView.vue'), // 注意路径层级
          props: true // 启用路由参数传递
        },
        {
          path: 'event/match-b/:eventId',
          component: () => import('../views/admin/MatchBView.vue'),
          props: true
        },
        {
          path: 'event/match-a/:eventId/edit/:matchAId?',
          component: () => import('../views/admin/MatchADialogView.vue'),
          props: true
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