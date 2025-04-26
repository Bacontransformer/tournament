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
          path: 'event/match-a/:eventId/edit/:matchAId?',
          component: () => import('../views/admin/MatchADialogView.vue'),
          props: true
        },
        {
          path: 'event/match-a/:eventId/mode/:matchAId',
          component: () => import('../views/admin/MatchModeView.vue'),
          props: true
        },
        {
          path: 'event/match-a/:eventId/mode-dialog/:matchAId/:matchModeId?',
          component: () => import('../views/admin/MatchModeDialogView.vue'),
          props: true
        },
        {
          path: 'event/match-b/:eventId',
          component: () => import('../views/admin/MatchBView.vue'),
          props: true
        },
        {
          path: 'event/match-b/:eventId/edit/:matchBId?',
          component: () => import('../views/admin/MatchBDialogView.vue'),
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
        },
        {
          path: 'match-a/:status/:matchModeId',
          name: 'MatchADetail',
          component: () => import('../views/visitor/MatchADetailView.vue'),
          props: true
        },
        {
          path: 'match-b/:status/:matchModeId',
          name: 'MatchBDetail',
          component: () => import('../views/visitor/MatchBDetailView.vue'),
          props: true
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
      component: () => import('../views/leader/LeaderView.vue'),
      redirect: '/leader/player',
      children: [
        {
          path: 'player',
          component: () => import('../views/leader/PlayerView.vue')
        },
        {
          path: 'player/edit/:playerId?',
          component: () => import('../views/leader/PlayerDialogView.vue'),
          props: true
        },
        {
          path: 'match-a',
          component: () => import('../views/leader/MatchAView.vue')
        },
        {
          path: 'match-b',
          component: () => import('../views/leader/MatchBView.vue')
        },
        {
          path: 'match-a/edit/:matchModeId',
          component: () => import('../views/leader/MatchADialogView.vue'),
          props: true
        },
        {
          path: 'match-b',
          component: () => import('../views/leader/MatchBView.vue')
        },
        {
          path: 'match-b/edit/:matchBId?',
          component: () => import('../views/leader/MatchBDialogView.vue'),
          props: true
        }
      ]
    },
    {
      path: '/referee',
      component: () => import('../views/referee/RefereeView.vue'),
      redirect: '/referee/match-a',
      children: [
        {
          path: 'match-a',
          component: () => import('../views/referee/MatchAView.vue')
        },
        {
          path: 'match-b',
          component: () => import('../views/referee/MatchBView.vue')
        },
        {
          path: 'match-a/:matchModeId',
          component: () => import('../views/referee/MatchAScoreView.vue'),
          props: true
        },
        {
          path: 'match-b/:matchBId',
          component: () => import('../views/referee/MatchBScoreView.vue'),
          props: true
        }
      ]
    }
  ]
});

export default router;