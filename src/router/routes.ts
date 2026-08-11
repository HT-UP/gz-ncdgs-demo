import type { RouteRecordRaw } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import Workbench from '@/pages/Workbench.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
    redirect: '/dashboard',
    children: [
      { path: 'dashboard', name: 'dashboard', component: Workbench },
      {
        path: 'standard',
        name: 'Standard',
        redirect: '/standard/list',
        children: [
          {
            path: 'list',
            name: 'StandardList',
            component: () => import('@/pages/standard/list.vue'),
          },
          {
            path: 'model-design',
            name: 'ModelDesign',
            component: () => import('@/pages/standard/model-design.vue'),
          },
          {
            path: 'quality-standard',
            name: 'QualityStandard',
            component: () => import('@/pages/standard/quality-standard.vue'),
          },
          {
            path: 'implementation',
            name: 'Implementation',
            component: () => import('@/pages/standard/implementation.vue'),
          },
          {
            path: 'version',
            name: 'StandardVersion',
            component: () => import('@/pages/standard/version.vue'),
          },
        ],
      },
    ],
  },
]
