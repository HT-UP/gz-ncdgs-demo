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
      {
        path: 'datasource',
        name: 'DataSource',
        redirect: '/datasource/list',
        children: [
          {
            path: 'list',
            name: 'DataSourceList',
            component: () => import('@/pages/datasource/list.vue'),
          },
          {
            path: 'register',
            name: 'DataSourceRegister',
            component: () => import('@/pages/datasource/register.vue'),
          },
          {
            path: 'connection-pool',
            name: 'ConnectionPool',
            component: () => import('@/pages/datasource/connection-pool.vue'),
          },
          {
            path: 'template',
            name: 'TemplateManage',
            component: () => import('@/pages/datasource/template.vue'),
          },
          {
            path: 'group',
            name: 'DataSourceGroup',
            component: () => import('@/pages/datasource/group.vue'),
          },
          {
            path: 'monitor',
            name: 'DataSourceMonitor',
            component: () => import('@/pages/datasource/monitor.vue'),
          },
        ],
      },
      {
        path: 'metadata',
        name: 'Metadata',
        redirect: '/metadata/overview',
        children: [
          {
            path: 'overview',
            name: 'MetadataOverview',
            component: () => import('@/pages/metadata/overview.vue'),
          },
          {
            path: 'model',
            name: 'MetadataModel',
            component: () => import('@/pages/metadata/model.vue'),
          },
          {
            path: 'data-element',
            name: 'DataElement',
            component: () => import('@/pages/metadata/data-element.vue'),
          },
          {
            path: 'collection',
            name: 'MetadataCollection',
            component: () => import('@/pages/metadata/collection.vue'),
          },
          {
            path: 'lineage',
            name: 'LineageAnalysis',
            component: () => import('@/pages/metadata/lineage.vue'),
          },
          {
            path: 'tag',
            name: 'DataTag',
            component: () => import('@/pages/metadata/tag.vue'),
          },
        ],
      },
    ],
  },
]
