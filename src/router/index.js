import Vue from 'vue';
import Router from 'vue-router';
import Layout from '@/views/Layout';
import Home from '@/views/Home';
import About from '@/views/About';
import Contact from '@/views/Contact';
import Rooms from '@/views/Rooms';
import CheckOrder from '@/views/CheckOrder';
import Room from '@/views/Room';

import store from '@/store';

Vue.use(Router);

const router = new Router({
  linkExactActiveClass: 'active',
  routes: [
    {
      path: '*',
      redirect: '/',
    },
    {
      path: '/',
      // name: 'Layout',
      component: Layout,
      children: [
        {
          path: '/',
          name: 'Home',
          component: Home,
        },
        {
          path: '/about',
          name: 'About',
          component: About,
        },
        {
          path: '/contact',
          name: 'Contact',
          component: Contact,
        },
        {
          path: '/rooms',
          name: 'Rooms',
          component: Rooms,
        },
        {
          path: '/rooms/:roomId',
          name: 'Room',
          component: Room,
        },
        {
          path: '/checkorder',
          name: 'CheckOrder',
          component: CheckOrder,
          // 有 query.roomId 才可進入 Checkout 頁面
          beforeEnter(to, from, next) {
            if (to.query.roomId) {
              next();
            } else {
              next('/');
            }
          },
        },
      ],
    },
  ],
  // 換頁時跳到頂部
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

// 進入下個頁面前
router.beforeEach((to, from, next) => {
  // 清空 calendar 設定
  store.dispatch('calendarModules/resetCalendar');
  // 清空 search 設定
  store.dispatch('searchModules/resetSearch');
  next();
});

export default router;
